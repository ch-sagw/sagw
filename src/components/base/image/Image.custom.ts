import { ImageVariant } from '@/components/base/types/imageVariant';

export type InterfaceImagePropTypes = {
  alt: string;
  className?: string;
  fetchPriority?: 'auto' | 'low' | 'high';
  focalPointX?: number,
  focalPointY?: number,
  height: number;
  loading: 'lazy' | 'eager';
  params?: string,
  performanceMark?: string;
  priority?: boolean;
  src: string;
  style?: any;
  variant: ImageVariant;
  width: number;
};
