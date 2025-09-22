/**
 * Requires the following env-variables:
 * - OVH_OS_ACCESS_PUBLIC_KEY
 * - OVH_OS_ACCESS_PRIVATE_KEY
 * - OVH_OS_IMAGES_BACKUP_CONTAINER_ENDPOINT
 * - BLOB_READ_WRITE_TOKEN
 * - RESEND_KEY
 * - MAIL_RECIPIENT_BACKUP_RESTORE
 */

import { Readable } from 'node:stream';
import { ReadableStream } from 'node:stream/web';
import * as blobHelpers from '@/backup-restore/helpers/blob';
import { S3Helper } from '@/backup-restore/helpers/s3';
import { dateString } from '@/backup-restore/helpers/date';
import config from '@/backup-restore/config';
import mail from '@/backup-restore/helpers/mail';
import { getErrorMessage } from '@/backup-restore/helpers/try-catch-error';
import sendSlackMessage from '@/backup-restore/helpers/slack';

const main = async (): Promise<void> => {

  try {
    const s3Helper = new S3Helper();
    const bucketName = `${dateString()}-${config.blobBackupBucketPrefix}`;

    const blobs = await blobHelpers.getAllBlobs();

    await s3Helper.createBucket(bucketName);

    await Promise.all(blobs.map(async (blob) => {
      if (blob) {
        const res = await fetch(blob.url);
        const params = {
          Body: Readable.fromWeb(res.body as ReadableStream),
          Bucket: bucketName,
          Key: blob.pathname,
        };

        if (res.body) {
          await s3Helper.addObject(params);
        }
      }
    }));

    // integrity check
    const bucketItemsCount = await s3Helper.listObjectsOfBucket(bucketName);

    if (bucketItemsCount.length !== blobs.length) {
      throw new Error(`Blob Backup failure during integrity check. Vercel blob has ${blobs.length} objects, but the backup contains ${bucketItemsCount.length}`);
    }

    const mailMessage = `Successfully backed up ${blobs.length} items from Vercel Blob to OVH S3`;

    await mail(
      '--> Backup done: Vercel Blob data to OVH S3',
      mailMessage,
      false,
    );

    await sendSlackMessage([
      ':large_green_circle: *Blob Backup done*',
      `Successfully backed up ${blobs.length} items from Vercel Blob to OVH S3`,
      `Backup name: ${bucketName}`,
    ], false);

    console.log(`blob-backup: ${mailMessage}`);

  } catch (error) {
    await mail(
      '--> Backup failure: Vercel Blob data to OVH S3',
      getErrorMessage(error),
      true,
    );

    await sendSlackMessage([':warning: *Backup failure!* Vercel Blob data to OVH S3'], true);

    throw new Error(getErrorMessage(error));
  }
};

export default main;
