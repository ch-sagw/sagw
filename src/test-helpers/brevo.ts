import { encodedEmail } from '@/mail/helpers';

const brevoApiUrl = 'https://api.brevo.com/v3';

interface InterfaceBrevoRequestProps {
  apiKey: string;
  pathname: string;
  searchParams?: Record<string, string | number | undefined>;
}

interface InterfaceBrevoContact {
  listIds?: number[];
}

interface InterfaceBrevoTransactionalEmailItem {
  date?: string;
  email?: string;
  subject?: string;
  uuid?: string;
}

interface InterfaceBrevoTransactionalEmailList {
  transactionalEmails?: InterfaceBrevoTransactionalEmailItem[];
}

interface InterfaceBrevoTransactionalEmailContent {
  body?: string;
}

interface InterfaceWaitForBrevoConfirmationLinkProps {
  apiKey: string;
  sentAfterMs: number;
  to: string;
  subjectIncludes?: string;
  timeoutMs?: number;
  pollIntervalMs?: number;
}

interface InterfaceWaitForBrevoContactListMembershipProps {
  apiKey: string;
  email: string;
  requiredListId: number;
  forbiddenListId?: number;
  timeoutMs?: number;
  pollIntervalMs?: number;
}

const sleep = async (ms: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const isFreshEnough = (dateAsString: string | undefined, sentAfterMs: number): boolean => {
  if (!dateAsString) {
    return false;
  }

  const dateMs = Date.parse(dateAsString);

  if (Number.isNaN(dateMs)) {
    return false;
  }

  return dateMs >= sentAfterMs;
};

const brevoRequest = async <T>({
  apiKey,
  pathname,
  searchParams,
}: InterfaceBrevoRequestProps): Promise<{
  response: Response;
  data: T | undefined;
}> => {
  const url = new URL(`${brevoApiUrl}${pathname}`);

  if (searchParams) {
    Object.entries(searchParams)
      .forEach(([
        key,
        value,
      ]) => {
        if (typeof value === 'undefined') {
          return;
        }

        url.searchParams.set(key, String(value));
      });
  }

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    method: 'GET',
  });

  if (response.status === 204) {
    return {
      data: undefined,
      response,
    };
  }

  const responseData = await response.json()
    .catch(() => undefined) as T | undefined;

  return {
    data: responseData,
    response,
  };
};

const getLatestTransactionalEmail = async ({
  apiKey,
  sentAfterMs,
  subjectIncludes,
  to,
}: {
  apiKey: string;
  sentAfterMs: number;
  subjectIncludes?: string;
  to: string;
}): Promise<InterfaceBrevoTransactionalEmailItem | undefined> => {
  const {
    data,
    response,
  } = await brevoRequest<InterfaceBrevoTransactionalEmailList>({
    apiKey,
    pathname: '/smtp/emails',
    searchParams: {
      email: to,
      limit: 50,
      sort: 'desc',
    },
  });

  if (!response.ok) {
    throw new Error(`Brevo /smtp/emails failed with status ${response.status}.`);
  }

  const entries = Array.isArray(data?.transactionalEmails)
    ? data.transactionalEmails
    : [];

  return entries.find((entry) => {
    if (entry.email !== to) {
      return false;
    }

    if (subjectIncludes && !entry.subject?.includes(subjectIncludes)) {
      return false;
    }

    return isFreshEnough(entry.date, sentAfterMs);
  });
};

const extractLinksFromHtml = (html: string): string[] => {
  const links: string[] = [];
  const hrefRegex = /href=(?:"(?<doubleQuoted>[^"]+)"|'(?<singleQuoted>[^']+)')/giu;
  let match = hrefRegex.exec(html);

  while (match) {
    const rawLink = match.groups?.doubleQuoted || match.groups?.singleQuoted || '';
    const normalizedLink = rawLink
      .replaceAll('&amp;', '&')
      .trim();

    if (normalizedLink.startsWith('http://') || normalizedLink.startsWith('https://')) {
      links.push(normalizedLink);
    }

    match = hrefRegex.exec(html);
  }

  return links;
};

export const waitForBrevoConfirmationLink = ({
  apiKey,
  sentAfterMs,
  to,
  subjectIncludes,
  timeoutMs = 120_000,
  pollIntervalMs = 2_500,
}: InterfaceWaitForBrevoConfirmationLinkProps): Promise<string> => {
  const deadlineMs = Date.now() + timeoutMs;
  const attempt = async (): Promise<string> => {
    if (Date.now() > deadlineMs) {
      throw new Error(`Timed out waiting for Brevo confirmation link for ${to}.`);
    }

    const latestEmail = await getLatestTransactionalEmail({
      apiKey,
      sentAfterMs,
      subjectIncludes,
      to,
    });

    if (latestEmail?.uuid) {
      const {
        data,
        response,
      } = await brevoRequest<InterfaceBrevoTransactionalEmailContent>({
        apiKey,
        pathname: `/smtp/emails/${latestEmail.uuid}`,
      });

      if (!response.ok) {
        throw new Error(`Brevo /smtp/emails/{uuid} failed with status ${response.status}.`);
      }

      const body = data?.body || '';
      const links = extractLinksFromHtml(body);
      const [confirmationLink] = links;

      if (confirmationLink) {
        return confirmationLink;
      }
    }

    await sleep(pollIntervalMs);

    return attempt();
  };

  return attempt();
};

export const waitForBrevoContactListMembership = ({
  apiKey,
  email,
  requiredListId,
  forbiddenListId,
  timeoutMs = 120_000,
  pollIntervalMs = 2_500,
}: InterfaceWaitForBrevoContactListMembershipProps): Promise<void> => {
  const deadlineMs = Date.now() + timeoutMs;
  const attempt = async (): Promise<void> => {
    if (Date.now() > deadlineMs) {
      throw new Error(`Timed out waiting for Brevo contact ${email} list membership.`);
    }

    const {
      data,
      response,
    } = await brevoRequest<InterfaceBrevoContact>({
      apiKey,
      pathname: `/contacts/${encodedEmail(email)}`,
    });

    if (response.status === 404) {
      await sleep(pollIntervalMs);

      return attempt();
    }

    if (!response.ok) {
      throw new Error(`Brevo /contacts/{identifier} failed with status ${response.status}.`);
    }

    const listIds = Array.isArray(data?.listIds)
      ? data.listIds.map((listId) => Number(listId))
      : [];

    const hasRequiredList = listIds.includes(Number(requiredListId));
    const hasForbiddenList = typeof forbiddenListId === 'number'
      ? listIds.includes(Number(forbiddenListId))
      : false;

    if (hasRequiredList && !hasForbiddenList) {
      return Promise.resolve();
    }

    await sleep(pollIntervalMs);

    return attempt();
  };

  return attempt();
};
