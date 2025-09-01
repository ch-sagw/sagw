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
      'convenience/*',
      '!src/app/(payload)/**/*/',
      '!src/app/(payload)/api/cron-blob-backup/*',
      'storybook-static',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
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
