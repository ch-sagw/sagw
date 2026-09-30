import { getPayloadCached } from '@/utilities/getPayloadCached';
import { isCronRequestAuthorized } from '@/jobs/assetsCleanup/cronAuth';
import { queueAndRunAssetsCleanup } from '@/jobs/assetsCleanup/runJob';
import { resolveAssetsCleanupConfig } from '@/jobs/assetsCleanup/config';
import { sendSlackFailure } from '@/jobs/assetsCleanup/notify/slack';

// ########################################################################
// Cron endpoint for the assets cleanup job
//
// - prod: triggered by Vercel Cron (see vercel.json), monthly
// - test: triggered by a scheduled GitHub Action
//
// The request must carry `Authorization: Bearer <CRON_SECRET>`.
// The job itself decides (based on ENV and ASSETS_CLEANUP_MODE) whether
// it only reports or actually deletes.
// ########################################################################

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export const GET = async (request: Request): Promise<Response> => {
  if (!isCronRequestAuthorized(request.headers)) {
    return Response.json({
      message: 'Unauthorized',
    }, {
      status: 401,
    });
  }

  try {
    const payload = await getPayloadCached();

    // `?notify=false` allows to run the job without sending mail / slack
    // (used by the automated tests). everything else is decided by the job.
    const notify = (new URL(request.url)).searchParams.get('notify') === 'false'
      ? false
      : undefined;

    const result = await queueAndRunAssetsCleanup({
      input: {
        notify,
      },
      payload,
    });

    if (result.status === 'error') {
      return Response.json({
        error: result.error,
        jobId: result.jobId,
        status: result.status,
      }, {
        status: 500,
      });
    }

    return Response.json({
      jobId: result.jobId,
      status: result.status,
      summary: result.summary,
      totals: result.report?.totals,
    });
  } catch (error) {
    // errors inside the run are already posted to slack by the job itself.
    // this catches everything around it (payload init, queueing, ...).
    const config = resolveAssetsCleanupConfig(null);

    if (config.notifySlack && config.slackWebhookUrl) {
      await sendSlackFailure({
        env: config.env,
        error,
        webhookUrl: config.slackWebhookUrl,
      });
    }

    return Response.json({
      error: error instanceof Error
        ? error.message
        : String(error),
      status: 'error',
    }, {
      status: 500,
    });
  }
};
