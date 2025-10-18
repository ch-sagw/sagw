import {
  useEffect, useState,
} from 'react';

interface InterfacePaginationMeasurements {
  maxItems: number;
}

export const usePaginationMeasurements = () => {
  const [
    measurements,
    setMeasurements,
  ] = useState<InterfacePaginationMeasurements>({
    maxItems: 7,
  });

  useEffect(() => {
    const calculateMaxItems = () => {
      // Get viewport width
      const viewportWidth = window.innerWidth;

      // Estimate item width based on CSS variables and viewport
      // From the SCSS: --pagination-item-size: 56 (mobile), 64 (desktop)
      const isMobile = viewportWidth < 768;
      const itemSize = isMobile
        ? 56
        : 64;

      // Gap: --spacing-m (mobile), --spacing-l (desktop)
      // Assuming these are around 16px and 24px respectively
      const gapSize = isMobile
        ? 16
        : 24;

      // Calculate how many items can fit
      // Account for some padding/margins (let's say 40px total)
      const availableWidth = viewportWidth - 40;
      const maxItems = Math.floor((availableWidth + gapSize) / (itemSize + gapSize));

      // Ensure reasonable bounds
      const clampedMaxItems = Math.max(3, Math.min(15, maxItems));

      setMeasurements({
        maxItems: clampedMaxItems,
      });
    };

    // Calculate on mount and resize
    calculateMaxItems();
    window.addEventListener('resize', calculateMaxItems);

    return () => {
      window.removeEventListener('resize', calculateMaxItems);
    };
  }, []);

  return {
    measurements,
  };
};
