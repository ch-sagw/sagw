import React, { useRef } from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/Video/Video.module.scss';
import {
  Figure,
  InterfaceFigurePropTypes,
} from '@/components/blocks/Figure/Figure';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';
import { GumletPlayer } from '@gumlet/react-embed-player';

export type InterfaceVideoPropTypes = {
  alignment: InterfaceFigurePropTypes['alignment'],
  stillImage: InterfaceFigurePropTypes,
  video: {
    id: string,
    duration: string,
    title: string,
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
  video,
}: InterfaceVideoPropTypes): React.JSX.Element => {

  const playIcon = 'play' as keyof typeof Icon;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const playerRef = useRef(null);
  const videoContainer = useRef<HTMLDivElement>(null);

  const loadVideo = (): void => {
    // const button = buttonRef.current;

    if (playerRef.current) {
      playerRef.current.play();
    }

    videoContainer.current?.classList.remove(styles.paused);
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
        <div
          className={
            `${styles.videoContainer} 
            ${styles.paused}`
          }
          ref={videoContainer}
        >
          <GumletPlayer
            videoID={video.id}
            title='Video'
            ref={playerRef}
            style={{
              '--media-primary-color': 'deeppink!important',
              '--media-range-bar-color': 'lime!important',
              'aspectRatio': '16/9',
              'height': '100%',
              'position': 'relative',
              'width': '100%',
            }}
            schemaOrgVideoObject={{
              '@context': 'https://schema.org',
              '@type': 'VideoObject',
              'description': '',
              'embedUrl': 'https://play.gumlet.io/embed/64bfb0913ed6e5096d66dc1e',
              'name': 'Gumlet',
            }}
            autoplay={false}
            preload={false}
            muted={true}
          />
        </div>
        <div
          className={styles.buttonWrapper}
          onClick={loadVideo}
        >
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
          <span
            aria-hidden={true}
            className={styles.duration}
          >
            {video.duration} Min
          </span>
        </div>
      </div>
      <div className={styles.figureWrapper}>
        <Figure
          alignment={stillImage.alignment}
          caption={stillImage.caption}
          credits={stillImage.credits}
          imageConfig={stillImage.imageConfig}
        />
      </div>
    </div>
  );
};
