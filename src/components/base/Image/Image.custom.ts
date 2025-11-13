import { ImageVariant } from '@/components/base/types/imageVariant';

export type InterfaceImagePropTypes = {
  alt: string;
  classes?: string;
  focalPointX: number,
  focalPointY: number,
  height: number;
  loading: 'lazy' | 'eager';
  params?: string,
  performanceMark?: string;
  priority?: boolean;
  src: string;
  variant: ImageVariant;
  width: number;
};
