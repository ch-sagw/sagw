# Deployments

Deployments to Vercel happen both automatically by Vercel and custom via CLI, depending on the type of deployment.

## Creating a pull-request

**Automatic Vercel deployment**

As soon as you create a pull request, an automatic deployment will happen on Vercel. The corresponding preview URL will be posted as a comment on the pull-request.

The `deploy-branch` workflow is running the tests.

## Merging a branch into main

**Custom Vercel deployment via CLI**

If you merge a pull-request into main, a custom deployment will happen via Github workflows.

`deploy-preview`: builds the project and deploys it the the Preview environment on Vercel.

`deploy-prod`: is running tests. Only if tests succeed, it will build the project and deploy it to the Production environment on Vercel.

`deploy-storybook`: is deploying storybook to separate vercel project.