import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import tsRules from './lint/ts-rules.mjs';
import esRules from './lint/es-rules.mjs';

const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ['**/app/(payload)/**'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'plugin:storybook/recommended'),
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
];

export default eslintConfig;
