DB:
---
- reproduction from prod to local&test db
- make 2nd db on OVH (prod) and set URI in env.prod

VRT:
----
- when logging meta, then config.rootDir is '/src/src' ???

Backup / Restore:
-----------------
- for backup-buckets: integrate env-variable to prefix test/staging/prod. also adapt config (send mail/slack) for different environments
- backup/restore: make it for staging and prod
- mongo-db has a config db, which is mainly for cluster-meta. do we have to backup/restore it as well?

Build:
------
- -> install sentry integration in vercel
- vercel: add env-dependant secrets (mongodb etc.)

Sentry:
-------
- fix sentry build issues/warnings
- config sentry for different environments

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
- add branch restrictions on main

Slack:
------
- prod-deployment is ok. staging and preview post to the same channel: can we differentiate them somewhow?

Accounts:
---------
- Make Resend account for SAGW

Resend:
-------
- Create SAGW account
- Add SAGW Resend token to env file