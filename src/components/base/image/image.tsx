/* eslint-disable */

import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/image/image.module.scss';
import { InterfaceImagePropTypes } from '@/components/base/Image/Image.custom';
import { portraitMarkup } from '@/components/base/Image/Image.configs';

const classes = cva([styles.baseStyle], {
  variants: {
    usage: {
      content: styles.content,
      contentFull: styles.contentFull,
      genericTeaser: styles.genericTeaser,
      hero: styles.hero,
      portrait: styles.portrait,
      portraitCta: styles.portraitCTA,
      publicationTeaser: styles.publicationTeaser,
    },
  },
});

const onLoad = (performanceMark: string): void => {
  performance.mark(performanceMark);
};

export const image = ({
  alt,
  className,
  fetchPriority,
  focalPointX,
  focalPointY,
  height,
  performanceMark,
  sizes,
  src,
  width,
}: InterfaceImagePropTypes): React.JSX.Element => (

  portraitMarkup({
    alt: 'Test',
    height: 600,
    hostName: 'sagw-nu.gumlet.io',
    loading: 'eager',
    params: 'mode=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5',
    src,
    variant: 'portrait',
    width: 600,
  })
);
