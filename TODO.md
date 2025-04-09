DB:
---
- containerize local db
- reproduction from prod to local dev?

VRT:
----
- when logging meta, then config.rootDir is '/src/src' ???

Backup / Restore:
-----------------
- test integration of backup/restore
- for backup-buckets: integrate env-variable to prefix test/staging/prod. also adapt config (send mail/slack) for different environments
- backup/restore: make it for staging and prod
- backup bucket names have wrong time
- Vercel has 4.5mb limit on Vercel Functions. Check to see if we are affacted by this in our corn-job functions

Build:
------
- fix sentry warnings
- -> install sentry integration in vercel
- vercel: add env-dependant secrets (mongodb etc.)
- write all vercel config in vercel.json instead of using vercel ui

Setup:
------
- do not use cross-env anymore!

Storybook:
----------
- deploy storybook?

Documentation:
--------------
- document merging strategy / release workflow
- document env variables and save them to 1password. which are used on vercel/github?

Github:
-------
- add branch restrictions on main

Slack:
------
- prod-deployment is ok. staging and preview post to the same channel: can we differentiate them somewhow?

Accounts:
---------
- Make Resend account for SAGW
