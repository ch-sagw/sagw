# Node version management

## Situation

The project runs node in different environments:
- locally when starting the dev server (payload, storybook)
- in the dockerfile for the test-environment, which uses the official playwright docker image
- on vercel

## Problem

We can control the local version of node, which happens via `.nvmrc` file. However:
- The dockerfile for the test-environment uses it's own specific node version.
- Vercel only supports defining major node versions (e.g. 22.x). Minor and patch versions are managed by Vercel and can not be defined.

## Mitigations

- When updating playwright, there will also be a new official Docker image corresponding to the new playwright version. In case of updating, check https://github.com/microsoft/playwright/blob/main/utils/docker/Dockerfile.noble to see which node version is used and check, if it still matches the local node version as well as the vercel node version.
- We define the node version in the package.json as well (e.g. engines -> node -> 22.x), which will be respected by vercel.

## Risks

We still run the risks that node accidently publishes a patch or minor version which includes breaking changes (like it happened in the past).