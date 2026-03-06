/* eslint-disable max-len */
/*
API documentation: https://developers.brevo.com/reference/create-contact
DOI workflow creation: https://help.brevo.com/hc/en-us/articles/27353832123026-Set-up-a-double-opt-in-process-for-a-sign-up-form-created-outside-of-Brevo
Admin console: https://app.brevo.com/
Also: create custom contact attribute for LANG: https://my.brevo.com/lists/add-attributes

If subscription throws an error, make sure that the IP is not blocked by brevo:
https://app.brevo.com/security/authorised_ips

*/
/* eslint-enable max-len */

import 'server-only';

const brevoApiUrl = 'https://api.brevo.com/v3';

// TODO: remove
const isBrevoDebugEnabled = process.env.DEBUG_BREVO_TESTS === 'true';

const brevoSubscribeDebug = (message: string, payload?: Record<string, unknown>): void => {
  if (!isBrevoDebugEnabled) {
    return;
  }

  const timestamp = new Date()
    .toISOString();
  const serializedPayload = payload
    ? ` ${JSON.stringify(payload)}`
    : '';

  process.stdout.write(`[brevo-subscribe-debug ${timestamp}] ${message}${serializedPayload}\n`);
};

const safeTextFromResponse = async (response: Response): Promise<string | undefined> => {
  try {
    const text = await response.text();

    if (!text) {
      return undefined;
    }

    return text.length > 2000
      ? `${text.slice(0, 2000)}...[truncated]`
      : text;
  } catch {
    return undefined;
  }
};
// END

const brevoEndpoints = {
  contacts: `${brevoApiUrl}/contacts`,
};
const requestHeaders = {
  'Content-Type': 'application/json',
  ...(process.env.BREVO_TOKEN && {
    'api-key': process.env.BREVO_TOKEN,
  }),
};

// ######################################################################
// Check if user is already subscribed
// ######################################################################

interface InterfaceUserIsAlreadySubscribedProps {
  email: FormDataEntryValue | null;
  listId: number;
  listIdTemp: number;
}

type InterfaceUserIsAlreadySubscribedReturnValue =
  'finalList' |
  'tempList' |
  'none' |
  'error';

const userIsAlreadySubscribed = async ({
  email,
  listId,
  listIdTemp,
}: InterfaceUserIsAlreadySubscribedProps): Promise<InterfaceUserIsAlreadySubscribedReturnValue> => {
  try {
    const encodedEmail = encodeURIComponent(String(email));
    const requestUrl = `${brevoEndpoints.contacts}/${encodedEmail}`;

    // TODO: remove
    brevoSubscribeDebug('userIsAlreadySubscribed:request', {
      email: String(email),
      listId,
      listIdTemp,
      requestUrl,
    });
    // END

    const response = await fetch(requestUrl, {
      headers: requestHeaders,
      method: 'GET',
    });

    // TODO: remove
    brevoSubscribeDebug('userIsAlreadySubscribed:response', {
      email: String(email),
      status: response.status,
    });
    // END

    if (response.status !== 200) {

      // TODO: remove
      const responseBody = await safeTextFromResponse(response);

      brevoSubscribeDebug('userIsAlreadySubscribed:not-200', {
        email: String(email),
        responseBody,
        status: response.status,
      });
      // END

      return 'none';
    }

    const data = await response.json();
    const listIdsAsNumbers = data.listIds.map((id: unknown) => Number(id));

    if (listIdsAsNumbers.includes(Number(listIdTemp))) {

      // TODO: remove
      brevoSubscribeDebug('userIsAlreadySubscribed:result', {
        email: String(email),
        result: 'tempList',
      });
      // END

      return 'tempList';
    } else if (listIdsAsNumbers.includes(Number(listId))) {

      // TODO: remove
      brevoSubscribeDebug('userIsAlreadySubscribed:result', {
        email: String(email),
        result: 'finalList',
      });
      // END

      return 'finalList';
    }

    // TODO: remove
    brevoSubscribeDebug('userIsAlreadySubscribed:result', {
      email: String(email),
      result: 'none',
    });
    // END

    return 'none';

  } catch {

    // TODO: remove
    brevoSubscribeDebug('userIsAlreadySubscribed:error', {
      email: String(email),
    });
    // END

    return 'error';
  }
};

