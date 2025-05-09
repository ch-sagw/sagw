import chalk from 'chalk';
import fs from 'node:fs';
import config from '@/backup-restore/config';
import {
  inquirerAskForOption,
  inquirerAskMultipleChoice,
} from '@/backup-restore/helpers/inquirer';
import { S3Helper } from '@/backup-restore/helpers/s3';

export const downloadBackups = async (): Promise<void> => {
  try {
    const options: Record<string, string> = {
      blob: 'Blob Backups',
      db: 'DB Backups',
    };

    const question = 'What type of backups would you like to download?';

    const selection = await inquirerAskForOption(question, options);

    let prefix;

    if (selection === 'db') {
      prefix = config.dbBackupBucketPrefix;
    } else if (selection === 'blob') {
      prefix = config.blobBackupBucketPrefix;
    }

    if (!prefix) {
      throw new Error('Missing Backup Bucket Prefix in config. Aborting.');
    }

    const s3Helper = new S3Helper();

    const bucketsSorted = await s3Helper.getBucketsWithPrefixSorted(prefix);

    const multipleChoiceQuestion = 'Which backups do you want to download?';

    const bucketsToDownload = await inquirerAskMultipleChoice(multipleChoiceQuestion, bucketsSorted);

    if (!fs.existsSync(config.maintenanceDownloadFolder)) {
      fs.mkdirSync(config.maintenanceDownloadFolder);
    }

    if (!fs.existsSync(`${config.maintenanceDownloadFolder}/${selection}`)) {
      fs.mkdirSync(`${config.maintenanceDownloadFolder}/${selection}`);
    }

    for await (const bucket of bucketsToDownload) {
      if (bucket) {
        if (!fs.existsSync(`${config.maintenanceDownloadFolder}/${selection}/${bucket}`)) {
          fs.mkdirSync(`${config.maintenanceDownloadFolder}/${selection}/${bucket}`);
        }

        const allObjectsInBucket = await s3Helper.listObjectsOfBucket(bucket);

        await Promise.all(allObjectsInBucket.map(async (object) => {
          if (object) {
            const objectData = await s3Helper.getObject(bucket, object, true);

            if (!objectData) {
              throw new Error(`Fatal: was not able to get object with the specified name: ${object}`);
            }

            const buf = Buffer.from(objectData, 'base64');

            fs.writeFileSync(`${config.maintenanceDownloadFolder}/${selection}/${bucket}/${object}`, buf);

          }
        }));
      }
    }

    console.log(chalk.bgGreen(`Successfully downloaded Backups to ${config.maintenanceDownloadFolder}/${selection}`));

  } catch (err) {
    console.log(chalk.bgRed(err));
  }

};
