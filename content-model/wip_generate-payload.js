/* eslint-disable */
/* @ts-ignore */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, 'cms');
const OUTPUT_DIR = path.join(__dirname, 'generated-payload');
const BLOCKS_DIR = path.join(OUTPUT_DIR, 'blocks');
const COLLECTIONS_DIR = path.join(OUTPUT_DIR, 'collections');

[
  BLOCKS_DIR,
  COLLECTIONS_DIR,
].forEach((dir) => fs.mkdirSync(dir, {
  recursive: true,
}));

function mapTsTypeToPayload(tsType) {
  if (tsType.includes('string') || tsType.includes('I18nString')) {
    return {
      type: 'text',
    };
  }
  if (tsType.includes('Date')) {
    return {
      type: 'date',
    };
  }
  if (tsType.includes('Image') || tsType.includes('Logo')) {
    return {
      type: 'upload',
      relationTo: 'media',
    };
  }
  if (tsType.includes('Link')) {
    return {
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'href',
          type: 'text',
        },
      ],
    };
  }
  if (tsType.includes('number')) {
    return {
      type: 'number',
    };
  }

  return {
    type: 'text',
  };
}

function extractInterfacesFromFile(content) {
  const matches = [...content.matchAll(/export interface (\w+)\s*{([\s\S]*?)}/g)];

  return matches.map(([
    _,
    name,
    body,
  ]) => {
    const fields = [...body.matchAll(/(\w+)\??:\s*([^;]+);/g)].map(([
      __,
      field,
      type,
    ]) => ({
      name: field,
      type: type.trim(),
    }));

    return {
      name,
      fields,
    };
  });
}

function generatePayloadFields(fields) {
  return fields.map((f) => {
    const base = mapTsTypeToPayload(f.type);

    return {
      name: f.name,
      ...base,
    };
  });
}

function writePayloadModule(filePath, slug, fields, isCollection = false) {
  const fieldCode = fields.map((f) => JSON.stringify(f, null, 2))
    .join(',\n    ');
  const template = `
const ${slug} = {
  slug: '${slug}',
  fields: [
    ${fieldCode}
  ]
};

export default ${slug};
`.trim();

  fs.writeFileSync(filePath, template);
}

function walk(dir, callback) {
  fs.readdirSync(dir)
    .forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath, callback);
      } else if (file.endsWith('.ts')) {
        callback(fullPath);
      }
    });
}

const allModules = [];

walk(SOURCE_DIR, (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const interfaces = extractInterfacesFromFile(content);

  interfaces.forEach(({
    name, fields,
  }) => {
    const relPath = filePath.replace(/\\/g, '/');
    const payloadFields = generatePayloadFields(fields);

    const slug = name.charAt(0)
      .toLowerCase() + name.slice(1);
    const outputPath = relPath.includes('/4_pages/')
      ? path.join(COLLECTIONS_DIR, `${name}.ts`)
      : path.join(BLOCKS_DIR, `${name}.ts`);

    writePayloadModule(outputPath, name, payloadFields);
    allModules.push({
      name,
      type: relPath.includes('/4_pages/')
        ? 'collection'
        : 'block',
    });
  });
});

const configLines = [
  'import { buildConfig } from \'payload/config\';',
  ...allModules.map((m) => `import ${m.name} from './${m.type === 'collection'
    ? 'collections'
    : 'blocks'}/${m.name}.js';`),
  '',
  'export default buildConfig({',
  `  collections: [${allModules.filter((m) => m.type === 'collection')
    .map((m) => m.name)
    .join(', ')}],`,
  '  globals: [],',
  '  admin: { user: null },',
  '  media: { upload: true, staticDir: \'media\' },',
  '  serverURL: \'http://localhost:3000\',',
  '});',
];

fs.writeFileSync(path.join(OUTPUT_DIR, 'payload.config.ts'), configLines.join('\n'));
console.log('✅ Payload config generated in ./generated-payload');
