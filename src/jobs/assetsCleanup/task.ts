import type { TaskConfig } from 'payload';
import type { InterfaceAssetsCleanupOptions } from '@/jobs/assetsCleanup/config';
import type { InterfaceAssetsCleanupReport } from '@/jobs/assetsCleanup/types';
import { runAssetsCleanup } from '@/jobs/assetsCleanup/runAssetsCleanup';
import { buildSummaryText } from '@/jobs/assetsCleanup/report';

// ########################################################################
// Payload task definition
//
// Every run is persisted as a job in the `payload-jobs` collection. The
// full report is stored in the task output, so it can be inspected in the
// admin panel later on.
// ########################################################################

export const assetsCleanupTaskSlug = 'assetsCleanup';
export const assetsCleanupQueue = 'assets-cleanup';

export type InterfaceAssetsCleanupTaskInput = InterfaceAssetsCleanupOptions;

interface InterfaceAssetsCleanupTaskOutput {
  report: InterfaceAssetsCleanupReport;
  summary: string;
}

const buildJobAdminUrl = (jobId: number | string): string | undefined => {
  const serverUrl = (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/$/u, '');

  if (!serverUrl) {
    return undefined;
  }

  return `${serverUrl}/admin/collections/payload-jobs/${jobId}`;
};

export const assetsCleanupTask: TaskConfig<{
  input: InterfaceAssetsCleanupTaskInput;
  output: InterfaceAssetsCleanupTaskOutput;
}> = {
  handler: async ({
    input,
    job,
    req,
  }) => {
    const report = await runAssetsCleanup({
      jobUrl: buildJobAdminUrl(job.id),
      options: input,
      payload: req.payload,
    });

    return {
      output: {
        report,
        summary: buildSummaryText(report),
      },
    };
  },
  inputSchema: [
    {
      admin: {
        description: 'On prod and test, "delete" is only effective when ASSETS_CLEANUP_MODE=delete is set.',
      },
      name: 'mode',
      options: [
        'report',
        'delete',
      ],
      type: 'select',
    },
    {
      admin: {
        description: 'Safety window in days. On prod, the window can only be extended.',
      },
      name: 'minAgeDays',
      type: 'number',
    },
    {
      admin: {
        description: 'Restrict the run to these tenant ids.',
      },
      hasMany: true,
      name: 'tenantIds',
      type: 'text',
    },
    {
      admin: {
        description: 'Send mail and slack notifications.',
      },
      name: 'notify',
      type: 'checkbox',
    },
    {
      name: 'maxDeletePercent',
      type: 'number',
    },
    {
      name: 'maxDeleteAbsolute',
      type: 'number',
    },
  ],
  label: 'Assets cleanup: delete unused images, videos and documents',
  outputSchema: [
    {
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'report',
      type: 'json',
    },
  ],

  // never retry automatically: a retry could delete assets which were
  // evaluated against a stale scan
  retries: 0,
  slug: assetsCleanupTaskSlug,
};
