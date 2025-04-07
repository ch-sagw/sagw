# backup-restore

Helpers for various tasks concerning backup and restore of Vercel blob data and MongoDB to S3.

## Jobs

- blob-backup, db-backup und backups-cleanup are run as cron jobs on a regular basis.
- blob-restore and db-restore are meant to be executed on demand and triggered locally.

## Config

In `config.ts` can define to send mails on success and/or error for the cron jobs. For this, `RESEND_KEY` and `MAIL_TO` environment variables need to be defined.

With `keepAmountOfBackups` you can define how many backups the cleanup cron job should keep. e.g. if you set it to 4, then the job will keep 4 db-backups and 4 blob-backups.

With `blobBackupBucketPrefix` and `blobBackupBucketPrefix` you define the prefix for the name of the blob-backup/db-backup on S3.

## Cron Jobs

Execution of the cron jobs is defined in `/vercel.json`.

### Cron job 1: blob backup

`/src/app/(payload)/api/cron-blob-backup`

Get all blob data (vercel) and save to s3 (ovh).


### Cron job 2: db backup

`/src/app/(payload)/api/cron-db-backup`

Make db-dump (ovh) and save to s3 (ovh).

### Cron job 3: backups cleanup

`/src/app/(payload)/api/cron-cleanup-backups`

Delete old blob-backups and db-backups.

## On-demand Jobs

### disaster recovery script 1: blob restore

`npm run restore:blob`

Get blob data backup from s3 (ovh) and save to blob data (vercel).

### disaster recovery script 2: db restore

`npm run restore:db`

Get db-backup from s3 (ovh) and save to mongoDb (ovh).
