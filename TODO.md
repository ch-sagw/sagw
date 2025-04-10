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
- install sentry integration in vercel

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

Github:
-------
- add branch restrictions on main

Accounts:
---------
- Make Resend account for SAGW

Resend:
-------
- Create SAGW account
- Add SAGW Resend token to env file