import path from 'path';

const buildEslintCommand = (filenames) => `eslint ${filenames
  .map((f) => path.relative(process.cwd(), f))
  .join(' ')}`;

const config = {
  '*.scss': 'stylelint',
  '*.{js,jsx,ts,tsx, mjs}': [buildEslintCommand],
};

export default config;
