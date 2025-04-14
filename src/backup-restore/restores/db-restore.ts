/**
 * Requires the following env-variables:
 * - DATABASE_NAME
 * - DATABASE_URI
 * - OVH_OS_ACCESS_PUBLIC_KEY
 * - OVH_OS_ACCESS_PRIVATE_KEY
 * - OVH_OS_IMAGES_BACKUP_CONTAINER_ENDPOINT
 */

import chalk from 'chalk';
import dotenv from 'dotenv';
import { EJSON } from 'bson';
import { S3Helper } from '../helpers/s3';
import { DbHelper } from '../helpers/db';
import config from '../config';
import {
  inquirerAskBucketToRestore,
  inquirerAskForProceed,
} from '../helpers/inquirer';

dotenv.config();

const main = async (): Promise<void> => {
  const dbHelper = new DbHelper();

  try {
    const proceedMessage = `Restore DB from S3 to OVH. ${chalk.red('This is a destructive process. Collections from the backup will overwrite the existing collections in MongoDB.')}`;
    const proceed = await inquirerAskForProceed(proceedMessage);

    if (!proceed) {
      throw new Error('User aborted.');
    }

    const s3Helper = new S3Helper();
    const sortedBuckets = await s3Helper.getBucketsWithPrefixSorted(config.dbBackupBucketPrefix);

    if (!sortedBuckets || sortedBuckets.length < 1) {
      throw new Error('no backups found to restore');
    }

    const selectedBucket = await inquirerAskBucketToRestore(sortedBuckets);
    const allObjectsInBucket = await s3Helper.listObjectsOfBucket(selectedBucket);

    const finalConfirmationMessage = `I am about to restore ${chalk.green(allObjectsInBucket.length)} collections from S3 Bucket named ${chalk.green(selectedBucket)} to MongoDB. Are you sure you want to continue?`;
    const finalConfirmation = await inquirerAskForProceed(finalConfirmationMessage);

    if (!finalConfirmation) {
      console.log('aborting');

      return;
    }

    if (!process.env.DATABASE_NAME) {
      console.log('Aborting. DATABASE_NAME is not defined in env.');

      return;
    }

    await Promise.all(allObjectsInBucket.map(async (object) => {
      if (object) {

        const collectionNameSplit = object.split('.json');

        if (!process.env.DATABASE_NAME) {
          throw new Error('Fatal: process.env.DATABASE_NAME is not defined');
        }

        if (collectionNameSplit.length === 2) {
          const [collectionName] = collectionNameSplit;
          const objectData = await s3Helper.getObject(selectedBucket, object, false);

          if (!objectData) {
            throw new Error(`Fatal: was not able to get object with the specified name: ${selectedBucket}`);
          }

          await dbHelper.deleteCollection(process.env.DATABASE_NAME, collectionName);

          const parsed = EJSON.parse(objectData);

          if (parsed.length > 0) {
            await dbHelper.addDocumentsToCollection(process.env.DATABASE_NAME, collectionName, parsed);
          }

        }
      }
    }));

    console.log(chalk.bgGreen('-->> Restore done: OVH S3 to MongoDB'));

  } catch (error) {
    console.log(chalk.bgRed(error));
  } finally {
    dbHelper?.getClient()
      ?.close();
  }
};

main();
