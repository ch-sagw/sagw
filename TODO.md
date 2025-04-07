DB:
---
- containerize local db
  - seed function?
  - reproduction from prod to local dev?

VRT:
----
- when logging meta, then config.rootDir is '/src/src' ???

Backup / Restore:
-----------------
- test integration of backup/restore
- for backup-buckets: integrate env-variable to prefix test/staging/prod. also adapt config (send mail/slack) for different environments
- backup/restore: make it for staging and prod
- backup/restore: add script to list all buckets
- backup/restore: add script to select buckets to delete
- backup/restore: add script to download backups buckets
- backup bucket names have wrong time

Build:
------
- fix sentry warnings
- -> install sentry integration in vercel
- vercel: add env-dependant secrets (mongodb etc.)
- WARN: No email adapter provided. Email will be written to console. More info at https://payloadcms.com/docs/email/overview.
- write all vercel config in vercel.json instead of using vercel ui
- scss warnings on github staging build

Setup:
------
- order npm scripts
- do not use cross-env anymore!

Storybook:
----------
- deploy storybook?

Documentation:
--------------
- document merging strategy / release workflow
- document env variables and save them to 1password. which are used on vercel/github?

Vercel:
-------
- Remove deployment protection -> otherwise, we have to be logged in to see preview/staging

Github:
-------
- force squash commits
- security -> setup code-scanning etc.
- add branch restrictions on main

Slack:
------
- disable posting in backup and other channels
- get more fine-grained notifications from ovh and vercel
- prod-deployment is ok. staging and preview post to the same channel: can we differentiate them somewhow?
