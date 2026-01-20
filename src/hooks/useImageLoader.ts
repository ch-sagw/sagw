import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

interface InterfaceImageLoadedOptions {
  performanceMark?: string;
  placeholderSrc?: string;
}

export const useImageLoader = (
  imgSrc: string,
  options?: InterfaceImageLoadedOptions,
): {
  imgRef: React.RefObject<HTMLImageElement | null>;
  loaded: boolean;
  fadeIn: boolean;
  imgSrc: string;
} => {
  const {
    performanceMark,
    placeholderSrc,
  } = options ?? {};

  const imgRef = useRef<HTMLImageElement | null>(null);

  const [
    loaded,
    setLoaded,
  ] = useState(false);

  const [
    fadeIn,
    setFadeIn,
  ] = useState(false);

  const handleLoad = useCallback((): void => {
    const img = imgRef.current;

    if (!img || loaded) {
      return;
    }

    const isCached = img.complete && img.naturalWidth > 0 && img.currentSrc !== '';

    setLoaded(true);

    // Only apply fade-in if not cached
    setFadeIn(!isCached);

    if (performanceMark) {
      performance.mark(performanceMark);
    }
  }, [
    loaded,
    performanceMark,
  ]);

  useEffect(() => {
    const img = imgRef.current;

    if (!img) {
      return undefined;
    }

    const onLoad = ():void => handleLoad();

    img.addEventListener('load', onLoad);

    if (img.complete && img.naturalWidth > 0) {
      queueMicrotask(() => handleLoad());
    }

    return ():void => img.removeEventListener('load', onLoad);

  }, [handleLoad]);

  return {
    fadeIn,
    imgRef,
    imgSrc: loaded
      ? imgSrc
      : placeholderSrc ?? imgSrc,
    loaded,
  };
};