// ######################################################################
// Delete existing user
// ######################################################################
const deleteUser = async ({
  email,
}: {
  email: FormDataEntryValue | null;
}): Promise<boolean> => {
  try {
    const encodedEmail = encodeURIComponent(String(email));
    const requestUrl = `${brevoEndpoints.contacts}/${encodedEmail}`;

    // TODO: remove
    brevoSubscribeDebug('deleteUser:request', {
      email: String(email),
      requestUrl,
    });
    // END

    const response = await fetch(requestUrl, {
      headers: requestHeaders,
      method: 'DELETE',
    });

    // TODO: remove
    const responseBody = response.status === 204
      ? undefined
      : await safeTextFromResponse(response);

    brevoSubscribeDebug('deleteUser:response', {
      email: String(email),
      responseBody,
      status: response.status,
    });
    // END

    if (response.status === 204) {
      return true;
    }

    return false;
  } catch {

    // TODO: remove
    brevoSubscribeDebug('deleteUser:error', {
      email: String(email),
    });
    // END

    return false;
  }

};

// ######################################################################
// Subscribe helper
// ######################################################################

interface InterfaceSubscribeActionProps {
  firstname: FormDataEntryValue | null;
  lastname: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  language: FormDataEntryValue | null;
  listIdTemp: number;
}

type InterfaceSubscribeReturnValue =
  'pendingVerification' |
  'generalError';

const subscribeAction = async ({
  firstname,
  lastname,
  email,
  language,
  listIdTemp,
}: InterfaceSubscribeActionProps): Promise<InterfaceSubscribeReturnValue> => {
  try {
    const requestUrl = `${brevoEndpoints.contacts}`;

    // TODO: remove
    brevoSubscribeDebug('subscribeAction:request', {
      email: String(email),
      firstname: String(firstname),
      language: String(language),
      lastname: String(lastname),
      listIdTemp,
      requestUrl,
    });
    // END

    const response = await fetch(requestUrl, {
      body: JSON.stringify({
      /* eslint-disable quote-props */
        attributes: {
          'FNAME': firstname,
          'LANG': language,
          'LNAME': lastname,
        },
        email,
        listIds: [Number(listIdTemp)],
      /* eslint-enable quote-props */
      }),
      headers: requestHeaders,
      method: 'POST',
    });

    // TODO: remove
    const responseBody = response.status === 201
      ? undefined
      : await safeTextFromResponse(response);

    brevoSubscribeDebug('subscribeAction:response', {
      email: String(email),
      responseBody,
      status: response.status,
    });
    // END

    if (response.status === 201) {
      return 'pendingVerification';
    }

    return 'generalError';
  } catch {
    // TODO: remove
    brevoSubscribeDebug('subscribeAction:error', {
      email: String(email),
    });
    // END

    return 'generalError';
  }
};

// ######################################################################
// Subscribe user
// ######################################################################

interface InterfaceSubscribeProps extends InterfaceSubscribeActionProps {
  listId: number;
}

export const subscribe = async ({
  firstname,
  lastname,
  email,
  language,
  listId,
  listIdTemp,
}: InterfaceSubscribeProps): Promise<InterfaceSubscribeReturnValue> => {

  try {
    // TODO: remove
    brevoSubscribeDebug('subscribe:start', {
      email: String(email),
      listId,
      listIdTemp,
    });
    // END

    const alreadySubscribed = await userIsAlreadySubscribed({
      email,
      listId,
      listIdTemp,
    });

    // TODO: remove
    brevoSubscribeDebug('subscribe:alreadySubscribed', {
      alreadySubscribed,
      email: String(email),
    });
    // END

    if (alreadySubscribed === 'none') {
      const subscribeResult = await subscribeAction({
        email,
        firstname,
        language,
        lastname,
        listIdTemp,
      });

      // TODO: remove
      brevoSubscribeDebug('subscribe:result', {
        email: String(email),
        path: 'none',
        subscribeResult,
      });
      // END

      return subscribeResult;
    } else if (alreadySubscribed === 'finalList' || alreadySubscribed === 'tempList') {
      const userDeleted = await deleteUser({
        email,
      });

      if (!userDeleted) {
        // TODO: remove
        brevoSubscribeDebug('subscribe:result', {
          email: String(email),
          path: 'deleteUser-failed',
          subscribeResult: 'generalError',
        });
        // END

        return 'generalError';
      }

      const subscribeResult = await subscribeAction({
        email,
        firstname,
        language,
        lastname,
        listIdTemp,
      });

      // TODO: remove
      brevoSubscribeDebug('subscribe:result', {
        email: String(email),
        path: 'delete+resubscribe',
        subscribeResult,
      });
      // END

      return subscribeResult;
    }

    // TODO: remove
    brevoSubscribeDebug('subscribe:result', {
      email: String(email),
      path: 'alreadySubscribed-error',
      subscribeResult: 'generalError',
    });
    // END

    return 'generalError';
  } catch {
    // TODO: remove
    brevoSubscribeDebug('subscribe:error', {
      email: String(email),
    });
    // END

    return 'generalError';
  }

};
