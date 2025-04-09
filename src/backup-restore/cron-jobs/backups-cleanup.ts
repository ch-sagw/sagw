/**
 * Requires the follwoing env-variables:
 * - OVH_OS_ACCESS_PUBLIC_KEY
 * - OVH_OS_ACCESS_PRIVATE_KEY
 * - OVH_OS_IMAGES_BACKUP_CONTAINER_ENDPOINT
 * - RESEND_KEY
 * - MAIL_TO
 */

import { S3Helper } from '../helpers/s3';
import config from '../config';
import mail from '../helpers/mail';
import { getErrorMessage } from '../helpers/try-catch-error';
import type { Bucket } from '@aws-sdk/client-s3';
import sendSlackMessage from '../helpers/slack';

const cleanUpBucketsWithPrefix = async (prefix: string, allBuckets: [(Bucket | undefined)?], s3Helper: S3Helper): Promise<[string?]> => {

  const bucketsSorted = s3Helper.getBucketsWithPrefixSorted(prefix, allBuckets);
  const bucketsToDelete = JSON.parse(JSON.stringify(bucketsSorted))
    .splice(config.keepAmountOfBackups, bucketsSorted.length - config.keepAmountOfBackups);

  const promises = [];

  for (const bucketToDelete of bucketsToDelete) {
    promises.push(s3Helper.deleteBucket(bucketToDelete));
  }

  await Promise.all(promises);

  if (bucketsToDelete.length === 0) {
    return [];
  }

  return bucketsToDelete.map((bucket: Bucket) => bucket);
};

const main = async (): Promise<void> => {
  try {
    const s3Helper = new S3Helper();
    const buckets = await s3Helper.getAllBuckets();

    const deletedBlobBuckets = await cleanUpBucketsWithPrefix(config.blobBackupBucketPrefix, buckets, s3Helper);
    const deletedDbBuckets = await cleanUpBucketsWithPrefix(config.dbBackupBucketPrefix, buckets, s3Helper);

    const mailMessage = `Deleted ${deletedBlobBuckets.length} blob buckets and ${deletedDbBuckets.length} db buckets.\n\nDeleted blob buckets: \n- ${deletedBlobBuckets.join('\n- ')}\n\nDeleted db buckets: \n- ${deletedDbBuckets.join('\n- ')}`;

    await mail(
      '--> Backups cleanup success',
      mailMessage,
      false,
    );

    await sendSlackMessage([
      ':large_green_circle: *Backups cleanup done*',
      'Successfully cleaned up DB & Blob Backups.',
      mailMessage,
    ], false);

    console.log('--> Backups cleanup done');

  } catch (error) {
    await mail(
      '--> Backups cleanup failure',
      getErrorMessage(error),
      true,
    );

    await sendSlackMessage([':warning: *Backups cleanup failure!*'], true);

    throw new Error(getErrorMessage(error));
  }
};

export default main;
