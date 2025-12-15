import { InterfaceImagePropTypes } from '@/components/base/Image/Image';

export const createImageSrcUrl = ({
  filename,
  url,
}: {
  filename: InterfaceImagePropTypes['filename'];
  url: InterfaceImagePropTypes['url'];
}): string => {
  const host = process.env.NEXT_PUBLIC_GUMLET_URL ?? '';

  console.log(`host ${host}`);

  let src = host + url;

  console.log(`src ${src}`);

  if (process.env.NEXT_PUBLIC_GUMLET_URL?.indexOf('localhost') !== -1) {
    src = `${host}/${filename}`;
  }

  console.log(`src ${src}`);

  return src;
};
