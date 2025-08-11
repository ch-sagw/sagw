Backup / Restore:
-----------------
- mongo-db has a config db, which is mainly for cluster-meta. do we have to backup/restore it as well?
- test blob backup/restore with lots of large image files

Storybook:
----------
- deploy storybook?

Github:
-------
- add branch restrictions on main

Resend:
-------
- Create SAGW account
- Add SAGW Resend token to env file

Sentry:
-------
- Install https://payloadcms.com/docs/plugins/sentry 

NextJs:
-------
-

Payload:
--------
- Generate types: when is it run? do we have to run in automatically, e.g. on ci, on postinstall etc?
- set hideAPIURL to true on prod: https://payloadcms.com/docs/configuration/collections#admin-options

Payload Config:
--------
- fieldsLinkExternal -> relationTo should relate to all available pages.
- earlyCareerAward -> winnersTeasers -> make select with with winners detail pages
- translations for custom admin ui labels
- limit upload in images, video, documents to corresponding type
- add global i18n (e.g. form errors, form labels, etc)
- prepopulate seo on collections


- internal link
  -> group collections and globals
  -> define a property "isLinkable" in all collections. in server component, we get all collections and can filter by that property. That way, we don't need to hard code the available collections
  -> exclude current page from being selectable: if internalLink is used on Activities page, the Activities page should not be selectable.