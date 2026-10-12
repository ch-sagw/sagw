import type {
  InterfaceAssetsCleanupReport, InterfaceNotificationResult,
} from '@/jobs/assetsCleanup/types';
import {
  buildSlackFailureText, buildSlackText,
} from '@/jobs/assetsCleanup/report';

// ########################################################################
// Slack notifications via incoming webhook
//
// - sendSlackNotification: one message per completed run. If the run had
//   problems (scan errors, failed deletions, ...) the message is clearly
//   marked and lists them.
// - sendSlackFailure: the run crashed before a report could be built.
//   Contains reason and stack details. This replaces error reporting to
//   sentry for this job on purpose.
// ########################################################################

const slackTarget = 'assets-deletion channel';

const postToSlack = async (webhookUrl: string, text: string): Promise<InterfaceNotificationResult> => {
  try {
    const response = await fetch(webhookUrl, {
      body: JSON.stringify({
        text,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      const body = await response.text();

      throw new Error(`Slack responded with ${response.status}: ${body}`);
    }

    return {
      channel: 'slack',
      message: 'Slack notification sent.',
      ok: true,
      target: slackTarget,
    };
  } catch (error) {
    return {
      channel: 'slack',
      message: `Slack notification failed: ${error instanceof Error
        ? error.message
        : String(error)}`,
      ok: false,
      target: slackTarget,
    };
  }
};

export const sendSlackNotification = ({
  jobUrl,
  report,
  webhookUrl,
}: {
  jobUrl?: string;
  report: InterfaceAssetsCleanupReport;
  webhookUrl: string;
}): Promise<InterfaceNotificationResult> => postToSlack(webhookUrl, buildSlackText(report, jobUrl));

export const sendSlackFailure = ({
  env,
  error,
  jobUrl,
  webhookUrl,
}: {
  env: InterfaceAssetsCleanupReport['env'];
  error: unknown;
  jobUrl?: string;
  webhookUrl: string;
}): Promise<InterfaceNotificationResult> => postToSlack(webhookUrl, buildSlackFailureText({
  env,
  error,
  jobUrl,
}));
