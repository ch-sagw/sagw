'use server';

import { JSX } from 'react';
import type { UIFieldServerProps } from 'payload';
import InternalLinkChooserClient from './InternalLinkChooserClient';
import { linkableSlugs } from '@/collections/Pages/pages';

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
  } = props;

  // Read optional list of allowed collection slugs attached on the field config
  const allowedCollectionSlugs = (field as any)?.linkableCollections as string[] | undefined;

  const resolvedSlugs = Array.isArray(allowedCollectionSlugs) && allowedCollectionSlugs.length > 0
    ? linkableSlugs.filter((p) => allowedCollectionSlugs.includes(p.slug))
    : linkableSlugs;

  return (
    <InternalLinkChooserClient
      collectionSlug={collectionSlug}
      currentId={id}
      path={path}
      slugs={resolvedSlugs}
      required={hasRequired(field)
        ? field.required ?? false
        : false}
    />
  );
};

export default InternalLinkChooser;
