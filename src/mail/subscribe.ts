/* eslint-disable max-len */
/*
API documentation: https://developers.brevo.com/reference/create-contact
Unblock campaign email / blocklist: https://developers.brevo.com/reference/update-contact (emailBlacklisted)
Unblock transactional (SMTP) blocklist: https://developers.brevo.com/reference/unblock-or-resubscribe-a-transactional-contact
DOI workflow creation: https://help.brevo.com/hc/en-us/articles/27353832123026-Set-up-a-double-opt-in-process-for-a-sign-up-form-created-outside-of-Brevo
Admin console: https://app.brevo.com/

Also: for the workflow, a re-entry condition must be defined (if a user subscribes, never confirms, and then subscribes again): go to the workflow -> settings -> Neustartbedingungen. Add a condition "Kontakt aus der Liste gelöscht" and select the corresponding lists. For DE+FR newsletter forms, include all four Brevo lists (both temp and both final) in that condition.

If subscription throws an error, make sure that the IP is not blocked by brevo:
https://app.brevo.com/security/authorised_ips

*/
/* eslint-enable max-len */

import 'server-only';
import {
  brevoEndpoints, encodedEmail,
  requestHeaders,
} from '@/mail/helpers';

/** Error-path only (server terminal / host logs, not the browser). */
const logSubscribe = (
  where: string,
  detail?: Record<string, unknown>,
): void => {
  console.error('[brevo/subscribe]', where, detail ?? {});
};

/** Redact email for logs (keeps first 2 chars of local part + domain). */
const logEmail = (email: FormDataEntryValue | null): string => {
  if (email === null) {
    return '(null)';
  }

  const s = String(email)
    .trim();

  if (s.length === 0) {
    return '(empty)';
  }

  const at = s.indexOf('@');

  if (at < 1) {
    return '(no-at)';
  }

  const local = s.slice(0, at);
  const domain = s.slice(at + 1);

  return `${local.length <= 2
    ? `${local}*`
    : `${local.slice(0, 2)}***`}@${domain}`;
};

