- containerize local db
  - seed function?
  - reproduction from prod to local dev?
- vrt: when logging meta, then config.rootDir is '/src/src' ???
- test integration of backup/restore
- order npm scripts
- fix sentry warnings
- -> install sentry integration in vercel
- for backup-buckets: integrate env-variable to prefix test/staging/prod. also adapt config (send mail/slack) for different environments
- vercel: add env-dependant secrets (mongodb etc.)
- WARN: No email adapter provided. Email will be written to console. More info at https://payloadcms.com/docs/email/overview.

- node version!
  - Vercel does not support nvmrc files. You can set node version (major version only) in package.json. building happens on github for staging and production builds. But preview builds still run on vercel. is it an issue?
  - The edge functions, cron jobs etc. run on vercel, there, they seem to use node 22.x
  - most likely, we must regularly check which node version vercel is using and adapt our project node version to that of vercel

- force squash commits
- write all vercel config in vercel.json instead of using vercel ui
- deploy storybook?
- document merging strategy / release workflow
- backup/restore: make it for staging and prod
- backup/restore: add script to list all buckets
- backup/restore: add script to select buckets to delete
- backup/restore: add script to download backups buckets
- tests run on 5 workers on github instead of 2
- do not use cross-env anymore!
- repo -> security -> setup code-scanning etc.
- scss warnings on github staging build
- repo: add branch restrictions on main
- tests failing arbitary: it seems to be always 1 pixel diff in the width of the image
- document env variables and save them to 1password. which are used on vercel/github?

- backup bucket names have wrong time

- disable posting in backup channel
- document docker setup (with playwright image) -> which node versions are used? how to keep them in sync? (with project node version, vercel node version)