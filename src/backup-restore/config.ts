import '../../.env';

export default {
  blobBackupBucketPrefix: `${process.env.BACKUP_RESTORE_PREFIX}-blob-backup`,
  dbBackupBucketPrefix: `${process.env.BACKUP_RESTORE_PREFIX}-db-backup`,
  keepAmountOfBackups: 21,
  maintenanceDownloadFolder: `${process.env.BACKUP_RESTORE_PREFIX}-download`,
  sendMailOnFailure: false,
  sendMailOnSuccess: false,
  sendSlackOnFailure: true,
  sendSlackOnSuccess: true,
};