const contactAttributesBody = ({
  firstname,
  lastname,
}: {
  firstname: FormDataEntryValue | null;
  lastname: FormDataEntryValue | null;
}): {
  attributes: {
    'FNAME': FormDataEntryValue | null;
    'LNAME': FormDataEntryValue | null;
  };
} => ({
  /* eslint-disable quote-props */
  attributes: {
    'FNAME': firstname,
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
    const response = await fetch(requestUrl, {
      headers: requestHeaders,
      method: 'GET',
    });

    if (response.status === 404) {
      return {
        status: 'not_found',
      };
    }

    if (response.status !== 200) {
      let bodySnippet = '';

      try {
        bodySnippet = (await response.text())
          .slice(0, 500);
      } catch {

        /* ignore */
      }
      logSubscribe('getContact: unexpected HTTP status', {
        bodySnippet,
        email: logEmail(email),
        status: response.status,
      });

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
  } catch (err) {
    logSubscribe('getContact: catch', {
      email: logEmail(email),
      error: err instanceof Error
        ? err.message
        : String(err),
    });

    return {
      status: 'error',
    };
  }
};

const unblockContactEmailCampaigns = async (email: FormDataEntryValue | null): Promise<boolean> => {
  try {
    const response = await fetch(
      `${brevoEndpoints.contacts}/${encodedEmail(email)}`,
      {
        body: JSON.stringify({
          emailBlacklisted: false,
        }),
        headers: requestHeaders,
        method: 'PUT',
      },
    );

    if (response.status !== 204) {
      logSubscribe('unblockContactEmailCampaigns: unexpected status', {
        email: logEmail(email),
        status: response.status,
      });

      return false;
    }

    return true;
  } catch (err) {
    logSubscribe('unblockContactEmailCampaigns: catch', {
      email: logEmail(email),
      error: err instanceof Error
        ? err.message
        : String(err),
    });

    return false;
  }
};

const unblockTransactionalContact = async (email: FormDataEntryValue | null): Promise<boolean> => {
  try {
    const response = await fetch(
      `${brevoEndpoints.smtpBlockedContacts}/${encodedEmail(email)}`,
      {
        headers: requestHeaders,
        method: 'DELETE',
      },
    );

    if (response.status === 204 || response.status === 404) {
      return true;
    }
    logSubscribe('unblockTransactionalContact: unexpected status', {
      email: logEmail(email),
      status: response.status,
    });

    return false;
  } catch (err) {
    logSubscribe('unblockTransactionalContact: catch', {
      email: logEmail(email),
      error: err instanceof Error
        ? err.message
        : String(err),
    });

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
}: {
  email: FormDataEntryValue | null;
  firstname: FormDataEntryValue | null;
  lastname: FormDataEntryValue | null;
}): Promise<CreateUserResult> => {
  try {
    const existing = await getContact(email);

    // contact already exists
    if (existing.status === 'found') {
      if (existing.emailBlacklisted) {
        const campaignOk = await unblockContactEmailCampaigns(email);

        if (!campaignOk) {
          logSubscribe('createUser: unblockContactEmailCampaigns failed', {
            email: logEmail(email),
          });

          return {
            ok: false,
          };
        }

        const transactionalOk = await unblockTransactionalContact(email);

        if (!transactionalOk) {
          logSubscribe('createUser: unblockTransactionalContact failed', {
            email: logEmail(email),
          });

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
      logSubscribe('createUser: getContact returned error', {
        email: logEmail(email),
      });

      return {
        ok: false,
      };
    }

    // contact does not exists. create it.
    const createResponse = await fetch(brevoEndpoints.contacts, {
      body: JSON.stringify({
        email,
        ...contactAttributesBody({
          firstname,
          lastname,
        }),
      }),
      headers: requestHeaders,
      method: 'POST',
    });

    if (createResponse.status !== 201) {
      let bodySnippet = '';

      try {
        bodySnippet = (await createResponse.text())
          .slice(0, 500);
      } catch {

        /* ignore */
      }
      logSubscribe('createUser: POST contact unexpected status', {
        bodySnippet,
        email: logEmail(email),
        status: createResponse.status,
      });

      return {
        ok: false,
      };
    }

    return {
      listIds: [],
      ok: true,
    };

  } catch (err) {
    logSubscribe('createUser: catch', {
      email: logEmail(email),
      error: err instanceof Error
        ? err.message
        : String(err),
    });

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
    const response = await fetch(requestUrl, {
      body: JSON.stringify({
        emails: [String(email)],
      }),
      headers: requestHeaders,
      method: 'POST',
    });

    if (response.status !== 201) {
      let bodySnippet = '';

      try {
        bodySnippet = (await response.text())
          .slice(0, 500);
      } catch {

        /* ignore */
      }
      logSubscribe('addUserToList: unexpected status', {
        bodySnippet,
        email: logEmail(email),
        listId,
        status: response.status,
      });

      return false;
    }

    return true;
  } catch (err) {
    logSubscribe('addUserToList: catch', {
      email: logEmail(email),
      error: err instanceof Error
        ? err.message
        : String(err),
      listId,
    });

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
    const response = await fetch(requestUrl, {
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
      logSubscribe('removeUserFromList: unexpected HTTP status', {
        email: logEmail(email),
        listId,
        status: response.status,
      });

      return false;
    }

    const body = (await response.json()) as InterfaceBrevoListOpResponse;
    const successList = Array.isArray(body?.contacts?.success)
      ? body.contacts.success.map((entry) => String(entry)
        .toLowerCase())
      : [];
    const normalizedEmail = String(email)
      .toLowerCase();

    if (successList.includes(normalizedEmail)) {
      return true;
    }
    logSubscribe('removeUserFromList: email not in contacts.success', {
      email: logEmail(email),
      failureSample: Array.isArray(body?.contacts?.failure)
        ? body.contacts.failure.slice(0, 3)
        : undefined,
      listId,
      successListSample: successList.slice(0, 5),
    });

    return false;
  } catch (err) {
    logSubscribe('removeUserFromList: catch', {
      email: logEmail(email),
      error: err instanceof Error
        ? err.message
        : String(err),
      listId,
    });

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
  listId: number;
  listIdTemp: number;

  /**
   * Other locale’s temp DOI list only. We purge `{listId, listIdTemp}` and this
   * id so a pending opt-in elsewhere does not block signup. We do not purge the
   * other final list — the same email may stay on both language finals.
   */
  peerTemporaryListId: number;
}

type InterfaceSubscribeReturnValue =
  'pendingVerification' |
  'generalError';

export const subscribe = async ({
  firstname,
  lastname,
  email,
  listId,
  listIdTemp,
  peerTemporaryListId,
}: InterfaceSubscribeProps): Promise<InterfaceSubscribeReturnValue> => {
  try {
    const userResult = await createUser({
      email,
      firstname,
      lastname,
    });

    if (!userResult.ok) {
      logSubscribe('subscribe: createUser failed (see earlier createUser logs)', {
        email: logEmail(email),
        listId,
        listIdTemp,
      });

      return 'generalError';
    }

    const listIdsPurge: number[] = [
      ...new Set([
        Number(listId),
        Number(listIdTemp),
        Number(peerTemporaryListId),
      ]),
    ];

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

    const listsToRefresh = checkUserInLists(userResult.listIds, listIdsPurge);

    const removeResults = await Promise.all(listsToRefresh.map((id) => removeUserFromList({
      email,
      listId: id,
    })));

    if (removeResults.some((ok) => !ok)) {
      const failedListIds = listsToRefresh.filter((_, i) => !removeResults[i]);

      logSubscribe('subscribe: removeUserFromList failed for at least one list', {
        email: logEmail(email),
        failedListIds,
        listIdTemp,
        listIdsPurge,
      });

      return 'generalError';
    }

    const added = await addUserToList({
      email,
      listId: listIdTemp,
    });

    if (!added) {
      logSubscribe('subscribe: addUserToList failed (see addUserToList logs)', {
        email: logEmail(email),
        listIdTemp,
      });

      return 'generalError';
    }

    return 'pendingVerification';
  } catch (err) {
    logSubscribe('subscribe: catch', {
      email: logEmail(email),
      error: err instanceof Error
        ? err.message
        : String(err),
      listId,
      listIdTemp,
    });

    return 'generalError';
  }
};
