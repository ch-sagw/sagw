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
- cron jobs: slack message instead of mail?
  -> https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks
- fix sentry warnings
- for backup-buckets: integrate env-variable to prefix test/staging/prod

- WARN: No email adapter provided. Email will be written to console. More info at https://payloadcms.com/docs/email/overview.

- as i remember, vercel does not support nvmrc files. make strategic decision -> as of now, building happens on github, not vercel. make sure to use nvmrc in github workflow
- squash commits
- run tests before build

- release-please:
  - https://github.com/googleapis/release-please
  - then, make prod vercel build on tag creation: https://vercel.com/guides/can-you-deploy-based-on-tags-releases-on-vercel

- properly time cron jobs

- write all vercel config in vercel.json instead of using vercel ui
- deploy storybook?
