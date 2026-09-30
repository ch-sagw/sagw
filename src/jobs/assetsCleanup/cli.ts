import '../../../.env/index.js';

import { getPayloadCached } from '@/utilities/getPayloadCached';
import { queueAndRunAssetsCleanup } from '@/jobs/assetsCleanup/runJob';

// ########################################################################
// CLI entry point for manual runs (local development)
//
// npm run assets:cleanup                report only (default)
// npm run assets:cleanup -- --delete    delete unused assets
// npm run assets:cleanup -- --no-notify skip mail and slack
// npm run assets:cleanup -- --json      print the full report as json
// ########################################################################

const main = async (): Promise<void> => {
  const args = process.argv.slice(2);
  const payload = await getPayloadCached();

  const result = await queueAndRunAssetsCleanup({
    input: {
      mode: args.includes('--delete')
        ? 'delete'
        : 'report',
      notify: !args.includes('--no-notify'),
    },
    payload,
  });

  if (result.status === 'error') {
    console.error(`Assets cleanup failed (job ${result.jobId}): ${result.error}`);

    /* eslint-disable no-process-exit */
    process.exit(1);
  }

  if (args.includes('--json')) {
    console.log(JSON.stringify(result.report, null, 2));
  } else {
    console.log(result.summary);
  }

  process.exit(0);
  /* eslint-enable no-process-exit */
};

await main();
