/* eslint-disable @next/next/no-img-element */
'use client';

import { useImageLoader } from '@/hooks/useImageLoader';
import { cva } from 'cva';
import styles from '@/components/base/Image/Image.module.scss';
import {
  getSizes,
  getSrcAndSrcSet,
} from '@/components/base/Image/Image.configs';
import { ImageVariant } from '@/components/base/types/imageVariant';
import { createImageSrcUrl } from '@/components/helpers/createImageSrcUrl';

export type InterfaceImagePropTypes = {
  alt: string;
  classes?: string;
  filename: string,
  focalX?: number,
  focalY?: number,
  height: number;
  loading: 'lazy' | 'eager';
  optimize?: boolean;
  params?: string,
  performanceMark?: string;
  priority?: boolean;
  url: string;
  variant: ImageVariant;
  width: number;
};

export const Image = ({
  alt,
  filename,
  focalX,
  focalY,
  height,
  loading,
  optimize,
  performanceMark,
  url,
  variant,
  width,
}: InterfaceImagePropTypes): React.JSX.Element => {

  const focalPointX = (focalX ?? 50) / 100;
  const focalPointY = (focalY ?? 50) / 100;

  const src = createImageSrcUrl({
    filename,
    url,
  });

  const params = `fm=auto&mode=crop&crop=focalpoint&fp-x=${focalPointX}&fp-y=${focalPointY}`;

  const srcAndSrcSet = getSrcAndSrcSet({
    params,
    src,
    variant,
  });

  const sizes = getSizes(variant);

  // Add loaded class on image load for fade-in effect
  // and performance mark, if defined
  const {
    fadeIn,
    imgRef,
    imgSrc,
    loaded,
  } = useImageLoader(
    srcAndSrcSet.src,
    {
      performanceMark,
      placeholderSrc: '',
    },
  );

  const fetchPriority = loading === 'eager'
    ? 'high'
    : 'low';

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

  const combinedClasses = [
    classes({
      variant,
    }),
    fadeIn
      ? styles.fadeIn
      : '',
    loaded
      ? styles.loaded
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Prepare Image properties. If optimize is
  // set to false. We just render the image
  // without additional renditions
  let imageProperties = {};

  if (optimize === false) {
    imageProperties = {
      src,
    };
  } else {
    imageProperties = {
      sizes,
      src: imgSrc || undefined,
      srcSet: srcAndSrcSet.srcSet || undefined,
    };
  }

  return (
    <>
      <img
        alt={alt}
        className={combinedClasses}
        fetchPriority={fetchPriority}
        height={height}
        loading={loading}
        ref={imgRef}
        {...imageProperties}
        width={width}
      />
      <noscript>
        <img
          alt={alt}
          className={classes({
            variant,
          })}
          fetchPriority={fetchPriority}
          height={height}
          loading={loading}
          {...imageProperties}
          width={width}
        />
      </noscript>
    </>
  );
};
