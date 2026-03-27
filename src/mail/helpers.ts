export const encodedEmail = (email: FormDataEntryValue | null): string => encodeURIComponent(String(email));

export const brevoApiUrl = 'https://api.brevo.com/v3';

export const brevoEndpoints = {
  contacts: `${brevoApiUrl}/contacts`,
  smtpBlockedContacts: `${brevoApiUrl}/smtp/blockedContacts`,
};

export const requestHeaders = {
  'Content-Type': 'application/json',
  ...(process.env.BREVO_TOKEN && {
    'api-key': process.env.BREVO_TOKEN,
  }),
};

export const deleteUser = async ({
  email,
}: {
  email: FormDataEntryValue | null;
}): Promise<boolean> => {
  try {
    const requestUrl = `${brevoEndpoints.contacts}/${encodedEmail(email)}`;
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
