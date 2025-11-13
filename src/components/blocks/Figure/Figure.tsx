import React from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/Figure/Figure.module.scss';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { rteToHtml } from '@/utilities/rteToHtml';
import { InterfaceRte } from '@/components/base/types/rte';
import { InterfaceImagePropTypes } from '@/components/base/Image/Image.custom';
import { Image } from '@/components/base/Image/Image';

export type InterfaceFigurePropTypes = {
  alignment: 'centered' | 'left' | 'right';
  caption: InterfaceRte;
  credits: InterfaceRte;
  imageConfig: InterfaceImagePropTypes;
};

const classes = cva([styles.figure], {
  variants: {
    alignment: {
      centered: [styles.centered],
      left: [styles.left],
      right: [styles.right],
    },
  },
});

export const Figure = ({
  alignment,
  caption,
  credits,
  imageConfig,
}: InterfaceFigurePropTypes): React.JSX.Element => {

  // TODO
  // Replace Payload URL with Gumlet URL
  console.log('TODO: Replace Payload URL with Gumlet URL dynamically');

  return (
    <figure
      className={classes({
        alignment,
      })}
    >
      <Image
        alt={imageConfig.alt}
        focalPointX={imageConfig.focalPointX}
        focalPointY={imageConfig.focalPointY}
        height={imageConfig.height}
        loading={imageConfig.loading}
        src={imageConfig.src}
        variant={imageConfig.variant}
        width={imageConfig.width}
      />

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
