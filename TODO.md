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
- fix scss warnings
- fix sentry warnings

- cron jobs invoke one method, which itself is wrapped in try/catch. Test to see if this is enough, or if the GET handler needs a try/catch as well.
- as i remember, vercel does not support nvmrc files. make strategic decision -> as of now, building happens on github, not vercel. make sure to use nvmrc in github workflow
- squash commits
- run tests before build
- nextjs build triggers API-Routes?

- release-please:
  - https://github.com/googleapis/release-please
  - then, make prod vercel build on tag creation: https://vercel.com/guides/can-you-deploy-based-on-tags-releases-on-vercel

- write all vercel config in vercel.json instead of using vercel ui
- deploy storybook?
- after deploy on vercel, run tests again against vercel preview url?


release workflow:
- branch off main
- create pr on branch, target main branch -> vercel preview build of branch
- merge pr into main branch
  -> vercel builds on main are disabled
  -> workflow release-please will run
  -> release-please will create a release-branch
- ... create more branches, pr's and merges
- create release by merging release-branch
  -> vercel will create prod deployment