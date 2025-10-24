/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/Image/Image.module.scss';
import { InterfaceImagePropTypes } from '@/components/base/Image/Image.custom';
import {
  getSizes,
  getSrcSet,
} from '@/components/base/Image/Image.configs';

/* const onLoad = (performanceMark: string): void => {
  performance.mark(performanceMark);
}; */

export const Image = ({
  alt,
  focalPointX,
  focalPointY,
  height,
  loading,
  src,
  variant,
  width,
}: InterfaceImagePropTypes): React.JSX.Element => {
  const classes = cva([styles.image], {
    variants: {
      variant: {
        content: [styles.content],
        contentFull: [styles.contentFull],
        genericTeaser: [styles.genericTeaser],
        hero: [styles.hero],
        logoTeaser: [styles.logoTeaser],
        portrait: [styles.portrait],
        portraitCta: [styles.portraitCta],
        publicationTeaser: [styles.publicationTeaser],
      },
    },
  });

  const params = `mode=crop&crop=focalpoint&fp-x=${focalPointX}&fp-y=${focalPointY}`;

  const srcSet = getSrcSet({
    params,
    src,
    variant,
  });
  const sizes = getSizes(variant);

  const fetchPriority = loading === 'eager'
    ? 'high'
    : 'low';

  return (
    <img
      alt={alt}
      className={classes({
        variant,
      })}
      fetchPriority={fetchPriority}
      height={height}
      loading={loading}
      sizes={sizes}
      src={src}
      srcSet={srcSet}
      width={width}
    />
  );
};
