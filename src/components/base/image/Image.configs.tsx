/* eslint-disable @next/next/no-img-element */
import { InterfaceImagePropTypes } from '@/components/base/Image/Image.custom';

export const portraitMarkup = ({
  alt,
  fetchPriority,
  height,
  loading,
  params,
  src,
  width,
}: InterfaceImagePropTypes): React.JSX.Element => {

  const srcSet = `
    ${src}?${params}&w=600&h=600&dpr=2&q=30 1200w,
    ${src}?${params}&w=400&h=400&dpr=2&q=30 800w,
    ${src}?${params}&w=600&h=600&q=60 600w,
    ${src}?${params}&w=400&h=400&&q=60 400w
  `;

  const sizes = `
    (min-width: 64rem) 600px, 400px 
  `;

  return (
    <img
      alt={alt}
      fetchPriority={fetchPriority}
      height={height}
      loading={loading}
      sizes={sizes}
      src={src}
      srcSet={srcSet.trim()}
      width={width}
    />
  );
};
