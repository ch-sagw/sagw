import config from '../config';
import {
  inquirerAskForOption,
  inquirerAskForProceed,
  inquirerAskMultipleChoice,
} from '../helpers/inquirer';
import { S3Helper } from '../helpers/s3';
import chalk from 'chalk';

export const selectBackupsToDelete = async (): Promise<void> => {
  const options: Record<string, string> = {
    blob: 'Blob Backups',
    db: 'DB Backups',
  };

  const question = 'Would you like to delete a selection of DB or Blob backups?';

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

  const multipleChoiceQuestion = 'Which backups do you want to delete?';

  const bucketsToDelete = await inquirerAskMultipleChoice(multipleChoiceQuestion, bucketsSorted);

  const finalConfirmationMessage = `I am about to delete ${chalk.red(bucketsToDelete.length)} ${selection} buckets on S3. Are you sure you want to continue?`;
  const finalConfirmation = await inquirerAskForProceed(finalConfirmationMessage);

  if (!finalConfirmation) {
    console.log('aborting');

    return;
  }

  const promises = [];

  for (const bucketToDelete of bucketsToDelete) {
    if (bucketToDelete) {
      promises.push(s3Helper.deleteBucket(bucketToDelete));
    }
  }

  await Promise.all(promises);

};
