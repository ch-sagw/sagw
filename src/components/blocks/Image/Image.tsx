import React from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/Image/Image.module.scss';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { rteToHtml } from '@/utilities/rteToHtml';
import { Image } from '@/components/base/Image/Image';

import {
  Image as InterfaceImage,
  InterfaceImageBlock,
} from '@/payload-types';

const classes = cva([styles.figure], {
  variants: {
    alignment: {
      center: [styles.centered],
      left: [styles.left],
      right: [styles.right],
    },
  },
});

export type InterfaceImageBlockPropTypes = {
  host: string;
  image: InterfaceImage;
} & InterfaceImageBlock;

export const ImageBlock = ({
  alignment,
  caption,
  credits,
  image,
  host,
}: InterfaceImageBlockPropTypes): React.JSX.Element => {

  if (!host) {
    throw new Error('ImageBlock component requires a valid host prop');
  }

  const focalPointX = (image.focalX ?? 50) / 100;
  const focalPointY = (image.focalY ?? 50) / 100;
  const imageUrl = host + image.url;

  return (
    <figure
      className={classes({
        alignment,
      })}
    >
      <div className={styles.imageWrapper}>
        {image.url
          ? (
            <Image
              alt={image.alt}
              focalPointX={focalPointX}
              focalPointY={focalPointY}
              height={450}
              loading='lazy'
              src={imageUrl}
              variant='content'
              width={800}
            />
          )
          : null
        }
      </div>

      <figcaption
        className={styles.figcaption}
      >
        {caption && (
          <SafeHtml
            as='span'
            className={styles.caption}
            html={rteToHtml(caption)}
          />
        )}
        <span
          className={styles.credits}
        >
          © <SafeHtml
            as='span'
            html={rteToHtml(credits)}
          />
        </span>
      </figcaption>
    </figure>
  );
};
