import storybook from 'eslint-plugin-storybook';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import tsRules from './lint/ts-rules.mjs';
import esRules from './lint/es-rules.mjs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'src/app/(payload)/**/*',
      'convenience/generate-component/boilerplate/**/*',
      'playwright-report/**/*',
      'test-results/**/*',
      '!src/app/(payload)/**/*/',
      '!src/app/(payload)/cron-jobs/cron-blob-backup/*',
      'storybook-static',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    files: [
      '**/*.mjs',
      '**/*.js',
      '**/*.jsx',
    ],
    rules: {
      ...esRules,
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
    ],
    rules: {
      ...esRules,
      ...tsRules,
    },
  },
  ...storybook.configs['flat/recommended'],
  {
    ignores: ['!.storybook'],
  },
];

export default eslintConfig;
