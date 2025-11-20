'use client';

import React, { useEffect } from 'react';

export const NoJsScript = (): React.JSX.Element | null => {
  useEffect(() => {
    const doc = document.documentElement;

    doc.className = `${doc.className.replace(/\bno-js\b/u, '')} js`;
  }, []);

  return null;
};
