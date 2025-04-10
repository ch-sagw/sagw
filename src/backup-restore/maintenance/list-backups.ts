import config from '../config';
import { inquirerAskForOption } from '../helpers/inquirer';
import { S3Helper } from '../helpers/s3';

export const listAllBackups = async (): Promise<void> => {
  const options: Record<string, string> = {
    blob: 'Blob Backups',
    db: 'DB Backups',
  };

  const question = 'Would you like to list DB or Blob backups?';

  const selection = await inquirerAskForOption(question, options);

  let prefix;

  if (selection === 'db') {
    prefix = config.dbBackupBucketPrefix;
  } else if (selection === 'blob') {
    prefix = config.blobBackupBucketPrefix;
  }

  if (!prefix) {
    return;
  }

  const s3Helper = new S3Helper();

  const bucketsSorted = await s3Helper.getBucketsWithPrefixSorted(prefix);
  const bucketList = bucketsSorted
    .join('\n');

  console.log(bucketList);
};
