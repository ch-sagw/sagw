import React, { useRef } from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/Video/Video.module.scss';
import {
  Figure,
  InterfaceFigurePropTypes,
} from '@/components/blocks/Figure/Figure';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';

export type InterfaceVideoPropTypes = {
  alignment: InterfaceFigurePropTypes['alignment'],
  stillImage: InterfaceFigurePropTypes,
  video: {
    id: string,
    duration: string,
    title: '',
  }
}

const classes = cva([styles.videoWrapper], {
  variants: {
    alignment: {
      centered: [styles.centered],
      left: [styles.left],
      right: [styles.right],
    },
  },
});

export const Video = ({
  alignment,
  stillImage,
}: InterfaceVideoPropTypes): React.JSX.Element => {

  const playIcon = 'play' as keyof typeof Icon;
  const buttonRef = useRef<HTMLButtonElement>(null);

  const loadVideo = (): void => {
    const button = buttonRef.current;

    console.log('button');
    console.log(button);
    console.log(button?.getAttribute('aria-label'));
  };

  return (
    <div
      className={classes({
        alignment,
      })}
    >
      <div
        className={styles.videoWrapperInner}
      >
        <div className={styles.videoContainer}>
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            ariaHasPopUp={false}
            ariaLabel='Video mit dem Titel die SAGW stellt sich vor laden und abspielen.'
            buttonType='button'
            colorMode='white'
            element='button'
            iconInlineStart={playIcon}
            onClick={loadVideo}
            ref={buttonRef}
            style='buttonPlay'
            text=''
          />
        </div>
      </div>
      <Figure
        alignment={stillImage.alignment}
        caption={stillImage.caption}
        credits={stillImage.credits}
        imageConfig={stillImage.imageConfig}
      />
    </div>
  );
};
