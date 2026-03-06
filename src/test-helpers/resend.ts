import { Resend } from 'resend';

interface InterfaceWaitForResendMailArgs {
  apiKey: string;
  sentAfterMs: number;
  subjectIncludes: string;
  to: string;
  timeoutMs?: number;
  pollIntervalMs?: number;
}

interface InterfaceResendMailItem {
  /* eslint-disable @typescript-eslint/naming-convention */
  created_at?: string;
  id?: string;
  last_event?: string;
  subject?: string;
  to?: string[] | string;
  /* eslint-enable @typescript-eslint/naming-convention */
}

const acceptedEvents = new Set([
  'sent',
  'delivered',
]);

const sleep = async (ms: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const hasRecipient = (to: InterfaceResendMailItem['to'], recipient: string): boolean => {
  if (Array.isArray(to)) {
    return to.includes(recipient);
  }

  return to === recipient;
};

const isFreshEnough = (createdAt: string | undefined, sentAfterMs: number): boolean => {
  if (!createdAt) {
    return false;
  }

  const createdAtMs = Date.parse(createdAt);

  if (Number.isNaN(createdAtMs)) {
    return false;
  }

  return createdAtMs >= sentAfterMs;
};

export const waitForResendMail = ({
  apiKey,
  pollIntervalMs = 2500,
  sentAfterMs,
  subjectIncludes,
  timeoutMs = 90_000,
  to,
}: InterfaceWaitForResendMailArgs): Promise<InterfaceResendMailItem> => {
  const resend = new Resend(apiKey);
  const deadlineMs = Date.now() + timeoutMs;

  const attempt = async (): Promise<InterfaceResendMailItem> => {
    if (Date.now() > deadlineMs) {
      throw new Error(`Timed out waiting for Resend email to ${to} with subject containing "${subjectIncludes}".`);
    }

    const listResponse = await resend.emails.list({
      limit: 100,
    });

    if (listResponse.error) {
      throw new Error(`Resend list failed: ${listResponse.error.message}`);
    }

    const entries = (Array.isArray(listResponse.data)
      ? listResponse.data
      : listResponse.data?.data) as InterfaceResendMailItem[] | undefined;

    const match = entries?.find((entry) => {
      if (!hasRecipient(entry.to, to)) {
        return false;
      }

      if (!entry.subject?.includes(subjectIncludes)) {
        return false;
      }

      if (!isFreshEnough(entry.created_at, sentAfterMs)) {
        return false;
      }

      return acceptedEvents.has(entry.last_event || '');
    });

    if (match) {
      return match;
    }

    await sleep(pollIntervalMs);

    return attempt();
  };

  return attempt();
};
