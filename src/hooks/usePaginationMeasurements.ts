import React, {
  useEffect, useRef, useState,
} from 'react';

interface InterfacePaginationMeasurements {
  maxItems: number;
}

export const usePaginationMeasurements = (): {
  containerRef: React.RefObject<HTMLElement | null>;
  measurements: InterfacePaginationMeasurements;
} => {
  const [
    measurements,
    setMeasurements,
  ] = useState<InterfacePaginationMeasurements>({
    maxItems: 7,
  });

  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const calculateMaxItems = (): void => {
      if (!containerRef.current) {
        return;
      }

      const containerWidth = containerRef.current.offsetWidth;
      const computedStyle = window.getComputedStyle(containerRef.current);

      // Get item size from CSS variable
      const itemSizeValue = computedStyle.getPropertyValue('--pagination-item-size');
      const itemSize = itemSizeValue
        ? parseFloat(itemSizeValue)
        : 56;

      // Get gap from CSS variable
      const gapValue = computedStyle.getPropertyValue('--pagination-gap');
      const gapSize = gapValue
        ? parseFloat(gapValue)
        : 16;

      // Calculate how many items can fit
      const maxItems = Math.floor((containerWidth + gapSize) / (itemSize + gapSize));

      // Ensure no more than 10 items
      const clampedMaxItems = Math.max(1, Math.min(10, maxItems));

      setMeasurements({
        maxItems: clampedMaxItems,
      });
    };

    calculateMaxItems();

    window.addEventListener('resize', calculateMaxItems);

    return (): void => {
      window.removeEventListener('resize', calculateMaxItems);
    };
  }, []);

  return {
    containerRef,
    measurements,
  };
};
