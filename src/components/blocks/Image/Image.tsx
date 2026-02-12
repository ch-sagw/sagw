import 'server-only';
import React from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/Image/Image.module.scss';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { rteToHtml } from '@/utilities/rteToHtml';
import { Image } from '@/components/base/Image/Image';
import { ImageVariant } from '@/components/base/types/imageVariant';

import { InterfaceImageBlock } from '@/payload-types';

const classes = cva([styles.figure], {
  variants: {
    alignment: {
      center: [styles.centered],
      hero: [styles.hero],
      left: [styles.left],
      right: [styles.right],
    },
  },
});

export const ImageBlock = ({
  alignment,
  alignmentMagazine,
  caption,
  credits,
  image,
}: InterfaceImageBlock): React.JSX.Element | undefined => {

  // only handle objects
  if (typeof image !== 'object') {
    return undefined;
  }

  let variant = 'content';

  if (alignmentMagazine === 'hero') {
    variant = 'hero';
  }

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
              filename={image.filename ?? ''}
              focalX={image.focalX ?? undefined}
              focalY={image.focalY ?? undefined}
              height={450}
              loading='lazy'
              url={image.url}
              variant={variant as ImageVariant}
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
