/* eslint-disable @next/next/no-img-element */
'use client';

import React, {
  useRef,
  useState,
} from 'react';
import { cva } from 'cva';
import styles from '@/components/base/Image/Image.module.scss';
import {
  getSizes,
  getSrcAndSrcSet,
} from '@/components/base/Image/Image.configs';
import { ImageVariant } from '@/components/base/types/imageVariant';

export type InterfaceImagePropTypes = {
  alt: string;
  classes?: string;
  filename: string,
  focalX?: number,
  focalY?: number,
  height: number;
  loading: 'lazy' | 'eager';
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
  performanceMark,
  url,
  variant,
  width,
}: InterfaceImagePropTypes): React.JSX.Element => {
  const [
    loaded,
    setLoaded,
  ] = useState(false);

  const focalPointX = (focalX ?? 50) / 100;
  const focalPointY = (focalY ?? 50) / 100;

  const host = process.env.NEXT_PUBLIC_GUMLET_URL ?? '';

  let src = host + url;

  if (process.env.NEXT_PUBLIC_GUMLET_URL?.indexOf('localhost') !== -1) {
    src = `${host}/${filename}`;
  }

  const params = `fm=auto&mode=crop&crop=focalpoint&fp-x=${focalPointX}&fp-y=${focalPointY}`;

  const srcAndSrcSet = getSrcAndSrcSet({
    params,
    src,
    variant,
  });

  const sizes = getSizes(variant);

  // Add loaded class on image load for fade-in effect
  // and performance mark, if defined
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleLoad = (): void => {
    if (!imgRef.current) {
      return;
    }

    const img = imgRef.current;

    if (!img) {
      return;
    }

    if (img.complete && img.naturalWidth !== 0) {
      setLoaded(true);

      if (performanceMark) {
        performance.mark(performanceMark);
      }
    }
  };

  const fetchPriority = loading === 'eager'
    ? 'high'
    : 'low';

  const classes = cva([
    styles.image,
    loaded
      ? styles.loaded
      : undefined,
  ], {
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

  return (
    <>
      <img
        alt={alt}
        className={classes({
          variant,
        })}
        fetchPriority={fetchPriority}
        height={height}
        loading={loading}
        ref={imgRef}
        sizes={sizes}
        src={srcAndSrcSet.src}
        srcSet={srcAndSrcSet.srcSet}
        width={width}
        onLoad={handleLoad}
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
          sizes={sizes}
          src={srcAndSrcSet.src}
          srcSet={srcAndSrcSet.srcSet}
          width={width}
        />
      </noscript>
    </>
  );
};
