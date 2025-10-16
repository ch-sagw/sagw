import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/image/image.module.scss';
import Image from 'next/image';
import { ImageVariant } from '@/components/base/types/imageVariant';

export type InterfaceImagePropTypes = {
  alt: string;
  className?: string;
  height: number;
  loading: 'lazy' | 'eager';
  performanceMark?: string;
  placeholder?: string;
  priority?: boolean;
  sizes: string,
  src: string;
  style?: any;
  variant: ImageVariant;
  width: number;
};

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
  height,
  performanceMark,
  sizes,
  src,
  width,
}: InterfaceImagePropTypes): React.JSX.Element => {

  const test = 'test';

  console.log(test);

  return (
    <Image
      className={
        classes({
          className,
        })
      }
      alt={alt}
      height={height}
      {...((performanceMark)
        ? {
          onLoad: () => onLoad(performanceMark),
        }
        : {}
      )}
      sizes={sizes}
      src={src}
      width={width}
    />
  );

};
