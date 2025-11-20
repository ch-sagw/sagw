/* eslint-disable @next/next/no-img-element */
'use client';

import React, {
  useCallback,
  useEffect,
  useRef,
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
  focalPointX: number,
  focalPointY: number,
  height: number;
  loading: 'lazy' | 'eager';
  params?: string,
  performanceMark?: string;
  priority?: boolean;
  src: string;
  variant: ImageVariant;
  width: number;
};

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

  const markLoaded = useCallback((): void => {
    if (!imgRef.current) {
      return;
    }

    const img = imgRef.current;

    requestAnimationFrame(() => {
      if (!img) {
        return;
      }

      img.classList.add(styles.loaded);

      if (performanceMark) {
        performance.mark(performanceMark);
      }
    });
  }, [performanceMark]);

  const handleLoad = (): void => {
    markLoaded();
  };

  useEffect(() => {
    const img = imgRef.current;

    if (!img) {
      return;
    }

    if (img.complete && img.naturalWidth !== 0) {
      setTimeout(() => {
        markLoaded();
      }, 300);
    }
  }, [markLoaded]);

  const fetchPriority = loading === 'eager'
    ? 'high'
    : 'low';

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
