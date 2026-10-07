import type {
  Block, Field, Tab,
} from 'payload';
import {
  fieldAffectsData,
  fieldIsArrayType,
  fieldIsBlockType,
  fieldIsGroupType,
  fieldShouldBeLocalized,
  tabHasName,
} from 'payload/shared';

type RawDocument = Record<string, unknown>;

type BlocksField = Extract<Field, { type: 'blocks' }>;

interface InterfaceStripLocaleParams {
  // Raw (db-level) document data: localized fields are objects keyed by
  // locale code, e.g. `{ slug: { de: 'a', fr: 'b' } }`.
  data: RawDocument;
  fields: Field[];
  locale: string;

  // Blocks registered on the payload config (needed to resolve block
  // references given as slug strings).
  configBlocks?: Block[];
}

type WalkFields = (args: {
  context: InterfaceWalkContext;
  data: RawDocument;
  fields: (Field | Tab)[];
}) => void;

interface InterfaceWalkContext {
  configBlocks: Block[];
  locale: string;

  // The recursive walker is passed along so helpers can recurse without
  // referencing a binding declared later in the module.
  walkFields: WalkFields;
}

const isRecord = (value: unknown): value is RawDocument => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const isTab = (fieldOrTab: Field | Tab): fieldOrTab is Tab => !('type' in fieldOrTab);

const isLayoutOnly = (field: Field): field is Field & { fields: Field[] } => {
  if (field.type === 'row' || field.type === 'collapsible') {
    return true;
  }

  // unnamed group: data lives on the same level as its siblings
  return fieldIsGroupType(field) && !('name' in field && field.name);
};

const resolveBlock = ({
  blockType,
  configBlocks,
  field,
}: {
  blockType: unknown;
  configBlocks: Block[];
  field: BlocksField;
}): Block | undefined => {
  if (typeof blockType !== 'string') {
    return undefined;
  }

  const candidates = (field.blockReferences ?? field.blocks) as (Block | string)[];

  for (const candidate of candidates) {
    if (typeof candidate === 'string') {
      if (candidate === blockType) {
        return configBlocks.find((block) => block.slug === blockType);
      }
    } else if (candidate.slug === blockType) {
      return candidate;
    }
  }

  return undefined;
};

const walkArrayItems = ({
  context,
  fields,
  value,
}: {
  context: InterfaceWalkContext;
  fields: Field[];
  value: unknown;
}): void => {
  if (!Array.isArray(value)) {
    return;
  }

  value.forEach((item) => {
    if (isRecord(item)) {
      context.walkFields({
        context,
        data: item,
        fields,
      });
    }
  });
};

const walkBlockItems = ({
  context,
  field,
  value,
}: {
  context: InterfaceWalkContext;
  field: BlocksField;
  value: unknown;
}): void => {
  if (!Array.isArray(value)) {
    return;
  }

  value.forEach((item) => {
    if (!isRecord(item)) {
      return;
    }

    const block = resolveBlock({
      blockType: item.blockType,
      configBlocks: context.configBlocks,
      field,
    });

    if (block) {
      context.walkFields({
        context,
        data: item,
        fields: block.fields,
      });
    }
  });
};

const walkTab = ({
  context,
  data,
  tab,
}: {
  context: InterfaceWalkContext;
  data: RawDocument;
  tab: Tab;
}): void => {
  if (!tabHasName(tab)) {
    // unnamed tab: same data level
    context.walkFields({
      context,
      data,
      fields: tab.fields,
    });

    return;
  }

  const tabData = data[tab.name];

  if (!isRecord(tabData)) {
    return;
  }

  const isLocalized = fieldShouldBeLocalized({
    field: tab,
    parentIsLocalized: false,
  });

  if (isLocalized) {
    delete tabData[context.locale];

    return;
  }

  context.walkFields({
    context,
    data: tabData,
    fields: tab.fields,
  });
};

const walkDataField = ({
  context,
  data,
  field,
}: {
  context: InterfaceWalkContext;
  data: RawDocument;
  field: Field;
}): void => {
  if (!fieldAffectsData(field)) {
    return;
  }

  const value = data[field.name];
  const isLocalized = fieldShouldBeLocalized({
    field,
    parentIsLocalized: false,
  });

  // Localized field: value is keyed by locale. Children of a localized
  // field are never localized themselves, so stop here.
  if (isLocalized) {
    if (isRecord(value)) {
      delete value[context.locale];
    }

    return;
  }

  if (fieldIsGroupType(field)) {
    if (isRecord(value)) {
      context.walkFields({
        context,
        data: value,
        fields: field.fields,
      });
    }

    return;
  }

  if (fieldIsArrayType(field)) {
    walkArrayItems({
      context,
      fields: field.fields,
      value,
    });

    return;
  }

  if (fieldIsBlockType(field)) {
    walkBlockItems({
      context,
      field,
      value,
    });
  }
};

const walkFields: WalkFields = ({
  context,
  data,
  fields,
}): void => {
  fields.forEach((fieldOrTab) => {
    if (isTab(fieldOrTab)) {
      walkTab({
        context,
        data,
        tab: fieldOrTab,
      });

      return;
    }

    if (fieldOrTab.type === 'tabs') {
      walkFields({
        context,
        data,
        fields: fieldOrTab.tabs,
      });

      return;
    }

    if (isLayoutOnly(fieldOrTab)) {
      walkFields({
        context,
        data,
        fields: fieldOrTab.fields,
      });

      return;
    }

    walkDataField({
      context,
      data,
      field: fieldOrTab,
    });
  });
};

// Removes all values stored for `locale` from a raw document, following the
// collection's field configuration. Mutates and returns `data`.
export const stripLocale = ({
  configBlocks = [],
  data,
  fields,
  locale,
}: InterfaceStripLocaleParams): RawDocument => {
  walkFields({
    context: {
      configBlocks,
      locale,
      walkFields,
    },
    data,
    fields,
  });

  return data;
};
