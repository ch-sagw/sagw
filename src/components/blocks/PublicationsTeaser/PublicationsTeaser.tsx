import React from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/PublicationsTeaser/PublicationsTeaser.module.scss';
import { InterfacePublicationsTeaser } from '@/payload-types';

export type InterfacePublicationsTeaserPropTypes = {
  sampleProperty: string;
  context: 'sampleContext'
} & InterfacePublicationsTeaser;

const sampleClasses = cva([styles.baseStyle], {
  variants: {
    context: {
      sampleContext: [styles.sampleContextStyle],
    },
  },
});

export const PublicationsTeaser = ({
  context,
  sampleProperty,
}: InterfacePublicationsTeaserPropTypes): React.JSX.Element => (
  <div
    className={sampleClasses({
      context: context ?? undefined,
    })}
  >{sampleProperty}</div>
);
