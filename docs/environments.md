# Environments

## Preliminary Remarks

The Blob Storages are connected to the Vercel Environments in this way:
- sagw-blob-prod -> Production
- sagw-blob-test -> Development & Preview
- sagw-blob-local -> Preview. Never deployed on Vercel, only for local dev usage
- sagw-blob-playwright -> Preview. Never deployed on Vercel, only for playwright tests

## Vercel environments

Prod:
Production Environemnt. Deployed after release on github.

Test:
Test/Staging Environment. Deployed on every change on master.

Preview:
Preview Environment. Deployed on Pull Requests.

## Overview

|Environment|DB|Blob|Build command|Dev command|
|-|-|-|-|-|
|local dev|containerized local db|sagw-blob-local|-|`npm run dev`|
|test|sagw-db-test|sagw-blob-test|`npm run build`|`npm run dev:test`|
|preview|sagw-db-test|sagw-blob-test|`npm run build`|`npm run dev:test`|
|prod|sagw-db-prod|sagw-blob-prod|`npm run build:prod`|`npm run dev:prod`|
