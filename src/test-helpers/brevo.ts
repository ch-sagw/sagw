const brevoApiUrl = 'https://api.brevo.com/v3';

// TODO: remove
const isBrevoDebugEnabled = process.env.DEBUG_BREVO_TESTS === 'true';

const brevoDebug = (message: string, payload?: Record<string, unknown>): void => {
  if (!isBrevoDebugEnabled) {
    return;
  }

  const timestamp = new Date()
    .toISOString();
  const serializedPayload = payload
    ? ` ${JSON.stringify(payload)}`
    : '';

  process.stdout.write(`[brevo-debug ${timestamp}] ${message}${serializedPayload}\n`);
};
// END

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

  // TODO: remove
  brevoDebug('request:start', {
    pathname,
    searchParams,
    url: url.toString(),
  });
  // END

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

  // TODO: remove
  brevoDebug('request:end', {
    hasData: typeof responseData !== 'undefined',
    ok: response.ok,
    pathname,
    status: response.status,
    url: url.toString(),
  });
  // END

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

  // TODO: remove
  brevoDebug('emails:list', {
    count: entries.length,
    sample: entries
      .slice(0, 5)
      .map((entry) => ({
        date: entry.date,
        email: entry.email,
        freshEnough: isFreshEnough(entry.date, sentAfterMs),
        subject: entry.subject,
        uuid: entry.uuid,
      })),
    sentAfterMs,
    subjectIncludes,
    to,
  });
  // END

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

  // TODO: remove
  let attempts = 0;
  // END

  const attempt = async (): Promise<string> => {

    // TODO: remove
    attempts += 1;

    brevoDebug('confirmation:attempt', {
      attempt: attempts,
      deadlineMs,
      nowMs: Date.now(),
      sentAfterMs,
      subjectIncludes,
      to,
    });
    // END

    if (Date.now() > deadlineMs) {

      // TODO: remove
      brevoDebug('confirmation:timeout', {
        attempt: attempts,
        deadlineMs,
        nowMs: Date.now(),
        sentAfterMs,
        to,
      });
      // END

      throw new Error(`Timed out waiting for Brevo confirmation link for ${to}.`);
    }

    const latestEmail = await getLatestTransactionalEmail({
      apiKey,
      sentAfterMs,
      subjectIncludes,
      to,
    });

    if (latestEmail?.uuid) {

      // TODO: remove
      brevoDebug('confirmation:email-found', {
        date: latestEmail.date,
        subject: latestEmail.subject,
        uuid: latestEmail.uuid,
      });
      // END

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

      // TODO: remove
      brevoDebug('confirmation:links', {
        links,
        linksCount: links.length,
        selected: confirmationLink,
        uuid: latestEmail.uuid,
      });
      // END

      if (confirmationLink) {
        return confirmationLink;
      }
      // TODO: remove
    } else {
      brevoDebug('confirmation:no-email-yet', {
        sentAfterMs,
        to,
      });
      // END
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
  const encodedEmail = encodeURIComponent(email);

  // TODO: remove
  let attempts = 0;
  // END

  const attempt = async (): Promise<void> => {

    // TODO: remove
    attempts += 1;

    brevoDebug('membership:attempt', {
      attempt: attempts,
      deadlineMs,
      email,
      forbiddenListId,
      nowMs: Date.now(),
      requiredListId,
    });
    // END

    if (Date.now() > deadlineMs) {

      // TODO: remove
      brevoDebug('membership:timeout', {
        attempt: attempts,
        deadlineMs,
        email,
        forbiddenListId,
        nowMs: Date.now(),
        requiredListId,
      });
      // END

      throw new Error(`Timed out waiting for Brevo contact ${email} list membership.`);
    }

    const {
      data,
      response,
    } = await brevoRequest<InterfaceBrevoContact>({
      apiKey,
      pathname: `/contacts/${encodedEmail}`,
    });

    // TODO: remove
    brevoDebug('membership:response', {
      email,
      ok: response.ok,
      status: response.status,
    });
    // END

    if (response.status === 404) {

      // TODO: remove
      brevoDebug('membership:not-found-yet', {
        email,
      });
      // END

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

    // TODO: remove
    brevoDebug('membership:list-state', {
      email,
      hasForbiddenList,
      hasRequiredList,
      listIds,
      requiredListId,
    });
    // END

    if (hasRequiredList && !hasForbiddenList) {
      return Promise.resolve();
    }

    await sleep(pollIntervalMs);

    return attempt();
  };

  return attempt();
};
