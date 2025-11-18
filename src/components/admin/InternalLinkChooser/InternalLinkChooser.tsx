'use server';

import { JSX } from 'react';
import type { UIFieldServerProps } from 'payload';
import InternalLinkChooserClient from './InternalLinkChooserClient';
import {
  type LinkableCollectionSlug, linkableSlugs,
} from '@/collections/Pages/pages';
import { fieldAccessNonLocalizableField } from '@/access/fields/localizedFields';

type FieldWithRequired = {
  required?: boolean;
};

const hasRequired = (field: unknown): field is FieldWithRequired => typeof field === 'object' && field !== null && 'required' in field;

const InternalLinkChooser = (props: UIFieldServerProps): JSX.Element => {
  const {
    collectionSlug,
    id,
    path,
    field,
    req,
  } = props;

  // Check access control
  const hasUpdateAccess = req && fieldAccessNonLocalizableField.update
    ? fieldAccessNonLocalizableField.update({
      req,
    })
    : true;

  const isReadOnly = !hasUpdateAccess;

  // Read optional list of allowed collection slugs attached on the field config
  const allowedCollectionSlugs = (field as any)?.linkableCollections as LinkableCollectionSlug[] | undefined;

  const resolvedSlugs = Array.isArray(allowedCollectionSlugs) && allowedCollectionSlugs.length > 0
    ? linkableSlugs.filter((p) => allowedCollectionSlugs.includes(p.slug))
    : linkableSlugs;

  // Get field label:
  // use explicit label if set, otherwise derive from field name
  const fieldLabel = (field as any)?.label as string | undefined;
  const fieldName = (field as any)?.name as string | undefined;

  // If no explicit label, Payload's FieldLabel will auto-generate from
  // field name but we can also derive it here for consistency
  let resolvedLabel: string | undefined = fieldLabel;

  if (!resolvedLabel && fieldName) {
    const firstChar = fieldName.charAt(0)
      .toUpperCase();
    const restOfName = fieldName.slice(1);
    const withSpaces = restOfName.replace(/(?<capGroup>[A-Z])/gu, ' $1');
    const trimmed = withSpaces.trim();

    resolvedLabel = firstChar + trimmed;
  }

  // Get field description from admin config
  const fieldDescription = (field as any)?.admin?.description as string | undefined;

  return (
    <InternalLinkChooserClient
      collectionSlug={collectionSlug}
      currentId={id}
      path={path}
      slugs={resolvedSlugs}
      required={hasRequired(field)
        ? field.required ?? false
        : false}
      label={resolvedLabel}
      description={fieldDescription}
      readOnly={isReadOnly}
    />
  );
};

export default InternalLinkChooser;
