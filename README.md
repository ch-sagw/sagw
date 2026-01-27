# Codebase for SAGW website

## Prerequisites

### Docker

Install [Docker](https://www.docker.com/get-started/).

### Node

Install [Node](https://nodejs.org/en) (version mentioned in `.nvmrc`).

Node is also used inside the dockerimage for the testing environment as well as on vercel. Check [node.md](/docs/node.md) for details.

### Environment Variables

Copy `.env.*.example` files in the `.env` folder and rename it to `.env.*`. e.g. copy `env.prod.example` to `env.prod`. Provide all the necessary values for the variables.

For details, see [env-vars.md](/docs/env-vars.md).

### Environments

The projects runs in two environments: Preview and Production.

For details, see [environments.md](/environments).

## Development

### Install dependencies

First install all dependencies with the following command:

```bash
npm install
```

### Storybook

To start storybook, run the following command:
```bash
npm run storybook
```

Storybook will the automatically open under the url http://localhost:6006/.

### Payload

#### With local DB

To start the payload backend, run the following command:
```bash
npm run dev
```

This will spin up a docker container which runs a MongoDB instance inside, build the Payload backend and frontend application and serve it on http://localhost:3000.

The connection string to the MongoDB inside the docker container is as follows:

`mongodb://user:pass@127.0.0.1:27017/`

#### With remote DB

To start the payload backend with a remote test db, run the following command:
```bash
npm run dev:test
```

This will run payload with the test-db hosted on OVH.

#### In Production mode

To start the payload backend in production mode with a remote prod db, run the following command:
```bash
npm run dev:prod
```

**!WARNING!**
This will start payload with all production environment variables. This means:
- **You're connected to the production DB**
- **You're connected to the production BLOB-Storage**

### Build

To build the project in dev mode (with remote test db), run the following command:
```bash
npm run build
```

To build the project for production (with remote prod db), run the following command:
```bash
npm run build:prod
```


### Test

This setup is automatically creating visual regression tests for all Storybook stories. Only stories which include the meta-tag `visual:check` will be included by this automatism. If you want to exclude a story from automatic visual regression tests (if the meta-tag `visual:check` is set), add the following tag description to that story:

```javascript
tags: ['!visual:check']
```

Tests run inside a docker container. You first need to build the docker container. This can be done with the following command:

```bash
npm run docker:test:build
```

Once the docker container is built, you can run tests with the following command:

```bash
npm run test
```

If you want to run tests in watch mode and observe the results inside the browser with the Playwright UI, you can run the following command:

```bash
npm run test:watch
```

Playwright UI will then be available under the url http://localhost:8080/.

### Lint

The project is linting scss, ts, tsx, js, jsx and mjx files. Linting is automatically enforced as pre-commit hook via lint-staged and husky.

You can run linting tasks manually.

For scss files, run:

```bash
npm run lint:scss
```

For ts, tsx, js, jsx and mjx files, run:

```bash
npm run lint:js
```

To run all linting tasks together, run:

```bash
npm run lint
```

### Component generator

For convenience, the setup includes a generator to create boilerplate files for new components. e.g. if you want to generate a new component with the name `MyComponent`, you would run:

```bash
npm run generate:component MyComponent
```

## Backup and Restore (Vercel Blob and DB)

For details, see [backup-restore.md](docs/backup-restore.md).

## Branching & Releasing

For details, see [branching-releasing.md](docs/branching-releasing.md).

## Vercel Deployments

For details, see [deployments.md](docs/deployments.md).

## Services

To get an overview of all services involved, see [services.md](docs/services.md).
