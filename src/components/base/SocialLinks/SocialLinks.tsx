import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/SocialLinks/SocialLinks.module.scss';
import { InterfaceSocialLinks } from '@/payload-types';

export type InterfaceSocialLinksPropTypes = {
  sampleProperty: string;
  context: 'sampleContext'
} & InterfaceSocialLinks;

const sampleClasses = cva([styles.baseStyle], {
  variants: {
    context: {
      sampleContext: [styles.sampleContextStyle],
    },
  },
});

export const SocialLinks = ({
  context,
  sampleProperty,
}: InterfaceSocialLinksPropTypes): React.JSX.Element => (
  <div
    className={sampleClasses({
      context: context ?? undefined,
    })}
  >{sampleProperty}</div>
);
