import path from 'path';

const buildEslintCommand = (filenames) =>
  `next lint --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

const config = {
  '*.{js,jsx,ts,tsx, mjs}': [buildEslintCommand],
};

export default config;