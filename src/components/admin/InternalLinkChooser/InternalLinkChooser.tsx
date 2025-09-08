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

  return (
    <InternalLinkChooserClient
      collectionSlug={collectionSlug}
      currentId={id}
      path={path}
      slugs={linkableSlugs}
      required={hasRequired(field)
        ? field.required ?? false
        : false}
    />
  );
};

export default InternalLinkChooser;
