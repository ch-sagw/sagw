import '../../.env/index.js';

import { seedTestData } from '@/seed/test-data';
import { getPayloadCached } from '@/utilities/getPayloadCached.js';

const main = async (): Promise<void> => {
  const payload = await getPayloadCached();

  await seedTestData(payload);

  /* eslint-disable no-process-exit */
  process.exit(0);

};

await main();
