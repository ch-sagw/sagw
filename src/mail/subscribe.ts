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

    return response.status === 204;
  } catch {
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
    const createResponse = await fetch(brevoEndpoints.contacts, {
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
    const response = await fetch(requestUrl, {
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

    return response.status === 201;
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

    // Give Brevo's workflow engine time to observe the "removed from list"
    // event before we re-add the contact. Without this gap the remove/add pair
    // can be coalesced and the DOI workflow's re-entry condition does not
    // fire, so no new confirmation email is sent on a repeat sign-up.
    if (listsToRefresh.length > 0) {
      await new Promise((resolve) => {
        setTimeout(resolve, 5_000);
      });
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
