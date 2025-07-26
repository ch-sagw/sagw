# Branching & Releasing

## Workflow

### Create features, fixes etc.
As a developer, you do the following:
- You **create a branch** off from main branch
- You **commit** changes to your branch
- You create a **pull-request** on your branch
- You **merge** your pull-request

**Important**: 
- If there is an Github issue related to your pull-request, make sure to link it in the pull-request comment: `closes #42`. This way, the `release-labels` workflow will automatically label the Github issues with the corresponding release version.
- When merging your pull-request, you should use "**Squash & Merge**".
- In the commit message of the pull-request, make sure that your commits have the correct format. When squashing, Github automatically adds your commits in the following format:
  ```
    * fix: some fix

    * docs: some docs update
  ```

  Make sure to reformat it so that release-please can parse your changes correctly:
  ```
    fix: some fix
    docs: some docs update
  ```

### Release Branch

After merging a pull-request, release-please does the following:
- Opens a release branch if there is not yet an open release branch
- Keeps track of the changes in the `CHANGELOG.md`
- Keeps track of the next release version in the `release-please-manifest.json`

### Releasing

As soon as you want to create a release, simply merge the release branch into main. Release-please will do the following:
- Create a tag with the release version on the main branch
- Create a github release

The `release-labels` workflow will do the following:
- Label all pull-requests which are included in the release with the version label
- Label all Github issues which were referenced in included pull-requests with the version label

![Diagram of Branching and Releasing](branching-releasing.jpg "Branching & Releasing")