/*
API documentation: https://dev.mailxpert.ch/
Admin console: https://app.mailxpert.ch/
*/

import 'server-only';

const mailxpertContactsUrl = 'https://api.mailxpert.ch/v2.0/contacts';
const mailxpertContactListsUrl = 'https://api.mailxpert.ch/v2.0/contact_lists';
const pendingVerificationErrorText = 'An e-mail with a verification link has already been sent to this e-mail address.';
const apiEmailErrorCode = 422;

interface InterfaceUserIsAlreadySubscribedProps {
  email: FormDataEntryValue | null;
}

interface InterfaceGetContactListProps {
  name: string;
}

interface InterfaceSubscribeProps {
  firstname: FormDataEntryValue | null;
  lastname: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  language: FormDataEntryValue | null;
  listName: string;
}

interface InterfaceSubscribeReturnProps {
  status: 'alreadySubscribed' | 'generalError' | 'pendingVerification' | 'success';
}

const requestHeaders = {
  'Authorization': `Bearer ${process.env.MAILXPERT}`,
  'Content-Type': 'application/json',
};

const userIsAlreadySubscribed = async ({
  email,
}: InterfaceUserIsAlreadySubscribedProps): Promise<boolean> => {
  try {
    const cql = `email equals ${email}`;
    const response = await fetch(`${mailxpertContactsUrl}?cql=${encodeURIComponent(cql)}`, {
      headers: requestHeaders,
      method: 'GET',
    });

    if (!response.ok) {
      return false;
    }

    if (response.status !== 200) {
      return false;
    }

    const data = await response.json();

    if (data.data.length === 1) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

const getContactList = async ({
  name,
}: InterfaceGetContactListProps): Promise<string | false> => {
  try {
    const response = await fetch(mailxpertContactListsUrl, {
      headers: requestHeaders,
      method: 'GET',
    });

    if (!response.ok) {
      return false;
    }

    if (response.status !== 200) {
      return false;
    }

    const data = await response.json();

    if (data.data.length < 1) {
      return false;
    }

    const listIds = data.data.filter((item: any) => item.name === name);

    if (listIds.length === 1) {
      return listIds[0].id;
    }

    return false;

  } catch {
    return false;
  }
};

export const subscribe = async ({
  firstname,
  lastname,
  email,
  language,
  listName,
}: InterfaceSubscribeProps): Promise<InterfaceSubscribeReturnProps> => {

  try {
    const alreadySubscribed = await userIsAlreadySubscribed({
      email,
    });

    if (alreadySubscribed) {
      return {
        status: 'alreadySubscribed',
      };
    }

    const contactListId = await getContactList({
      name: listName,
    });

    if (!contactListId) {
      return {
        status: 'generalError',
      };
    }

    const response = await fetch(`${mailxpertContactsUrl}?double_opt_in=1`, {
      body: JSON.stringify({

        /* eslint-disable @typescript-eslint/naming-convention */
        contact_list_id: contactListId,
        /* eslint-enable @typescript-eslint/naming-convention */
        email,
        firstname,
        language,
        lastname,
      }),
      headers: requestHeaders,
      method: 'POST',
    });

    const data = await response.json();

    if (!response.ok) {

      if (data.code === apiEmailErrorCode) {
        const pendingVerification = data.errors.filter((error: any) => error.field === 'email' && error.message === pendingVerificationErrorText);

        if (pendingVerification.length === 1) {
          return {
            status: 'pendingVerification',
          };
        }
      }

      return {
        status: 'generalError',
      };
    }
    console.log(response);

    console.log(data);

    return {
      status: 'success',
    };
  } catch {
    return {
      status: 'generalError',
    };
  }

};

export const resubscribe = async ({
  firstname,
  lastname,
  email,
  language,
  listName,
}: InterfaceSubscribeProps): Promise<InterfaceSubscribeReturnProps> => {

  try {
    const alreadySubscribed = await userIsAlreadySubscribed({
      email,
    });

    if (alreadySubscribed) {
      return {
        status: 'alreadySubscribed',
      };
    }

    const contactListId = await getContactList({
      name: listName,
    });

    if (!contactListId) {
      return {
        status: 'generalError',
      };
    }

    const response = await fetch(`${mailxpertContactsUrl}/${email}/subscribe?double_opt_in=1`, {
      body: JSON.stringify({

        /* eslint-disable @typescript-eslint/naming-convention */
        contact_list_id: contactListId,
        /* eslint-enable @typescript-eslint/naming-convention */
        email,
        firstname,
        language,
        lastname,
      }),
      headers: requestHeaders,
      method: 'POST',
    });

    console.log('resubscribe response ---------');

    console.log(response);

    if (!response.ok) {
      const data = await response.json();

      console.log('resubscribe data ---------');
      console.log(data);

      if (data.code === apiEmailErrorCode) {
        const pendingVerification = data.errors.filter((error: any) => error.field === 'email' && error.message === pendingVerificationErrorText);

        if (pendingVerification.length === 1) {
          return {
            status: 'pendingVerification',
          };
        }
      }

      return {
        status: 'generalError',
      };
    }

    return {
      status: 'success',
    };
  } catch {
    return {
      status: 'generalError',
    };
  }

};
