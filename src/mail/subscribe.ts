/* eslint-disable max-len */
/*
API documentation: https://developers.brevo.com/reference/create-contact
Unblock campaign email / blocklist: https://developers.brevo.com/reference/update-contact (emailBlacklisted)
Unblock transactional (SMTP) blocklist: https://developers.brevo.com/reference/unblock-or-resubscribe-a-transactional-contact
DOI workflow creation: https://help.brevo.com/hc/en-us/articles/27353832123026-Set-up-a-double-opt-in-process-for-a-sign-up-form-created-outside-of-Brevo
Admin console: https://app.brevo.com/
Also: create custom contact attribute for LANG: https://my.brevo.com/lists/add-attributes

Also: for the workflow, a re-entry condition must be defined (if a user subscribes, never confirms, and then subscribes again): go to the workflow -> settings -> Neustartbedingungen. Add a condition "Kontakt aus der Liste gelöscht" and select the corresponding lists.

If subscription throws an error, make sure that the IP is not blocked by brevo:
https://app.brevo.com/security/authorised_ips

*/
/* eslint-enable max-len */

// TODO:
// - add better logging

import 'server-only';
import {
  brevoEndpoints, encodedEmail,
  requestHeaders,
} from '@/mail/helpers';

// Retry helper for Brevo calls. Brevo's API occasionally answers with
// transient 5xx / 429 responses or drops the TCP connection; without a
// retry a single blip makes `subscribe` return `'generalError'` and the
// user sees the error notification instead of the success notification.
// We retry only on network errors, HTTP 429 and HTTP >= 500. All other
// 4xx responses (real client errors) are returned as-is so the caller's
// status-code checks continue to work.
const sleep = (ms: number): Promise<void> => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const retryBackoffsMs = [
  0,
  500,
  1_500,
];

const fetchWithRetry = async (
  url: string,
  init: RequestInit,
  attempt = 0,
): Promise<Response> => {
  const delayMs = retryBackoffsMs[attempt];

  if (delayMs > 0) {
    await sleep(delayMs);
  }

  const isLastAttempt = attempt >= retryBackoffsMs.length - 1;

  try {
    const response = await fetch(url, init);
    const isRetryableStatus = response.status === 429 || response.status >= 500;

    if (isRetryableStatus && !isLastAttempt) {
      return fetchWithRetry(url, init, attempt + 1);
    }

    return response;
  } catch (error) {
    if (!isLastAttempt) {
      return fetchWithRetry(url, init, attempt + 1);
    }

    throw error instanceof Error
      ? error
      : new Error('Brevo request failed after retries.');
  }
};

const contactAttributesBody = ({
  firstname,
  lastname,
  language,
}: {
  firstname: FormDataEntryValue | null;
  lastname: FormDataEntryValue | null;
  language: FormDataEntryValue | null;
}): {
  attributes: {
    'FNAME': FormDataEntryValue | null;
    'LANG': FormDataEntryValue | null;
    'LNAME': FormDataEntryValue | null;
  };
} => ({
  /* eslint-disable quote-props */
  attributes: {
    'FNAME': firstname,
    'LANG': language,
    'LNAME': lastname,
  },
  /* eslint-enable quote-props */
});

const normalizeListIds = (listIds: unknown[] | undefined): number[] => {
  if (!Array.isArray(listIds)) {
    return [];
  }

  return listIds.map((id) => Number(id));
};

interface InterfaceBrevoContactGetResponse {
  emailBlacklisted?: boolean;
  listIds?: unknown[];
}

// ######################################################################
// Fetch contact (internal)
// ######################################################################

type GetContactResult =
  | { emailBlacklisted: boolean; listIds: number[]; status: 'found' }
  | { status: 'not_found' }
  | { status: 'error' };

const getContact = async (email: FormDataEntryValue | null): Promise<GetContactResult> => {
  try {
    const requestUrl = `${brevoEndpoints.contacts}/${encodedEmail(email)}`;
    const response = await fetchWithRetry(requestUrl, {
      headers: requestHeaders,
      method: 'GET',
    });

    if (response.status === 404) {
      return {
        status: 'not_found',
      };
    }

    if (response.status !== 200) {
      return {
        status: 'error',
      };
    }

    const data = (await response.json()) as InterfaceBrevoContactGetResponse;

    return {
      emailBlacklisted: data.emailBlacklisted === true,
      listIds: normalizeListIds(data.listIds),
      status: 'found',
    };
  } catch {
    return {
      status: 'error',
    };
  }
};

const unblockContactEmailCampaigns = async (email: FormDataEntryValue | null): Promise<boolean> => {
  try {
    const response = await fetchWithRetry(
      `${brevoEndpoints.contacts}/${encodedEmail(email)}`,
      {
        body: JSON.stringify({
          emailBlacklisted: false,
        }),
        headers: requestHeaders,
        method: 'PUT',
      },
    );

    return response.status === 204;
  } catch {
    return false;
  }
};

const unblockTransactionalContact = async (email: FormDataEntryValue | null): Promise<boolean> => {
  try {
    const response = await fetchWithRetry(
      `${brevoEndpoints.smtpBlockedContacts}/${encodedEmail(email)}`,
      {
        headers: requestHeaders,
        method: 'DELETE',
      },
    );

    return response.status === 204 || response.status === 404;
  } catch {
    return false;
  }
};

// ######################################################################
// Create or ensure contact exists
// ######################################################################

