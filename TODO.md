- containerize local db
  - seed function?
  - reproduction from prod to local dev?
- vrt:
  - when logging meta, then config.rootDir is '/src/src' ???
  - publish docker to use it in github workflow?
- test integration of backup/restore
- order npm scripts
- add sentry
- fix sentry warnings
- -> install sentry integration in vercel
- for backup-buckets: integrate env-variable to prefix test/staging/prod. also adapt config (send mail/slack) for different environments
- vercel: add env-dependant secrets (mongodb etc.)
- WARN: No email adapter provided. Email will be written to console. More info at https://payloadcms.com/docs/email/overview.

- node version!
  - Vercel does not support nvmrc files. You can set node version (major version only) in package.json. building happens on github for staging and production builds. But preview builds still run on vercel. is it an issue?
  - The edge functions, cron jobs etc. run on vercel, there, they seem to use node 22.x
  - most likely, we must regularly check which node version vercel is using and adapt our project node version to that of vercel

- make sure to use nvmrc on all github workflows which build the projects
- force squash commits
- run tests before build


- write all vercel config in vercel.json instead of using vercel ui
- deploy storybook?
- document merging strategy / release workflow
- backup/restore: make it for staging and prod
- backup/restore: add script to list all buckets
- backup/restore: add script to select buckets to delete
- backup/restore: add script to download backups buckets

- use only one compose file

- do not use cross-env anymore!

- scss warnings on github staging build

- repo: add branch restrictions on main

- document env variables and save them to 1password. which are used on vercel/github?

- backup bucket names have wrong time

- rename slack app to backups
- disable posting in backup channel