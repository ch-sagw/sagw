# Environments

## Preliminary Remarks

The Blob Storages are connected to the Vercel Environments in this way:
- sagw-blob-test -> Development & Preview
- sagw-blob-prod -> Production

## Overview

|Environment|DB|Blob|Build command|Dev command|
|-|-|-|-|-|
|local dev|containerized local db|sagw-blob-test|-|`npm run dev`|
|preview|sagw-db-test|sagw-blob-test|`npm run build`|`npm run dev:test`|
|prod|sagw-db-prod|sagw-blob-prod|`npm run build:prod`|`npm run dev:prod`|
