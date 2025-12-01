
'use client';

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/Video/Video.module.scss';
import { rteToHtml } from '@/utilities/rteToHtml';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { Image } from '@/components/base/Image/Image';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';
import { VideoConsentMessage } from '@/components/base/VideoConsentMessage/VideoConsentMessage';
import { GumletPlayer } from '@gumlet/react-embed-player';
import {
  useLocale, useTranslations,
} from 'next-intl';
import {
  Video as InterfaceVideo,
  InterfaceVideoBlock,
} from '@/payload-types';

import {
  consentUpdatedEventName,
  getCookieConsent,
} from '@/components/helpers/cookies';
import { TypedLocale } from 'payload';

export type InterfaceVideoPropTypes = {
  duration?: string,
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
  stillImage,
  'video-de': videoDe,
  'video-en': videoEn,
  'video-fr': videoFr,
  'video-it': videoIt,
}: InterfaceVideoPropTypes): React.JSX.Element | undefined => {
  const locale = useLocale() as TypedLocale;
  const i18nA11y = useTranslations('i18nA11y');

  // Select correct video source for the current language
  // if available and fall back to german if there is no
  // language specific variant set.
  const videos = {
    'video-de': videoDe,
    'video-en': videoEn,
    'video-fr': videoFr,
    'video-it': videoIt,
  };

  const video = (videos[`video-${locale}`] ?? videos['video-de']) as InterfaceVideo;

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

  const playButtonText = i18nA11y('playVideoText')
    .replace('{{title}}', video.title);

  const pausedClass = paused
    ? styles.paused
    : '';

  return (
    <figure
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
                ${pausedClass}`}
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
            <VideoConsentMessage />
          </div>
        )}
        <div className={styles.stillImageWrapper}>
          {typeof stillImage === 'object' && stillImage.url
            ? (
              <Image
                alt={stillImage.alt}
                filename={stillImage.filename ?? ''}
                focalX={stillImage.focalX ?? undefined}
                focalY={stillImage.focalY ?? undefined}
                height={450}
                loading='lazy'
                url={stillImage.url}
                variant='content'
                width={800}
              />
            )
            : null
          }
        </div>
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
