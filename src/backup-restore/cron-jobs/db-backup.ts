/**
 * Requires the follwoing env-variables:
 * - DATABASE_NAME
 * - DATABASE_URI
 * - OVH_OS_ACCESS_PUBLIC_KEY
 * - OVH_OS_ACCESS_PRIVATE_KEY
 * - OVH_OS_IMAGES_BACKUP_CONTAINER_ENDPOINT
 * - RESEND_KEY
 * - MAIL_TO
 */

import dotenv from 'dotenv';
import { EJSON } from 'bson';
import { S3Helper } from '../helpers/s3';
import { DbHelper } from '../helpers/db';
import { dateString } from '../helpers/date';
import config from '../config';
import mail from '../helpers/mail';
import { getErrorMessage } from '../helpers/try-catch-error';
import sendSlackMessage from '../helpers/slack';

dotenv.config();

const main = async (): Promise<void> => {
  const dbHelper = new DbHelper();

  try {
    const s3Helper = new S3Helper();

    const bucketName = `${dateString()}-${config.dbBackupBucketPrefix}`;

    await s3Helper.createBucket(bucketName);

    if (!process.env.DATABASE_NAME) {
      throw new Error('Aborting. DATABASE_NAME is not defined in env.');
    }

    const collections = await dbHelper.getCollections(process.env.DATABASE_NAME);
    let collectionBackupCount = 0;

    if (!collections) {
      throw new Error('Aborting. No collections found in db.');
    }

    for (const collection of collections) {
      const {
        collectionName,
      } = collection;

      if (!collectionName.startsWith('system.')) {
        collectionBackupCount++;
        /* eslint-disable no-await-in-loop */
        const results = await dbHelper.getContentOfCollection(collection);

        const params = {
          Body: EJSON.stringify(results),
          Bucket: bucketName,
          Key: `${collectionName}.json`,
        };

        await s3Helper.addObject(params);
        /* eslint-enable no-await-in-loop */
      }
    }

    const mailMessage = `Successfully backed up ${collectionBackupCount} colletions from MongoDb to OVH S3`;

    await mail(
      '-->> Backup done: DB on OVH to OVH S3',
      mailMessage,
      false,
    );

    await sendSlackMessage([
      ':large_green_circle: *DB Backup done*',
      mailMessage,
      `Backup name: ${bucketName}`,
    ], false);

  } catch (error) {
    await mail(
      '--> Backup failure: MongoDB to OVH S3',
      getErrorMessage(error),
      true,
    );

    await sendSlackMessage([':warning: *Backup failure!* MongoDB to OVH S3'], true);

    throw new Error(getErrorMessage(error));
  } finally {
    dbHelper.getClient()
      ?.close();
  }
};

export default main;
