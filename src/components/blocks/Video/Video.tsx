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
import { GumletPlayer } from '@gumlet/react-embed-player';
import { i18nConsent } from '@/i18n/content';
import { Config } from '@/payload-types';
import {
  consentUpdatedEventName,
  getCookieConsent,
  openConsentOverlayEventName,
} from '@/components/helpers/cookies';

export type InterfaceVideoPropTypes = {
  alignment: InterfaceFigurePropTypes['alignment'],
  pageLanguage: Config['locale'],
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
  const buttonRefOpenCookieSettings = useRef<HTMLButtonElement>(null);
  const playerRef = useRef<any>(null);
  const videoContainer = useRef<HTMLDivElement>(null);

  const loadVideo = (): void => {
    playerRef.current?.play();

    videoContainer.current?.classList.remove(styles.paused);
  };

  const openCookieSettingsOverlay = (): void => {
    window.dispatchEvent(new Event(openConsentOverlayEventName));
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
        {internalConsent && (
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
                ariaLabel='Video mit dem Titel die SAGW stellt sich vor laden und abspielen.'
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
        {!internalConsent && (
          <div
            className={styles.consentMessageWrapper}
          >
            <div
              className={styles.consentMessage}
            >
              <p className={styles.consentMessageTitle}>{i18nConsent.titleExternalContent[pageLanguage as keyof typeof i18nConsent.titleExternalContent]}</p>
              <div className={styles.consentMessageText}>{i18nConsent.messageVideo[pageLanguage as keyof typeof i18nConsent.messageVideo]}</div>
              <Button
                ariaHasPopUp={true}
                ariaLabel={i18nConsent.buttonTextOpenCookieSettings[pageLanguage as keyof typeof i18nConsent.buttonTextOpenCookieSettings]}
                buttonType='button'
                colorMode='dark'
                element='button'
                iconInlineStart={'config' as keyof typeof Icon}
                onClick={openCookieSettingsOverlay}
                ref={buttonRefOpenCookieSettings}
                style='outlined'
                text={i18nConsent.buttonTextOpenCookieSettings[pageLanguage as keyof typeof i18nConsent.buttonTextOpenCookieSettings]}
              />
            </div>
          </div>
        )}
        <div className={styles.figureWrapper}>
          <Figure
            alignment={stillImage.alignment}
            caption={stillImage.caption}
            credits={stillImage.credits}
            imageConfig={stillImage.imageConfig}
          />
        </div>
      </div>
    </div>
  );
};
