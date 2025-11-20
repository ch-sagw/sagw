import React from 'react';
import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Video } from '@/components/blocks/Video/Video';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import {
  ContentImageCentered,
  ContentImageLeftAligned,
  ContentImageRightAligned,
} from '@/components/blocks/Image/Image.stories';

type VideoProps = React.ComponentProps<typeof Video>;

type StrictStory = StoryObj<typeof Video> & {
  args: VideoProps;
};

const video = {
  createdAt: '2025-11-18T12:02:51.117Z',
  filename: 'sagw.mp4',
  filesize: 1773409,
  id: '68f9e148609b9e4625b4278d',
  mimeType: 'video/mp4',
  tenant: '691c60693bd37d7912b4feb8',
  thumbnailURL: null,
  title: 'video sagw de',
  updatedAt: '2025-11-18T12:02:51.118Z',
  url: '/api/videos/file/sagw.mp4',
};

const videoData = {
  de: {
    ...video,
  },
  en: {
    ...video,
    title: 'video sagw en',
  },
  fr: {
    ...video,
    title: 'video sagw fr',
  },
  it: {
    ...video,
    title: 'video sagw it',
  },
};

const meta: Meta<typeof Video> = {
  args: {},
  component: Video,
  decorators: [defaultDecoratorNoPadding],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'a11y:check',
  ],
  title: 'Components/blocks/Video',
};

const withCookieConsent = (consent: boolean): (Story: any) => React.ReactElement => {
  const decorator = (Story: any): React.ReactElement => {
    document.cookie = 'cookie_consent=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';

    if (consent) {
      const fullConsent = {
        analytics: true,
        consentGiven: true,
        essential: true,
        external: true,
        timestamp: Date.now(),
      };

      // Set the desired value
      document.cookie = `cookie_consent=${encodeURIComponent(JSON.stringify(fullConsent))}; path=/; samesite=lax`;
    }

    return React.createElement(Story);
  };

  decorator.displayName = 'WithCookieConsent';

  return decorator;
};

export default meta;

export const VideoCenteredWithoutConsentCheck: StrictStory = {
  args: {
    'alignment': 'center',
    'blockType': 'videoBlock',
    'caption': ContentImageCentered.args.caption,
    'credits': ContentImageCentered.args.credits,
    'duration': '00:24',
    'pageLanguage': 'de',
    'stillImage': ContentImageCentered.args.image,
    'stillImageHost': 'https://sagw-nu.gumlet.io',
    'video-de': videoData.de,
    'video-en': videoData.en,
    'video-fr': videoData.fr,
    'video-it': videoData.it,
  },
  decorators: [withCookieConsent(true)],
};

export const VideoCentered: StrictStory = {
  args: {
    'alignment': 'center',
    'blockType': 'videoBlock',
    'caption': ContentImageCentered.args.caption,
    'credits': ContentImageCentered.args.credits,
    'duration': '00:24',
    'pageLanguage': 'de',
    'stillImage': ContentImageCentered.args.image,
    'stillImageHost': 'https://sagw-nu.gumlet.io',
    'video-de': videoData.de,
    'video-en': videoData.en,
    'video-fr': videoData.fr,
    'video-it': videoData.it,
  },
  decorators: [withCookieConsent(false)],
};

export const ContentVideoLeftAligned: StrictStory = {
  args: {
    'alignment': 'left',
    'blockType': 'videoBlock',
    'caption': ContentImageLeftAligned.args.caption,
    'credits': ContentImageLeftAligned.args.credits,
    'duration': '03:18',
    'pageLanguage': 'de',
    'stillImage': ContentImageLeftAligned.args.image,
    'stillImageHost': 'https://sagw-nu.gumlet.io',
    'video-de': videoData.de,
    'video-en': videoData.en,
    'video-fr': videoData.fr,
    'video-it': videoData.it,
  },
  decorators: [withCookieConsent(true)],
};

export const ContentVideoRightAligned: StrictStory = {
  args: {
    'alignment': 'right',
    'blockType': 'videoBlock',
    'caption': ContentImageRightAligned.args.caption,
    'credits': ContentImageRightAligned.args.credits,
    'duration': '02:34',
    'pageLanguage': 'de',
    'stillImage': ContentImageRightAligned.args.image,
    'stillImageHost': 'https://sagw-nu.gumlet.io',
    'video-de': videoData.de,
    'video-en': videoData.en,
    'video-fr': videoData.fr,
    'video-it': videoData.it,
  },
  decorators: [withCookieConsent(true)],
};
