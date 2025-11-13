import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { cva } from 'cva';
import styles from '@/components/blocks/Video/Video.module.scss';
import {
  Figure,
  InterfaceFigurePropTypes,
} from '@/components/blocks/Figure/Figure';
import { Button } from '@/components/base/Button/Button';
import { Icon } from '@/icons';
import { VideoConsentMessage } from '@/components/base/VideoConsentMessage/VideoConsentMessage';
import { GumletPlayer } from '@gumlet/react-embed-player';
import { i18nA11y } from '@/i18n/content';
import { Config } from '@/payload-types';
import {
  consentUpdatedEventName,
  getCookieConsent,
} from '@/components/helpers/cookies';
import { InterfaceRte } from '@/components/base/types/rte';

export type InterfaceVideoPropTypes = {
  alignment: InterfaceFigurePropTypes['alignment'],
  overrideConsent?: boolean,
  pageLanguage: Config['locale'],
  stillImage: InterfaceFigurePropTypes,
  video: {
    caption: InterfaceRte,
    credits: InterfaceRte,
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
  overrideConsent,
  stillImage,
  pageLanguage,
  video,
}: InterfaceVideoPropTypes): React.JSX.Element => {

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

  const playIcon = 'play' as keyof typeof Icon;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const playerRef = useRef<any>(null);
  const videoContainer = useRef<HTMLDivElement>(null);

  const loadVideo = (): void => {
    playerRef.current?.play();

    videoContainer.current?.classList.remove(styles.paused);
  };

  const playButtonText = i18nA11y.playVideoText[pageLanguage as keyof typeof i18nA11y.playVideoText]
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
        {(internalConsent || overrideConsent) && (
          <div>
            <div
              className={`${styles.videoContainer} 
                ${styles.paused}`}
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
                ref={buttonRef}
                style='buttonPlay'
                text='' />
              <span
                aria-hidden={true}
                className={styles.duration}
              >
                {video.duration} Min
              </span>
            </div>
          </div>
        )}
        {(!internalConsent && !overrideConsent) && (
          <div
            className={styles.consentMessageWrapper}
          >
            <VideoConsentMessage
              pageLanguage={pageLanguage}
            />
          </div>
        )}
        <div className={styles.figureWrapper}>
          <Figure
            alignment={stillImage.alignment}
            caption={video.caption}
            credits={video.credits}
            imageConfig={stillImage.imageConfig}
          />
        </div>
      </div>
    </div>
  );
};
