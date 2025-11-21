
'use client';

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/Video/Video.module.scss';
import { ImageBlock } from '@/components/blocks/Image/Image';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';
import { VideoConsentMessage } from '@/components/base/VideoConsentMessage/VideoConsentMessage';
import { GumletPlayer } from '@gumlet/react-embed-player';
import { i18nA11y } from '@/i18n/content';
import {
  Config,
  Image as InterfaceImage,
  Video as InterfaceVideo,
  InterfaceVideoBlock,
} from '@/payload-types';

import {
  consentUpdatedEventName,
  getCookieConsent,
} from '@/components/helpers/cookies';

export type InterfaceVideoPropTypes = {
  duration?: string,
  stillImage: InterfaceImage,
  stillImageHost: string,
  pageLanguage: Config['locale'],
} & InterfaceVideoBlock;

const classes = cva([styles.videoWrapper], {
  variants: {
    alignment: {
      center: [styles.centered],
      left: [styles.left],
      right: [styles.right],
    },
  },
});

export const Video = ({
  alignment,
  caption,
  credits,
  duration,
  pageLanguage,
  stillImage,
  stillImageHost,
  'video-de': videoDe,
  'video-en': videoEn,
  'video-fr': videoFr,
  'video-it': videoIt,
}: InterfaceVideoPropTypes): React.JSX.Element => {

  // Select correct video source for the current language
  // if available and fall back to german if there is no
  // language specific variant set.
  const videos = {
    'video-de': videoDe,
    'video-en': videoEn,
    'video-fr': videoFr,
    'video-it': videoIt,
  };

  const video = (videos[`video-${pageLanguage}`] ?? videos['video-de']) as InterfaceVideo;

  // Handle consent state -> Show/Hide consent message
  const [
    internalConsent,
    setInternalConsent,
  ] = useState(false);

  useEffect(() => {
    const handleConsentUpdate = (): void => {
      const cookieConsentObject = getCookieConsent();

      setInternalConsent(Boolean(cookieConsentObject?.external));
    };

    handleConsentUpdate();

    window.addEventListener(consentUpdatedEventName, handleConsentUpdate);

    return (): void => {
      window.removeEventListener(consentUpdatedEventName, handleConsentUpdate);
    };
  });

  // Paused state
  const [
    paused,
    setPaused,
  ] = useState(true);

  // Element references
  const playIcon = 'play' as keyof typeof Icon;
  const playerRef = useRef<any>(null);
  const videoContainer = useRef<HTMLDivElement>(null);

  // Load video and remove paused state
  const loadVideo = (): void => {
    playerRef.current?.play();

    setPaused(false);
  };

  const playButtonText = i18nA11y.playVideoText[pageLanguage]
    .replace('{{title}}', video.title);

  return (
    <div
      className={classes({
        alignment,
      })}
    >
      <div
        className={styles.videoWrapperInner}
      >
        {(internalConsent) && (
          <div>
            <div
              className={`${styles.videoContainer} 
                ${paused
            ? styles.paused
            : ''
          }`}
              ref={videoContainer}
            >
              <GumletPlayer
                videoID={video.id}
                title='Video'
                ref={playerRef}
                style={{
                  aspectRatio: '16/9',
                  height: '100%',
                  position: 'relative',
                  width: '100%',
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
                ariaLabel={playButtonText}
                buttonType='button'
                colorMode='white'
                element='button'
                iconInlineStart={playIcon}
                onClick={loadVideo}
                style='buttonPlay'
                text=''
              />

              <span
                aria-hidden={true}
                className={styles.duration}
              >
                {duration} Min
              </span>
            </div>
          </div>
        )}
        {(!internalConsent) && (
          <div
            className={styles.consentMessageWrapper}
          >
            <VideoConsentMessage
              pageLanguage={pageLanguage}
            />
          </div>
        )}
        <div className={styles.figureWrapper}>
          <ImageBlock
            blockType={'imageBlock'}
            alignment={alignment}
            caption={caption}
            credits={credits}
            host={stillImageHost}
            image={stillImage}
          />
        </div>
      </div>
    </div>
  );
};
