'use server';

import { JSX } from 'react';
import type { UIFieldServerProps } from 'payload';
import InternalLinkChooserClient from './InternalLinkChooserClient';
import { tenantsCollections } from '@/collections';

type FieldWithRequired = {
  required?: boolean;
};

const hasRequired = (field: unknown): field is FieldWithRequired => typeof field === 'object' && field !== null && 'required' in field;

const InternalLinkChooser = (props: UIFieldServerProps): JSX.Element => {
  const {
    collectionSlug,
    data,
    id,
    path,
    field,
  } = props;

  return (
    <InternalLinkChooserClient
      collectionSlug={collectionSlug}
      data={data}
      currentId={id}
      path={path}
      tenantsCollections={tenantsCollections}
      required={hasRequired(field)
        ? field.required ?? false
        : false}
    />
  );
};

export default InternalLinkChooser;
