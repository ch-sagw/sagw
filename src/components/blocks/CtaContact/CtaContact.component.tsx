'use client';

import React, { useState } from 'react';
import { Button } from '@/components/base/Button/Button';
import { ColorMode } from '@/components/base/types/colorMode';
import {
  InterfaceResolveMailtoAction, openMailto,
} from '@/components/helpers/writeEmail';

export type InterfaceCtaContactButtonPropTypes = {
  buttonText: string;
  colorMode: ColorMode;
  personId: string;
  // The resolveMailto server action, passed down from RenderBlocks.
  // This module must not import the action itself, because it is
  // rendered in Storybook where 'use server' modules cannot be bundled.
  resolveMailtoAction?: InterfaceResolveMailtoAction;
  className?: string;
};

// Client boundary for the "write email" button: the email address is
// not part of the rendered markup, it is resolved from the server only
// when the visitor clicks the button.
export const CtaContactButton = ({
  buttonText,
  colorMode,
  personId,
  resolveMailtoAction,
  className,
}: InterfaceCtaContactButtonPropTypes): React.JSX.Element => {
  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const handleClick = async (): Promise<void> => {
    setIsLoading(true);

    try {
      await openMailto({
        action: resolveMailtoAction,
        input: {
          personId,
          source: 'person',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      text={buttonText}
      colorMode={colorMode}
      element='button'
      style='filled'
      className={className}
      isLoading={isLoading}
      onClick={(): Promise<void> => handleClick()}
    />
  );
};
