'use client';

import {
  Button,
  PreviewButton,
} from '@payloadcms/ui';

import './styles.scss';

import type { PreviewButtonClientProps } from 'payload';
import React from 'react';

const PreviewButtonWithExtra = (props: PreviewButtonClientProps): React.ReactElement => (
  <div className='preview-btn-with-extra'>
    <PreviewButton {...props} />
    <Button
      aria-label='Placeholder — hook up behavior later'
      buttonStyle='secondary'
      id='page-edit-secondary-placeholder'
      size='small'
      tooltip='Placeholder — hook up behavior later'
      type='button'
    >
      …
    </Button>
  </div>
);

export default PreviewButtonWithExtra;
