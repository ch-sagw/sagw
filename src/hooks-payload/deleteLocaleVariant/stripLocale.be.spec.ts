import {
  expect,
  test,
} from '@playwright/test';
import type {
  Block, BlockSlug, Field,
} from 'payload';
import { stripLocale } from '@/hooks-payload/deleteLocaleVariant/stripLocale';

// Pure unit tests: `stripLocale` works on raw (db-level) data and a field
// config; no Payload instance is needed.

const teaserBlock: Block = {
  fields: [
    {
      localized: true,
      name: 'title',
      type: 'text',
    },
    {
      name: 'count',
      type: 'number',
    },
  ],
  slug: 'teaserBlock',
};

const referencedBlock: Block = {
  fields: [
    {
      localized: true,
      name: 'caption',
      type: 'text',
    },
  ],
  slug: 'referencedBlock',
};

const fields: Field[] = [
  {
    localized: true,
    name: 'slug',
    type: 'text',
  },
  {
    name: 'tenant',
    type: 'text',
  },
  {
    fields: [
      {
        localized: true,
        name: 'generateSlug',
        type: 'checkbox',
      },
    ],
    type: 'row',
  },
  {
    tabs: [
      {
        fields: [
          {
            fields: [
              {
                localized: true,
                name: 'title',
                type: 'richText',
              },
              {
                name: 'colorMode',
                type: 'text',
              },
            ],
            name: 'hero',
            type: 'group',
          },
          {
            blocks: [teaserBlock],
            name: 'content',
            type: 'blocks',
          },
          {
            // test-only slug, not part of the generated BlockSlug union
            blockReferences: ['referencedBlock' as BlockSlug],
            blocks: [],
            name: 'referenced',
            type: 'blocks',
          },
          {
            fields: [
              {
                localized: true,
                name: 'label',
                type: 'text',
              },
            ],
            name: 'items',
            type: 'array',
          },
          {
            fields: [
              {
                name: 'label',
                type: 'text',
              },
            ],
            localized: true,
            name: 'localizedItems',
            type: 'array',
          },
        ],
        label: 'Content',
      },
      {
        fields: [
          {
            fields: [
              {
                localized: true,
                name: 'description',
                type: 'text',
              },
            ],
            name: 'seo',
            type: 'group',
          },
        ],
        name: 'meta',
      },
    ],
    type: 'tabs',
  },
];

const buildData = (): Record<string, unknown> => ({
  content: [
    {
      blockType: 'teaserBlock',
      count: 3,
      title: {
        de: 'teaser de',
        fr: 'teaser fr',
      },
    },
  ],
  hero: {
    colorMode: 'dark',
    title: {
      de: {
        root: 'de',
      },
      fr: {
        root: 'fr',
      },
      it: {
        root: 'it',
      },
    },
  },
  items: [
    {
      label: {
        de: 'item de',
        fr: 'item fr',
      },
    },
  ],
  localizedItems: {
    de: [
      {
        label: 'li de',
      },
    ],
    fr: [
      {
        label: 'li fr',
      },
    ],
  },
  meta: {
    seo: {
      description: {
        de: 'desc de',
        fr: 'desc fr',
      },
    },
  },
  referenced: [
    {
      blockType: 'referencedBlock',
      caption: {
        de: 'cap de',
        fr: 'cap fr',
      },
    },
  ],
  slug: {
    de: 'slug-de',
    en: 'slug-en',
    fr: 'slug-fr',
  },
  tenant: 'tenant-1',
});

test.describe('deleteLocaleVariant: stripLocale', () => {
  test('removes the locale from top-level and row-nested localized fields', () => {
    const data = buildData();

    stripLocale({
      data,
      fields,
      locale: 'fr',
    });

    expect(data.slug)
      .toEqual({
        de: 'slug-de',
        en: 'slug-en',
      });
    expect(data.tenant)
      .toBe('tenant-1');
  });

  test('removes the locale from a localized field inside a group inside a tab', () => {
    const data = buildData();

    stripLocale({
      data,
      fields,
      locale: 'fr',
    });

    const hero = data.hero as Record<string, unknown>;

    expect(hero.title)
      .toEqual({
        de: {
          root: 'de',
        },
        it: {
          root: 'it',
        },
      });
    expect(hero.colorMode)
      .toBe('dark');
  });

  test('removes the locale from a localized field inside a named tab group', () => {
    const data = buildData();

    stripLocale({
      data,
      fields,
      locale: 'fr',
    });

    const meta = data.meta as { seo: { description: Record<string, string> } };

    expect(meta.seo.description)
      .toEqual({
        de: 'desc de',
      });
  });

  test('removes the locale from localized fields inside non-localized blocks and arrays', () => {
    const data = buildData();

    stripLocale({
      data,
      fields,
      locale: 'fr',
    });

    const [teaser] = data.content as Record<string, unknown>[];
    const [item] = data.items as Record<string, unknown>[];

    expect(teaser.title)
      .toEqual({
        de: 'teaser de',
      });
    expect(teaser.count)
      .toBe(3);
    expect(item.label)
      .toEqual({
        de: 'item de',
      });
  });

  test('resolves block references via config blocks', () => {
    const data = buildData();

    stripLocale({
      configBlocks: [referencedBlock],
      data,
      fields,
      locale: 'fr',
    });

    const [referenced] = data.referenced as Record<string, unknown>[];

    expect(referenced.caption)
      .toEqual({
        de: 'cap de',
      });
  });

  test('removes the whole locale entry of a localized array and leaves other locales untouched', () => {
    const data = buildData();

    stripLocale({
      data,
      fields,
      locale: 'fr',
    });

    expect(data.localizedItems)
      .toEqual({
        de: [
          {
            label: 'li de',
          },
        ],
      });
  });

  test('is a no-op for a locale that has no content', () => {
    const data = buildData();
    const before = JSON.stringify(data);

    stripLocale({
      data,
      fields,
      locale: 'rm',
    });

    expect(JSON.stringify(data))
      .toBe(before);
  });
});
