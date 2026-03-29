'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { InterfaceVideoBlock } from '@/payload-types';

const VideoComponent = dynamic(
  () => import('./Video').then((mod) => mod.Video),
  {
    loading: () => null,
    ssr: false,
  },
);

export type InterfaceVideoClientPropTypes = {
  duration?: number;
} & InterfaceVideoBlock;

export const Video = (props: InterfaceVideoClientPropTypes): React.JSX.Element => <VideoComponent {...props} />;
