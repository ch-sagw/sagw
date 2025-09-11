import storybook from 'eslint-plugin-storybook';
import { FlatCompat } from '@eslint/eslintrc';
import tsRules from './lint/ts-rules.mjs';
import esRules from './lint/es-rules.mjs';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

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
      '!src/app/(payload)/**/*/',
      '!src/app/(payload)/cron-jobs/cron-blob-backup/*',
      'storybook-static',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
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
