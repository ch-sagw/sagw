- containerize local db
  - seed function?
  - reproduction from prod to local dev?
- vrt:
  - when logging meta, then config.rootDir is '/src/src' ???
  - publish docker to use it in github workflow?
- test integration of backup/restore
- order npm scripts
- staging and prod environment... release-please?
- add sentry
- fix sentry warnings
- -> install sentry integration in vercel
- for backup-buckets: integrate env-variable to prefix test/staging/prod. also adapt config (send mail/slack) for different environments

- WARN: No email adapter provided. Email will be written to console. More info at https://payloadcms.com/docs/email/overview.

- as i remember, vercel does not support nvmrc files. make strategic decision -> as of now, building happens on github, not vercel. make sure to use nvmrc in github workflow
- force squash commits
- run tests before build


- write all vercel config in vercel.json instead of using vercel ui
- deploy storybook?

- backup/restore: make it for staging and prod
- backup/restore: add script to list all buckets
- backup/restore: add script to select buckets to delete
- backup/restore: add script to download backups buckets

- use only one compose file

- do not use cross-env anymore!

- repo: add branch restrictions on main

- document env variables and save them to 1password. which are used on vercel/github?

- backup bucket names have wrong time

- rename slack app to backups
- disable posting in backup channel