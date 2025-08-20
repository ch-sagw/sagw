import storybook from 'eslint-plugin-storybook';
import { FlatCompat } from '@eslint/eslintrc';
import tsRules from './lint/ts-rules.mjs';
import esRules from './lint/es-rules.mjs';
import { globalIgnores } from 'eslint/config';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

// TODO: .storybook/* seems not to be linted.

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  globalIgnores([
    'convenience/*',
    'node_modules/*',
    'src/app/(payload)/**/*',
    '!src/app/(payload)/**/*/',
    '!src/app/(payload)/api/cron-blob-backup/*',
  ]),
  {
    files: [
      '**/*.mjs',
      '**/*.js',
      '**/*.jsx',
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