type CreateUserResult =
  | { ok: true; listIds: number[] }
  | { ok: false };

const createUser = async ({
  email,
  firstname,
  lastname,
  language,
}: {
  email: FormDataEntryValue | null;
  firstname: FormDataEntryValue | null;
  lastname: FormDataEntryValue | null;
  language: FormDataEntryValue | null;
}): Promise<CreateUserResult> => {
  try {
    const existing = await getContact(email);

    // contact already exists
    if (existing.status === 'found') {
      if (existing.emailBlacklisted) {
        const campaignOk = await unblockContactEmailCampaigns(email);

        if (!campaignOk) {
          return {
            ok: false,
          };
        }

        const transactionalOk = await unblockTransactionalContact(email);

        if (!transactionalOk) {
          return {
            ok: false,
          };
        }
      }

      return {
        listIds: existing.listIds,
        ok: true,
      };
    }

    // error getting contact info
    if (existing.status === 'error') {
      return {
        ok: false,
      };
    }

    // contact does not exists. create it.
    const createResponse = await fetchWithRetry(brevoEndpoints.contacts, {
      body: JSON.stringify({
        email,
        ...contactAttributesBody({
          firstname,
          language,
          lastname,
        }),
      }),
      headers: requestHeaders,
      method: 'POST',
    });

    if (createResponse.status !== 201) {
      return {
        ok: false,
      };
    }

    return {
      listIds: [],
      ok: true,
    };

  } catch {
    return {
      ok: false,
    };
  }
};

// ######################################################################
// List membership
// ######################################################################

const checkUserInLists = (
  contactListIds: number[],
  targetListIds: number[],
): number[] => {
  const targets = new Set(targetListIds.map((id) => Number(id)));

  return contactListIds
    .map((id) => Number(id))
    .filter((id) => targets.has(id));
};

const addUserToList = async ({
  email,
  listId,
}: {
  email: FormDataEntryValue | null;
  listId: number;
}): Promise<boolean> => {
  try {
    const requestUrl =
      `${brevoEndpoints.contacts}/lists/${Number(listId)}/contacts/add`;
    const response = await fetchWithRetry(requestUrl, {
      body: JSON.stringify({
        emails: [String(email)],
      }),
      headers: requestHeaders,
      method: 'POST',
    });

    return response.status === 201;
  } catch {
    return false;
  }
};

interface InterfaceBrevoListOpResponse {
  contacts?: {
    success?: unknown[];
    failure?: unknown[];
  };
}

const removeUserFromList = async ({
  email,
  listId,
}: {
  email: FormDataEntryValue | null;
  listId: number;
}): Promise<boolean> => {
  try {
    const requestUrl =
      `${brevoEndpoints.contacts}/lists/${Number(listId)}/contacts/remove`;
    const response = await fetchWithRetry(requestUrl, {
      body: JSON.stringify({
        emails: [String(email)],
      }),
      headers: requestHeaders,
      method: 'POST',
    });

    // Brevo's remove endpoint returns 201 regardless of whether any
    // emails were actually removed. The actual outcome is in the
    // response body's `contacts.success` / `contacts.failure` arrays,
    // so we have to parse it rather than trust the status code.
    if (response.status !== 201) {
      return false;
    }

    const body = (await response.json()) as InterfaceBrevoListOpResponse;
    const successList = Array.isArray(body?.contacts?.success)
      ? body.contacts.success.map((entry) => String(entry)
        .toLowerCase())
      : [];
    const normalizedEmail = String(email)
      .toLowerCase();

    return successList.includes(normalizedEmail);
  } catch {
    return false;
  }
};

// ######################################################################
// Subscribe user
// ######################################################################

interface InterfaceSubscribeProps {
  firstname: FormDataEntryValue | null;
  lastname: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  language: FormDataEntryValue | null;
  listId: number;
  listIdTemp: number;
}

type InterfaceSubscribeReturnValue =
  'pendingVerification' |
  'generalError';

export const subscribe = async ({
  firstname,
  lastname,
  email,
  language,
  listId,
  listIdTemp,
}: InterfaceSubscribeProps): Promise<InterfaceSubscribeReturnValue> => {
  try {
    const userResult = await createUser({
      email,
      firstname,
      language,
      lastname,
    });

    if (!userResult.ok) {
      return 'generalError';
    }

    // Contact is already on the DOI temp list (previously signed up
    // but never confirmed). Do NOT attempt remove + add here: while
    // Brevo's DOI workflow is in its "waiting for confirmation" state,
    // it ignores external list removals (the remove call returns a
    // success body but the contact stays on the list, and the
    // subsequent add then fails with `400 Contact already in list`).
    // Brevo's DOI workflow re-sends the confirmation email on its own
    // when a pending contact re-submits, so returning
    // `pendingVerification` here is the correct behaviour.
    if (userResult.listIds.includes(Number(listIdTemp))) {
      return 'pendingVerification';
    }

    const listsToRefresh = checkUserInLists(userResult.listIds, [
      listId,
      listIdTemp,
    ]);

    const removeResults = await Promise.all(listsToRefresh.map((id) => removeUserFromList({
      email,
      listId: id,
    })));

    if (removeResults.some((ok) => !ok)) {
      return 'generalError';
    }

    const added = await addUserToList({
      email,
      listId: listIdTemp,
    });

    if (!added) {
      return 'generalError';
    }

    return 'pendingVerification';
  } catch {
    return 'generalError';
  }
};
