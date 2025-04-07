# Codebase for SAGW website

## Prerequisites

### Docker

Install [Docker](https://www.docker.com/get-started/).

### Node

Install [Node](https://nodejs.org/en) (version mentioned in `.nvmrc`).

Node is also used inside the dockerimage for the testing environment as well as on vercel. Check [node.md](/docs/node.md) for details.

### Environment Variables

Copy `.env.example` and rename it to `.env`. Provide all the necessary values for the variables.

For details, see [env-vars.md](/docs/env-vars.md).

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

To start the payload backend, run the follwing command:
```bash
npm run dev
```

This will spin up a docker container which runs a MongoDB instance inside, build the Payload backend and frontend application and serve it on http://localhost:3000.

The connection string to the MongoDB inside the docker container is as follows:

`mongodb://user:pass@127.0.0.1:27017/`

### Test

This setup is automatically creating visual regression tests for all Storybook stories. Only stories which include the tag `visual:check` will be included by this automatism. If you want to exclude a story from automatic visual regression tests, add the follwing to that story:

```javascript
tags: ['!visual:check']
```

Tests run inside a docker container. You first need to build the docker container. This can be done with the following command:

```bash
npm run docker:test:build
```

Once the docker container is build, you can run tests with the following command:

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