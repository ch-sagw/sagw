# Changelog

## [0.2.2](https://github.com/ch-sagw/sagw/compare/v0.2.1...v0.2.2) (2025-04-18)


### Chore

* add seurity check for potential env-var mismatch ([c644efa](https://github.com/ch-sagw/sagw/commit/c644efad65e3379c05eb817053d6a8ce72db7a24))
* add some more secuirty checks for replication ([0259cb3](https://github.com/ch-sagw/sagw/commit/0259cb38bac7cb13669a6b1332b5ac0632442749))
* adding explicit upload limit to config ([be39ce4](https://github.com/ch-sagw/sagw/commit/be39ce408f0b81c4e17ce9254813d2cb5aa767ef))
* changing copyright owner in LICENCE file ([f344ac3](https://github.com/ch-sagw/sagw/commit/f344ac37ac6ae72da12308faaa0f5ee722b7833a))
* changing upload config to use clientuploads to bypass vercel limit ([bbf671f](https://github.com/ch-sagw/sagw/commit/bbf671f05672431310c27b3bc84c5b7c2ee46952))
* **deps-dev:** bump the development-dependencies group with 10 updates ([#34](https://github.com/ch-sagw/sagw/issues/34)) ([0887c11](https://github.com/ch-sagw/sagw/commit/0887c11aeddf12088ba82ce187b29386557feeaa))
* **deps:** bump the production-dependencies group with 9 updates ([#33](https://github.com/ch-sagw/sagw/issues/33)) ([515c21c](https://github.com/ch-sagw/sagw/commit/515c21c0c133ac15bb5a1031de026efffda5270d))
* fixing tiny typos in comments ([f344ac3](https://github.com/ch-sagw/sagw/commit/f344ac37ac6ae72da12308faaa0f5ee722b7833a))
* fixing typo in addDocumentsToColletion ([f344ac3](https://github.com/ch-sagw/sagw/commit/f344ac37ac6ae72da12308faaa0f5ee722b7833a))
* install resend as dep instead if dev-dep ([11f1f34](https://github.com/ch-sagw/sagw/commit/11f1f349eeba018a2926c9c3863e80acc32223b0))
* properly catch errors in maintenance scripts ([2271d5a](https://github.com/ch-sagw/sagw/commit/2271d5ad3df1005ccce5ab436080020d4d2de07c))
* remove comments ([8038e4d](https://github.com/ch-sagw/sagw/commit/8038e4d7f4b44d1ca1efd4dd137581903b162a5b))
* remove todo ([c3d844b](https://github.com/ch-sagw/sagw/commit/c3d844bf0df98e8e2eb6db85c1671cd1cbc74055))


### CI

* add mechanism to replicate prod to test and local env ([83d5f43](https://github.com/ch-sagw/sagw/commit/83d5f43269217db791ba6078b540d2518582dcf1))


### Documentation

* add documentaiton for branching and releasing ([2ced819](https://github.com/ch-sagw/sagw/commit/2ced819c4eadcd1fe7deb5c57fb033e03bdc2bfd))
* add documentation about used services ([11f1f34](https://github.com/ch-sagw/sagw/commit/11f1f349eeba018a2926c9c3863e80acc32223b0))
* add documentation for deployments ([c5a0c37](https://github.com/ch-sagw/sagw/commit/c5a0c3782086fe2785fb861ace7bb18684528b06))
* remove todo ([279027a](https://github.com/ch-sagw/sagw/commit/279027adda8537f47937370d62ef2b353b643bd6))
* remove todos ([b539f2f](https://github.com/ch-sagw/sagw/commit/b539f2ffcaf779e9625b810db8075a82e623d98a))
* update comment about visual:check tag ([0e9d638](https://github.com/ch-sagw/sagw/commit/0e9d638c25633f6c8df715c0c2c5194b44bbd45f))
* update documentation about environments ([9d2b418](https://github.com/ch-sagw/sagw/commit/9d2b4182d1d35d472fc7dd446481950c7328dfb0))
* update script commands documentation ([f0e810d](https://github.com/ch-sagw/sagw/commit/f0e810d14913384e350d11275e6fd22207f0c02f))


### Bug Fixes

* add correct syntax line to support --exclude copy flag ([167e2aa](https://github.com/ch-sagw/sagw/commit/167e2aa5a748ed8182de628896748e288dc45aa0))
* make sentry transitions work ([7ddf13b](https://github.com/ch-sagw/sagw/commit/7ddf13bb4667125895b485ae203c2f6e8194223c))
* set correct public server url for vercel env ([f970c23](https://github.com/ch-sagw/sagw/commit/f970c23d2a0fed94d62657588c78f05e0c685bcb))

## [0.2.1](https://github.com/ch-sagw/sagw/compare/v0.2.0...v0.2.1) (2025-04-11)


### Chore

* enable route auth ([cbd9a91](https://github.com/ch-sagw/sagw/commit/cbd9a9112a87adaec2041a7694b06406f22384e4))
* make backup/restore script environment dependant ([cbd9a91](https://github.com/ch-sagw/sagw/commit/cbd9a9112a87adaec2041a7694b06406f22384e4))
* properly forat var names ([5248aca](https://github.com/ch-sagw/sagw/commit/5248aca7d5519168c4861208e0766b8a85821711))
* remove unnecessary scripts, document dev scripts ([cbd9a91](https://github.com/ch-sagw/sagw/commit/cbd9a9112a87adaec2041a7694b06406f22384e4))


### Documentation

* add documentation for restore prefix ([cbd9a91](https://github.com/ch-sagw/sagw/commit/cbd9a9112a87adaec2041a7694b06406f22384e4))
* remove todo's ([fa493c5](https://github.com/ch-sagw/sagw/commit/fa493c531c544a3443c40a876977b5013f411319))
* remove todos ([1babbde](https://github.com/ch-sagw/sagw/commit/1babbded468785dd0c848fdeec4db0234df55330))


### Bug Fixes

* properly configure auth token for sentry ([1babbde](https://github.com/ch-sagw/sagw/commit/1babbded468785dd0c848fdeec4db0234df55330))

## [0.2.0](https://github.com/ch-sagw/sagw/compare/v0.1.5...v0.2.0) (2025-04-10)


### Chore

* add start scripts for all environments, customize vercel build for all envs ([a003cb9](https://github.com/ch-sagw/sagw/commit/a003cb93cf57fc5a49d7443e03a56f60e5130602))
* don't use base64 encoding for db-restore ([a003cb9](https://github.com/ch-sagw/sagw/commit/a003cb93cf57fc5a49d7443e03a56f60e5130602))
* get buckets in helper instead of in calling methods ([a003cb9](https://github.com/ch-sagw/sagw/commit/a003cb93cf57fc5a49d7443e03a56f60e5130602))
* implement various backup maintenance helpers ([a003cb9](https://github.com/ch-sagw/sagw/commit/a003cb93cf57fc5a49d7443e03a56f60e5130602))
* remove staging env, start documenting environments ([a003cb9](https://github.com/ch-sagw/sagw/commit/a003cb93cf57fc5a49d7443e03a56f60e5130602))
* remove staging scripts ([a003cb9](https://github.com/ch-sagw/sagw/commit/a003cb93cf57fc5a49d7443e03a56f60e5130602))
* reorder scripts, add script for backups maintenance ([a003cb9](https://github.com/ch-sagw/sagw/commit/a003cb93cf57fc5a49d7443e03a56f60e5130602))
* silence scss deprecations warning, originating from node_modules ([a003cb9](https://github.com/ch-sagw/sagw/commit/a003cb93cf57fc5a49d7443e03a56f60e5130602))
* split env variables between base and prod/test ([a003cb9](https://github.com/ch-sagw/sagw/commit/a003cb93cf57fc5a49d7443e03a56f60e5130602))
* use correct vercel build command for test ([a003cb9](https://github.com/ch-sagw/sagw/commit/a003cb93cf57fc5a49d7443e03a56f60e5130602))
* wso ([a003cb9](https://github.com/ch-sagw/sagw/commit/a003cb93cf57fc5a49d7443e03a56f60e5130602))


### CI

* rename workflow ([a003cb9](https://github.com/ch-sagw/sagw/commit/a003cb93cf57fc5a49d7443e03a56f60e5130602))


### Documentation

* add proper documentation for env vars ([a003cb9](https://github.com/ch-sagw/sagw/commit/a003cb93cf57fc5a49d7443e03a56f60e5130602))
* add todo ([a003cb9](https://github.com/ch-sagw/sagw/commit/a003cb93cf57fc5a49d7443e03a56f60e5130602))
* remove done todos ([a003cb9](https://github.com/ch-sagw/sagw/commit/a003cb93cf57fc5a49d7443e03a56f60e5130602))
* remove finished todos ([a003cb9](https://github.com/ch-sagw/sagw/commit/a003cb93cf57fc5a49d7443e03a56f60e5130602))
* remove todos ([a003cb9](https://github.com/ch-sagw/sagw/commit/a003cb93cf57fc5a49d7443e03a56f60e5130602))


### Features

* add resend email adapter ([a003cb9](https://github.com/ch-sagw/sagw/commit/a003cb93cf57fc5a49d7443e03a56f60e5130602))


### Bug Fixes

* send blob data as array buffer ([a003cb9](https://github.com/ch-sagw/sagw/commit/a003cb93cf57fc5a49d7443e03a56f60e5130602))

## [0.1.5](https://github.com/ch-sagw/sagw/compare/v0.1.4...v0.1.5) (2025-04-07)


### Chore

* add node engine ([c6ecb08](https://github.com/ch-sagw/sagw/commit/c6ecb081ebb859fca5d1e2fc02a213aebf111e4b))
* add note about docker node version ([c6ecb08](https://github.com/ch-sagw/sagw/commit/c6ecb081ebb859fca5d1e2fc02a213aebf111e4b))
* remove permissions to see if fixes issue with vercel not commenting on pr ([c6ecb08](https://github.com/ch-sagw/sagw/commit/c6ecb081ebb859fca5d1e2fc02a213aebf111e4b))
* set permission again ([c6ecb08](https://github.com/ch-sagw/sagw/commit/c6ecb081ebb859fca5d1e2fc02a213aebf111e4b))
* use only one compose file ([c6ecb08](https://github.com/ch-sagw/sagw/commit/c6ecb081ebb859fca5d1e2fc02a213aebf111e4b))
* wso ([c6ecb08](https://github.com/ch-sagw/sagw/commit/c6ecb081ebb859fca5d1e2fc02a213aebf111e4b))


### CI

* give it pr write permission to fix issue with playwright report comment ([c6ecb08](https://github.com/ch-sagw/sagw/commit/c6ecb081ebb859fca5d1e2fc02a213aebf111e4b))
* remove preview build from workflow, let vercel do it ([c6ecb08](https://github.com/ch-sagw/sagw/commit/c6ecb081ebb859fca5d1e2fc02a213aebf111e4b))
* rename workflow ([c6ecb08](https://github.com/ch-sagw/sagw/commit/c6ecb081ebb859fca5d1e2fc02a213aebf111e4b))
* run correct test command ([c6ecb08](https://github.com/ch-sagw/sagw/commit/c6ecb081ebb859fca5d1e2fc02a213aebf111e4b))
* set root ([c6ecb08](https://github.com/ch-sagw/sagw/commit/c6ecb081ebb859fca5d1e2fc02a213aebf111e4b))
* use image directly in workflow ([c6ecb08](https://github.com/ch-sagw/sagw/commit/c6ecb081ebb859fca5d1e2fc02a213aebf111e4b))
* use updated checkout, use official playwright docker image for prod ([c6ecb08](https://github.com/ch-sagw/sagw/commit/c6ecb081ebb859fca5d1e2fc02a213aebf111e4b))


### Documentation

* add documentation about node handling, move env-vars and backup docs ([c6ecb08](https://github.com/ch-sagw/sagw/commit/c6ecb081ebb859fca5d1e2fc02a213aebf111e4b))
* organize todos ([c6ecb08](https://github.com/ch-sagw/sagw/commit/c6ecb081ebb859fca5d1e2fc02a213aebf111e4b))
* remove finished todos ([c6ecb08](https://github.com/ch-sagw/sagw/commit/c6ecb081ebb859fca5d1e2fc02a213aebf111e4b))
* update todos ([c6ecb08](https://github.com/ch-sagw/sagw/commit/c6ecb081ebb859fca5d1e2fc02a213aebf111e4b))


### Bug Fixes

* set test element to block to mitigate screenshot width dimension mismatch ([c6ecb08](https://github.com/ch-sagw/sagw/commit/c6ecb081ebb859fca5d1e2fc02a213aebf111e4b))


### Test

* add host config again ([c6ecb08](https://github.com/ch-sagw/sagw/commit/c6ecb081ebb859fca5d1e2fc02a213aebf111e4b))
* try to use official playwright docker image ([c6ecb08](https://github.com/ch-sagw/sagw/commit/c6ecb081ebb859fca5d1e2fc02a213aebf111e4b))

## [0.1.4](https://github.com/ch-sagw/sagw/compare/v0.1.3...v0.1.4) (2025-04-06)


### Chore

* exclude node_modules from stylelint ([2a9d083](https://github.com/ch-sagw/sagw/commit/2a9d083a0cd2558f02adb70c56229c86f2bab28d))
* rename workflows ([c25040f](https://github.com/ch-sagw/sagw/commit/c25040f57fc6d30b1039beeb7d68dc9c22268329))
* rename workflows ([b3a2be2](https://github.com/ch-sagw/sagw/commit/b3a2be27212f5e56e493fc38d9480a1f34cfc4c5))
* use correct node version and reinstall node_modules ([4c45f50](https://github.com/ch-sagw/sagw/commit/4c45f502700c58cb9bd4131f72124b593458c818))
* wso test to rebuild branch ([4c45f50](https://github.com/ch-sagw/sagw/commit/4c45f502700c58cb9bd4131f72124b593458c818))
* wso to check if vercel automatic build is skipped ([c25040f](https://github.com/ch-sagw/sagw/commit/c25040f57fc6d30b1039beeb7d68dc9c22268329))


### CI

* add playwright report to pr ([4c45f50](https://github.com/ch-sagw/sagw/commit/4c45f502700c58cb9bd4131f72124b593458c818))
* again try to skip release branch build after merge ([#22](https://github.com/ch-sagw/sagw/issues/22)) ([aea34ae](https://github.com/ch-sagw/sagw/commit/aea34ae6e19942e7081914732816803ae734efd3))
* build test container manually ([4c45f50](https://github.com/ch-sagw/sagw/commit/4c45f502700c58cb9bd4131f72124b593458c818))
* delete node_modules after testing ([4c45f50](https://github.com/ch-sagw/sagw/commit/4c45f502700c58cb9bd4131f72124b593458c818))
* do manual branch builds ([4c45f50](https://github.com/ch-sagw/sagw/commit/4c45f502700c58cb9bd4131f72124b593458c818))
* do manual branch builds ([#19](https://github.com/ch-sagw/sagw/issues/19)) ([4c45f50](https://github.com/ch-sagw/sagw/commit/4c45f502700c58cb9bd4131f72124b593458c818))
* explicitly exclude release branch ([c25040f](https://github.com/ch-sagw/sagw/commit/c25040f57fc6d30b1039beeb7d68dc9c22268329))
* explicitly exclude release branch ([b3a2be2](https://github.com/ch-sagw/sagw/commit/b3a2be27212f5e56e493fc38d9480a1f34cfc4c5))
* ignore release branch on branch build ([c25040f](https://github.com/ch-sagw/sagw/commit/c25040f57fc6d30b1039beeb7d68dc9c22268329))
* make deploy dependant from test ([4c45f50](https://github.com/ch-sagw/sagw/commit/4c45f502700c58cb9bd4131f72124b593458c818))
* only run workflow un pull_request event ([4c45f50](https://github.com/ch-sagw/sagw/commit/4c45f502700c58cb9bd4131f72124b593458c818))
* redo checkout ([4c45f50](https://github.com/ch-sagw/sagw/commit/4c45f502700c58cb9bd4131f72124b593458c818))
* rename test workflow ([4c45f50](https://github.com/ch-sagw/sagw/commit/4c45f502700c58cb9bd4131f72124b593458c818))
* reorder instructions ([4c45f50](https://github.com/ch-sagw/sagw/commit/4c45f502700c58cb9bd4131f72124b593458c818))
* reorder instructions ([4c45f50](https://github.com/ch-sagw/sagw/commit/4c45f502700c58cb9bd4131f72124b593458c818))
* run test ([4c45f50](https://github.com/ch-sagw/sagw/commit/4c45f502700c58cb9bd4131f72124b593458c818))
* run test as separate job ([4c45f50](https://github.com/ch-sagw/sagw/commit/4c45f502700c58cb9bd4131f72124b593458c818))
* run test in separate workflow ([4c45f50](https://github.com/ch-sagw/sagw/commit/4c45f502700c58cb9bd4131f72124b593458c818))
* run tests before prod deployment ([c25040f](https://github.com/ch-sagw/sagw/commit/c25040f57fc6d30b1039beeb7d68dc9c22268329))
* run tests before prod deployment ([b3a2be2](https://github.com/ch-sagw/sagw/commit/b3a2be27212f5e56e493fc38d9480a1f34cfc4c5))
* run workflow on pull requests ([4c45f50](https://github.com/ch-sagw/sagw/commit/4c45f502700c58cb9bd4131f72124b593458c818))
* skip test ([4c45f50](https://github.com/ch-sagw/sagw/commit/4c45f502700c58cb9bd4131f72124b593458c818))
* stop container after test ([4c45f50](https://github.com/ch-sagw/sagw/commit/4c45f502700c58cb9bd4131f72124b593458c818))
* stop docker after test ([4c45f50](https://github.com/ch-sagw/sagw/commit/4c45f502700c58cb9bd4131f72124b593458c818))


### Documentation

* add todo ([4c45f50](https://github.com/ch-sagw/sagw/commit/4c45f502700c58cb9bd4131f72124b593458c818))


### Bug Fixes

* only use ignore branches ([c25040f](https://github.com/ch-sagw/sagw/commit/c25040f57fc6d30b1039beeb7d68dc9c22268329))

## [0.1.3](https://github.com/ch-sagw/sagw/compare/v0.1.2...v0.1.3) (2025-04-06)


### Documentation

* remove todo ([#16](https://github.com/ch-sagw/sagw/issues/16)) ([0425476](https://github.com/ch-sagw/sagw/commit/0425476c62f230b6ec2f6ca650f3284e434f649b))

## [0.1.2](https://github.com/ch-sagw/sagw/compare/v0.1.1...v0.1.2) (2025-04-06)


### Chore

* remove comment ([053ccb1](https://github.com/ch-sagw/sagw/commit/053ccb1fc248a67b1b88975f9fedc9ac95356978))


### CI

* add preview deploy on main ([ee485ef](https://github.com/ch-sagw/sagw/commit/ee485ef07c81c7890c5bab5ed458d3ef28df0b54))


### Documentation

* add todos ([4dc1981](https://github.com/ch-sagw/sagw/commit/4dc1981c357213c6e1bf7412b311c6a251b2d17a))

## [0.1.1](https://github.com/ch-sagw/sagw/compare/v0.1.0...v0.1.1) (2025-04-06)


### Chore

* **deps-dev:** bump the development-dependencies group across 1 directory with 16 updates ([f94254c](https://github.com/ch-sagw/sagw/commit/f94254cfe4b5a79d3b136021b47c28a938de0abf))
* **deps:** bump the production-dependencies group across 1 directory with 12 updates ([8da5a6c](https://github.com/ch-sagw/sagw/commit/8da5a6c76f038d26880f6f7e572265fa50d1b657))
* **deps:** bump the production-dependencies group across 1 directory with 12 updates ([1dfec83](https://github.com/ch-sagw/sagw/commit/1dfec83e13cc29320d9d347c7add6641ef7c03c8))
* make stylelint ignore node_modules ([4ba8fd8](https://github.com/ch-sagw/sagw/commit/4ba8fd86e39bf2ae2935b3241761c4e1d351ae21))
* properly time corn-jobs / take time-shift into consideration ([3d23ea9](https://github.com/ch-sagw/sagw/commit/3d23ea9ad24df1dc2fbfd60ceb346d615f37c753))


### Documentation

* add todo ([#14](https://github.com/ch-sagw/sagw/issues/14)) ([23817be](https://github.com/ch-sagw/sagw/commit/23817becc654e4e9f3e61845c4f4ba50e03e8d6f))
* manage todo's ([96dbd87](https://github.com/ch-sagw/sagw/commit/96dbd879becb83d46fc491e8116acbc271ee02a6))

## [0.1.0](https://github.com/ch-sagw/sagw/compare/v0.0.1...v0.1.0) (2025-04-06)


### Chore

* add and configure release-please ([7f9eca3](https://github.com/ch-sagw/sagw/commit/7f9eca3b1d5c1350b5f0cda99245742bc6addd42))
* add automatic visual regression tests on stories files ([5fafb55](https://github.com/ch-sagw/sagw/commit/5fafb55cf5fd77a70fc41e7d3aac674fb67a3a1f))
* add button ([02d07b9](https://github.com/ch-sagw/sagw/commit/02d07b967c515363598777a9ae634c81252ad536))
* add comments in files regarding necessary env-variables ([ec2212e](https://github.com/ch-sagw/sagw/commit/ec2212e60b8543b5c4fc46e57648f2981a4018c3))
* add commitlint, semantic-release, husky, lint-staged ([9f0ca73](https://github.com/ch-sagw/sagw/commit/9f0ca732ccd62eb47916eec05b9f20a6b96c883d))
* add convenience helper to generate component ([f9afba1](https://github.com/ch-sagw/sagw/commit/f9afba11d0afae51970e68631e687e871f853d54))
* add default prop next to -webkit prefixed prop ([4946b16](https://github.com/ch-sagw/sagw/commit/4946b164f250b094c94547d63f7499c86c27c17d))
* add dependabot config ([5f28074](https://github.com/ch-sagw/sagw/commit/5f28074903b0758ae63d58a2d7dc55565626c5d7))
* add dockerized db and add db start to dev script ([fbdc294](https://github.com/ch-sagw/sagw/commit/fbdc294a2c1f2177e3e0d5c79c6a5b09f501b48d))
* add sample component to test storybook integration ([55cca65](https://github.com/ch-sagw/sagw/commit/55cca653910fc0450f44a16fdacd30b6e1400f6b))
* add sentry ([c532513](https://github.com/ch-sagw/sagw/commit/c532513208d1ec41216a84562c6e47bc9d9c1d6c))
* add slack notifications for backups cleanup ([22539e2](https://github.com/ch-sagw/sagw/commit/22539e2707b75dcb3ed8c004a122d0f88e510a35))
* add slack notifications for blob backups ([d7510ef](https://github.com/ch-sagw/sagw/commit/d7510ef8d3fa786a1181253c022aae354f692a37))
* add slack notifications to db backup ([fb48200](https://github.com/ch-sagw/sagw/commit/fb48200d069f44fd7b17457af4dc54358ff0d3b2))
* add storybook ([db20e79](https://github.com/ch-sagw/sagw/commit/db20e79d6eba878bde367bdae4db28b4b848d682))
* add strictrer linting rules and fix linting issues ([dcbd85c](https://github.com/ch-sagw/sagw/commit/dcbd85c175c878274d5037a603c6e4aecfcb665f))
* add stylint ([21efe33](https://github.com/ch-sagw/sagw/commit/21efe33b2cff9937efd957f12c5e5ca016067a50))
* add todos ([b408c01](https://github.com/ch-sagw/sagw/commit/b408c012b192ca603c1333e8927e53593fc7309b))
* add vercel blob storage plugin ([d203b77](https://github.com/ch-sagw/sagw/commit/d203b771a7877f06de63436fa474f61154020e27))
* add webkit to test projects ([88ada75](https://github.com/ch-sagw/sagw/commit/88ada75484e19571f4f7c895a278f8d4d908f5b3))
* also make sure payload has same version as plugins ([b689af9](https://github.com/ch-sagw/sagw/commit/b689af98f03883cbf6867c7ee66d7ebf7744d798))
* better format for backup cleanup slack message ([70e03ad](https://github.com/ch-sagw/sagw/commit/70e03ad467db0cd1c8eb418d9a3468bb8bb6e37c))
* better format slack message for backups cleanup ([0ba7d39](https://github.com/ch-sagw/sagw/commit/0ba7d399a38ce50741c6d2367181d80921e8d028))
* change node version in nvmrc ([0cb71b2](https://github.com/ch-sagw/sagw/commit/0cb71b2df5ccf4ac1c8f98b47f44e1c8c869c11d))
* correctly import dbHelper ([49dedfe](https://github.com/ch-sagw/sagw/commit/49dedfe398ecb8cb14ef3476eccde871e97427b1))
* dockerize tests, revert playwright to not use ct ([1f1700c](https://github.com/ch-sagw/sagw/commit/1f1700c7d05d56b355ed00716c6f81be9ba727e7))
* document env-variables ([5576342](https://github.com/ch-sagw/sagw/commit/55763423f1640f9b8576fb7dcc0d3d930f6a1332))
* don't call exported main method ([16c0bd5](https://github.com/ch-sagw/sagw/commit/16c0bd5191c0e92a491396a3fbb54137087ddbdd))
* exclude convenience helper from ts compilation ([b378994](https://github.com/ch-sagw/sagw/commit/b378994ea2c8298a63becaa2a7a335ba7e67e38a))
* fetch stories manifest from live server ([d1b94e2](https://github.com/ch-sagw/sagw/commit/d1b94e2a3e07373147fa431b169835246223b527))
* fix absolute imports for scss ([236f9bb](https://github.com/ch-sagw/sagw/commit/236f9bb4fc171f75fdfefa115f8b994a49c87d35))
* fix after removing iframe from baseurl ([b7bf920](https://github.com/ch-sagw/sagw/commit/b7bf920d9e888278abf3cf828159e199f3940136))
* fix error handling for cron jobs ([c3447e3](https://github.com/ch-sagw/sagw/commit/c3447e392b143896ad17a85cd33817c6af802872))
* fix linting issues ([7c776a4](https://github.com/ch-sagw/sagw/commit/7c776a4cee883e2a5597f46719110e8f1c9313a9))
* fix linting issues ([b95f9be](https://github.com/ch-sagw/sagw/commit/b95f9bef5ba151f25368217797e5a21794ab91fa))
* fix linting issues ([a8b0d91](https://github.com/ch-sagw/sagw/commit/a8b0d91e55e9a4af62a437e94e2698e07145eb16))
* fix lintstaged command ([30690af](https://github.com/ch-sagw/sagw/commit/30690af77c6e639eae15b5ef3ec9794cce83f635))
* fix lintstaged command ([0293400](https://github.com/ch-sagw/sagw/commit/029340020480b741b728fbb5c8365505114b5ab6))
* fix more linting issues ([9c46fa3](https://github.com/ch-sagw/sagw/commit/9c46fa38cbfa14c54d7160b5373a54d2a7a5dac7))
* fix more linting issues ([e3d0218](https://github.com/ch-sagw/sagw/commit/e3d0218fdf88a4e73de232e08ed974d687367afc))
* fix scss warning ([8edf2b9](https://github.com/ch-sagw/sagw/commit/8edf2b9fc459f2f4ffadd0795a6fef53311c4d04))
* implement backup/restore ([7b8e8bd](https://github.com/ch-sagw/sagw/commit/7b8e8bd8d7646a248c11cb93ed6aa93521d2eccb))
* install vercel ([61686f0](https://github.com/ch-sagw/sagw/commit/61686f0c943da32417b2c13a0cbb65004c6e0a5e))
* keep backups for 1 month ([d81366b](https://github.com/ch-sagw/sagw/commit/d81366ba4734115b23c3330532f1355ec4f8bf86))
* make button uppercase, update screenshots after adopt styling ([60ee783](https://github.com/ch-sagw/sagw/commit/60ee7838a3de33b268715f8bee864c727fd5f2a1))
* make example of ignoring a single story from visual test ([335f63e](https://github.com/ch-sagw/sagw/commit/335f63e22ef71b9b31e18d1613288e9d0d2e3983))
* make scss work in storybook ([9c09f9f](https://github.com/ch-sagw/sagw/commit/9c09f9ff624353e2ef3fae6a3ff923f7031f9577))
* make storybook not opening browser a separate script ([3b84a37](https://github.com/ch-sagw/sagw/commit/3b84a37c9b598724d9aaa390c3541ba951763af0))
* make sure all payloadcms deps have same version ([a1980ad](https://github.com/ch-sagw/sagw/commit/a1980ad1bfb2907fd1e7dfbe36f23e04674fcba2))
* manage todos ([1253a3e](https://github.com/ch-sagw/sagw/commit/1253a3e2c2853d7493d820eaeb17d005ed08849a))
* manage todos ([ee09573](https://github.com/ch-sagw/sagw/commit/ee0957311cb2293fbacff892b5c6321307e7d6f5))
* mount node_modules in docker ([69f588e](https://github.com/ch-sagw/sagw/commit/69f588eceb88d74e46ffc17e656d399aeef4076e))
* move snapshots inside components folder ([c61c139](https://github.com/ch-sagw/sagw/commit/c61c139309ebed61cc51420305c5796af7137b0b))
* move testing-helpers into src, use absoulte imports everywhere, add missing screenshots ([0178aab](https://github.com/ch-sagw/sagw/commit/0178aabf0e43570261c9a0988c761dae41b05560))
* note docker and compose ([37ca994](https://github.com/ch-sagw/sagw/commit/37ca994bdd7f87ed5008d1de36121009d6ae6678))
* prevent storybook from opening browser ([81fa67c](https://github.com/ch-sagw/sagw/commit/81fa67cc53c0428946d8bfa8a1f453a6da100fdd))
* properly format blob backup ([aa88978](https://github.com/ch-sagw/sagw/commit/aa88978431f044a06b87f1a4f3ac6eabc24a3c98))
* properly time cron jobs ([1b14dd0](https://github.com/ch-sagw/sagw/commit/1b14dd0c657e6518541b5da7e575f8bacc87f123))
* put test relevant strings into config ([927a883](https://github.com/ch-sagw/sagw/commit/927a88338ae962fd2409d45dfe10929ea701fa11))
* refactor to enable individual tests and reuse logic from auto test generation ([ac9359d](https://github.com/ch-sagw/sagw/commit/ac9359d168a5410f96b68dcdb6ee782ed8567561))
* remove button ([29b0715](https://github.com/ch-sagw/sagw/commit/29b071547c1c86905760f8c2f68e13874004ccac))
* remove comment and manage todos ([b167fef](https://github.com/ch-sagw/sagw/commit/b167fef8e0d85e05e18f40ddbe8be280f932e743))
* remove done todo's ([b8a6dd9](https://github.com/ch-sagw/sagw/commit/b8a6dd90c26cfe9d2caa800809a7e0b64a5dd69b))
* remove host config ([f7e20dd](https://github.com/ch-sagw/sagw/commit/f7e20dda3a4a724c6c67f46c7128d7fc38ebef5b))
* remove iframe from base url ([5f1ea77](https://github.com/ch-sagw/sagw/commit/5f1ea7757babd9e3fa3a0caf715948154bbcc1fb))
* remove node version ([96aaa60](https://github.com/ch-sagw/sagw/commit/96aaa60d8b592b1bf99250af2d216b7fbcbfd904))
* remove obsolete docker stuff ([91215b4](https://github.com/ch-sagw/sagw/commit/91215b490b7f37cab743401bbc0d3b35ddb3e2d3))
* remove prettier ([08af42d](https://github.com/ch-sagw/sagw/commit/08af42d9215530ab61971bb8a02d2e473a78b0e0))
* remove prettier from extensions ([5e3f492](https://github.com/ch-sagw/sagw/commit/5e3f49274d9a79dc992e76ddbfd74d180ef3912b))
* remove semantic release ([836836f](https://github.com/ch-sagw/sagw/commit/836836f9bd5ea6e2ede1a9487b0a516090aaf2d8))
* rename docker and compose file ([9a1ebfa](https://github.com/ch-sagw/sagw/commit/9a1ebfa080c72e7de833a6ddb8338fb2b1cd8551))
* rename payload initially provide docker stuff ([4819ef8](https://github.com/ch-sagw/sagw/commit/4819ef850e78553ff21c6bd2536d8b74c62525f9))
* run storybook before running tests ([2ebca9b](https://github.com/ch-sagw/sagw/commit/2ebca9bb936a295023c806c1e2a8ae48c1c78fc3))
* set formatters to vscode defaults ([5be01a1](https://github.com/ch-sagw/sagw/commit/5be01a1e77f7c99c2a950f9906dd89a6ee96ee93))
* set localhost as next-url for now ([bc65f7c](https://github.com/ch-sagw/sagw/commit/bc65f7c69041650ca296449ab3adff5840ad2b73))
* set proper target on staging build ([a6c5162](https://github.com/ch-sagw/sagw/commit/a6c51629b1549a140484a68cae6f0de15bf06237))
* set version to 0.0.1 ([6bd0634](https://github.com/ch-sagw/sagw/commit/6bd0634cb0b42f108a74b594aeda44d30957f410))
* try using non-es6 method declaration ([c008c9b](https://github.com/ch-sagw/sagw/commit/c008c9b360de6d69ff1630ae66a09b390083bf2c))
* uninstall obsolete storybook addons, fix more linting issues ([b76a5b9](https://github.com/ch-sagw/sagw/commit/b76a5b9290f5f0e74eccf742fd83990e108a91e3))
* upadte after build ([340de5c](https://github.com/ch-sagw/sagw/commit/340de5c965105396cd2b209b8f73db1c6102c5b0))
* update documentation ([3162598](https://github.com/ch-sagw/sagw/commit/316259875be19fa8e2eff56408f820fc1f58a974))
* update screenshots after using node-bookworm image ([f8c7ac4](https://github.com/ch-sagw/sagw/commit/f8c7ac47f540da63793a164522a3bcfd6b480f0a))
* update todos ([d95f8a0](https://github.com/ch-sagw/sagw/commit/d95f8a0759d48820efff4af99a1c8fa9f4b577c6))
* upgrade storybook ([1b34ff1](https://github.com/ch-sagw/sagw/commit/1b34ff1930f5a24de41dce2879d1f4e3d0d1186b))
* use global ignores, use meta dirname ([6af70e7](https://github.com/ch-sagw/sagw/commit/6af70e7b609a92650854fd8de8fdabe202f2b24f))
* use node docker image instead of playwright image and install playwright ([6680d58](https://github.com/ch-sagw/sagw/commit/6680d58a2576acad59f4650465b06a84184c222a))
* use scss, add functions, utilities, vars etc ([094e3ab](https://github.com/ch-sagw/sagw/commit/094e3ab98eda6507c364d9627a5ee553aee96ee7))
* write button wit capital start letter ([f2b07b1](https://github.com/ch-sagw/sagw/commit/f2b07b1584c1fcb5c9b72506846d93f2d0928ba6))


### Features

* initial commit ([26b99c5](https://github.com/ch-sagw/sagw/commit/26b99c5c5b2a34d7b4a2842ebdb3b77a92a0ccd7))


### Test

* add playwright for component tests ([683f28e](https://github.com/ch-sagw/sagw/commit/683f28eacef1ec3d51bc4525b1d69469f002ef15))
