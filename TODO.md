DB:
---
- reproduction from prod to local&test db
- make 2nd db on OVH (prod) and set URI in env.prod

VRT:
----
- when logging meta, then config.rootDir is '/src/src' ???

Backup / Restore:
-----------------
- mongo-db has a config db, which is mainly for cluster-meta. do we have to backup/restore it as well?

Storybook:
----------
- deploy storybook?

Documentation:
--------------
- document merging strategy / release workflow

Github:
-------
- add branch restrictions on main

Resend:
-------
- Create SAGW account
- Add SAGW Resend token to env file