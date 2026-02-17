/* eslint-disable max-len */
/*
API documentation: https://developers.brevo.com/reference/create-contact
DOI workflow creation: https://help.brevo.com/hc/en-us/articles/27353832123026-Set-up-a-double-opt-in-process-for-a-sign-up-form-created-outside-of-Brevo
Admin console: https://app.brevo.com/
Also: create custom contact attribute for LANG: https://my.brevo.com/lists/add-attributes
*/
/* eslint-enable max-len */

import 'server-only';

const brevoApiUrl = 'https://api.brevo.com/v3';
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
    const response = await fetch(requestUrl, {
      headers: requestHeaders,
      method: 'GET',
    });

    if (response.status !== 200) {
      return 'none';
    }

    const data = await response.json();
    const listIdsAsNumbers = data.listIds.map((id: unknown) => Number(id));

    if (listIdsAsNumbers.includes(Number(listIdTemp))) {
      return 'tempList';
    } else if (listIdsAsNumbers.includes(Number(listId))) {
      return 'finalList';
    }

    return 'none';

  } catch {
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
    const response = await fetch(requestUrl, {
      headers: requestHeaders,
      method: 'DELETE',
    });

    if (response.status === 204) {
      return true;
    }

    return false;
  } catch {
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

    if (response.status === 201) {
      return 'pendingVerification';
    }

    return 'generalError';
  } catch {
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
    const alreadySubscribed = await userIsAlreadySubscribed({
      email,
      listId,
      listIdTemp,
    });

    if (alreadySubscribed === 'none') {
      const subscribeResult = await subscribeAction({
        email,
        firstname,
        language,
        lastname,
        listIdTemp,
      });

      return subscribeResult;
    } else if (alreadySubscribed === 'finalList' || alreadySubscribed === 'tempList') {
      const userDeleted = await deleteUser({
        email,
      });

      if (!userDeleted) {
        return 'generalError';
      }

      const subscribeResult = await subscribeAction({
        email,
        firstname,
        language,
        lastname,
        listIdTemp,
      });

      return subscribeResult;
    }

    return 'generalError';
  } catch {
    return 'generalError';
  }

};
