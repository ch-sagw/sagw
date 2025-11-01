/* eslint-disable @next/next/no-img-element */
import React, { useRef } from 'react';
import { cva } from 'cva';
import styles from '@/components/base/Image/Image.module.scss';
import { InterfaceImagePropTypes } from '@/components/base/Image/Image.custom';
import {
  getSizes,
  getSrcAndSrcSet,
} from '@/components/base/Image/Image.configs';

export const Image = ({
  alt,
  focalPointX,
  focalPointY,
  height,
  loading,
  performanceMark,
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

  const imgRef = useRef<HTMLImageElement>(null);

  const params = `mode=crop&crop=focalpoint&fp-x=${focalPointX}&fp-y=${focalPointY}`;

  const srcAndSrcSet = getSrcAndSrcSet({
    params,
    src,
    variant,
  });
  const sizes = getSizes(variant);

  const handleOnLoad = (): void => {
    const img = imgRef.current;

    if (img) {
      requestAnimationFrame(() => {
        img.classList.add(styles.loaded);
      });
    }

    if (performanceMark) {
      performance.mark(performanceMark);
    }
  };

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
      onLoad={handleOnLoad}
      ref={imgRef}
      sizes={sizes}
      src={srcAndSrcSet.src}
      srcSet={srcAndSrcSet.srcSet}
      width={width}
    />
  );
};
