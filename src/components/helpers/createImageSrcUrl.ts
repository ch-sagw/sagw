import { InterfaceImagePropTypes } from '@/components/base/Image/Image';

export const createImageSrcUrl = ({
  filename,
  url,
}: {
  filename: InterfaceImagePropTypes['filename'];
  url: InterfaceImagePropTypes['url'];
}): string => {

  const host = process.env.NEXT_PUBLIC_GUMLET_URL;

  // in storybook NEXT_PUBLIC_GUMLET_URL is not set and
  // in the stories files the entire url is stored within
  // the «url» property. in the real world, «url» will
  // contain the entire filepath.
  if (url.indexOf('https://') !== -1) {
    return url;
  }

  // since the vercel sagw-blob-local is not mapped to
  // a custom domain, all assets on it are directly
  // available from the root directory. we therefore
  // can not work with the «url» property and have to
  // use a combination of host and filename.
  if (host && host.indexOf('localhost') !== -1) {
    return `${host}/${filename}`;
  }

  // finally, if none of the special cases apply, we return
  // the combination of the host and the value from the «url»
  // property.
  return host + url;
};
