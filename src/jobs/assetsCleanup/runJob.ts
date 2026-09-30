import type { Payload } from 'payload';
import type { InterfaceAssetsCleanupReport } from '@/jobs/assetsCleanup/types';
import {
  assetsCleanupQueue, assetsCleanupTaskSlug, type InterfaceAssetsCleanupTaskInput,
} from '@/jobs/assetsCleanup/task';
import { isRecord } from '@/jobs/assetsCleanup/collectGeneric';

// ########################################################################
// Queues the assets cleanup job, runs it immediately and returns the
// result. Used by the cron endpoint, the cli and the tests.
// ########################################################################

interface InterfaceAssetsCleanupJobResult {
  error?: string;
  jobId: number | string;
  report?: InterfaceAssetsCleanupReport;
  status: 'error' | 'success';
  summary?: string;
}

const readTaskOutput = async (payload: Payload, jobId: number | string): Promise<{
  error?: string;
  report?: InterfaceAssetsCleanupReport;
  summary?: string;
}> => {
  const job = await payload.findByID({
    collection: 'payload-jobs',
    depth: 0,
    id: jobId,
  });

  const log = Array.isArray(job.log)
    ? job.log
    : [];
  const entry = [...log]
    .reverse()
    .find((item) => item.taskSlug === assetsCleanupTaskSlug);

  if (!entry) {
    return {
      error: typeof job.error === 'string'
        ? job.error
        : 'Job produced no log entry.',
    };
  }

  if (entry.state !== 'succeeded') {
    const errorValue: unknown = entry.error;
    const message = isRecord(errorValue) && typeof errorValue.message === 'string'
      ? errorValue.message
      : JSON.stringify(errorValue);

    return {
      error: message,
    };
  }

  const {
    output,
  } = entry;

  if (!isRecord(output)) {
    return {
      error: 'Job produced no output.',
    };
  }

  return {
    report: output.report as InterfaceAssetsCleanupReport,
    summary: typeof output.summary === 'string'
      ? output.summary
      : undefined,
  };
};

export const queueAndRunAssetsCleanup = async ({
  input,
  payload,
}: {
  input?: InterfaceAssetsCleanupTaskInput;
  payload: Payload;
}): Promise<InterfaceAssetsCleanupJobResult> => {
  const job = await payload.jobs.queue({
    input: input || {},
    queue: assetsCleanupQueue,
    task: assetsCleanupTaskSlug,
  });

  await payload.jobs.runByID({
    id: job.id,
  });

  const result = await readTaskOutput(payload, job.id);

  if (result.error || !result.report) {
    return {
      error: result.error || 'Unknown error.',
      jobId: job.id,
      status: 'error',
    };
  }

  return {
    jobId: job.id,
    report: result.report,
    status: 'success',
    summary: result.summary,
  };
};
