import type {
  Block, BlocksField, Field, Payload,
} from 'payload';
import { tabHasName } from 'payload/shared';
import { isAssetCollectionSlug } from '@/jobs/assetsCleanup/config';
import { isRecord } from '@/jobs/assetsCleanup/collectGeneric';

// ########################################################################
// Schema-aware reference collector
//
// Walks a raw document alongside its field configuration and collects the
// ids of every upload / relationship field which targets one of the asset
// collections. This collector is the "second opinion": every id it finds
// must also be found by the generic collector. If not, something is wrong
// and the job refuses to delete anything.
// ########################################################################

interface InterfaceCollectSchemaArgs {
  data: unknown;
  fields: Field[];
  ids: Set<string>;
  localeCodes: string[];
  payload: Payload;
}

interface InterfaceContext {
  ids: Set<string>;
  localeCodes: string[];
  payload: Payload;
}

// Localized fields are stored as { de: ..., fr: ... } objects in the raw
// document. We do not rely on the `localized` flag of the field, since
// nested fields inside a localized parent are stored differently. Instead
// we detect the locale map by its keys.
const isLocaleMap = (value: unknown, localeCodes: string[]): value is Record<string, unknown> => {
  if (!isRecord(value)) {
    return false;
  }

  const keys = Object.keys(value);

  if (keys.length < 1) {
    return false;
  }

  return keys.every((key) => localeCodes.includes(key));
};

const forEachLocalizedValue = (value: unknown, localeCodes: string[], callback: (localizedValue: unknown) => void): void => {
  if (isLocaleMap(value, localeCodes)) {
    Object.values(value)
      .forEach((localizedValue) => {
        callback(localizedValue);
      });

    return;
  }

  callback(value);
};

const addId = (value: unknown, collection: unknown, ctx: InterfaceContext): void => {
  if (typeof collection !== 'string' || !isAssetCollectionSlug(collection)) {
    return;
  }

  if (typeof value === 'string' && value.length > 0) {
    ctx.ids.add(value.toLowerCase());
  } else if (isRecord(value) && typeof value.id === 'string') {
    ctx.ids.add(value.id.toLowerCase());
  }
};

const collectRelationValue = (value: unknown, relationTo: string | string[], ctx: InterfaceContext): void => {
  if (value === null || value === undefined) {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => {
      collectRelationValue(item, relationTo, ctx);
    });

    return;
  }

  if (isRecord(value) && 'relationTo' in value && 'value' in value) {
    addId(value.value, value.relationTo, ctx);

    return;
  }

  if (typeof relationTo === 'string') {
    addId(value, relationTo, ctx);
  }
};

const targetsAssets = (relationTo: string | string[]): boolean => {
  const targets = Array.isArray(relationTo)
    ? relationTo
    : [relationTo];

  return targets.some((target) => isAssetCollectionSlug(target));
};

const resolveBlock = (blockOrSlug: Block | string, ctx: InterfaceContext): Block | undefined => {
  if (typeof blockOrSlug !== 'string') {
    return blockOrSlug;
  }

  return ctx.payload.config.blocks?.find((block) => block.slug === blockOrSlug);
};

type CollectFromFields = (fields: Field[], data: unknown, ctx: InterfaceContext) => void;

const collectFromBlockRows = (field: BlocksField, rows: unknown, ctx: InterfaceContext, collect: CollectFromFields): void => {
  if (!Array.isArray(rows)) {
    return;
  }

  const blockDefinitions = [
    ...(field.blocks || []),
    ...(field.blockReferences || []),
  ]
    .map((definition) => resolveBlock(definition, ctx))
    .filter((definition): definition is Block => Boolean(definition));

  rows.forEach((row) => {
    if (!isRecord(row)) {
      return;
    }

    const block = blockDefinitions.find((definition) => definition.slug === row.blockType);

    if (block) {
      collect(block.fields, row, ctx);
    }
  });
};

const collectFromFields: CollectFromFields = (fields, data, ctx) => {
  if (!isRecord(data)) {
    return;
  }

  fields.forEach((field) => {
    switch (field.type) {
      case 'tabs':
        field.tabs.forEach((tab) => {
          if (tabHasName(tab)) {
            forEachLocalizedValue(data[tab.name], ctx.localeCodes, (tabData) => {
              collectFromFields(tab.fields, tabData, ctx);
            });
          } else {
            collectFromFields(tab.fields, data, ctx);
          }
        });
        break;

      case 'row':
      case 'collapsible':
        collectFromFields(field.fields, data, ctx);
        break;

      case 'group':
        if ('name' in field && typeof field.name === 'string') {
          forEachLocalizedValue(data[field.name], ctx.localeCodes, (groupData) => {
            collectFromFields(field.fields, groupData, ctx);
          });
        } else {
          collectFromFields(field.fields, data, ctx);
        }
        break;

      case 'array':
        forEachLocalizedValue(data[field.name], ctx.localeCodes, (rows) => {
          if (Array.isArray(rows)) {
            rows.forEach((row) => {
              collectFromFields(field.fields, row, ctx);
            });
          }
        });
        break;

      case 'blocks':
        forEachLocalizedValue(data[field.name], ctx.localeCodes, (rows) => {
          collectFromBlockRows(field, rows, ctx, collectFromFields);
        });
        break;

      case 'upload':
      case 'relationship':
        if (targetsAssets(field.relationTo)) {
          forEachLocalizedValue(data[field.name], ctx.localeCodes, (value) => {
            collectRelationValue(value, field.relationTo, ctx);
          });
        }
        break;

      default:
        break;
    }
  });
};

export const collectSchemaReferences = ({
  data,
  fields,
  ids,
  localeCodes,
  payload,
}: InterfaceCollectSchemaArgs): void => {
  collectFromFields(fields, data, {
    ids,
    localeCodes,
    payload,
  });
};
