import { InterfaceImagePropTypes } from '@/components/base/Image/Image';

export const createImageSrcUrl = ({
  filename,
  url,
}: {
  filename: InterfaceImagePropTypes['filename'];
  url: InterfaceImagePropTypes['url'];
}): string => {
  const host = process.env.NEXT_PUBLIC_GUMLET_URL ?? '';

  let src = host + url;

  if (process.env.NEXT_PUBLIC_GUMLET_URL?.indexOf('localhost') !== -1) {
    src = `${host}/${filename}`;
  }

  return src;
};
