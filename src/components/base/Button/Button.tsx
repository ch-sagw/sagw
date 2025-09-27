'use client';

import React, {
  Fragment, useEffect, useRef,
} from 'react';
import { cva } from 'cva';
import styles from '@/components/base/Button/Button.module.scss';
import { Icon } from '@/icons';
import Link from 'next/link';
import { ColorMode } from '@/components/base/types/colorMode';

type BaseWrapperProps = {
  ariaCurrent?: boolean;
  ariaControls?: string;
  ariaLabel?: string;
  autoFocus?: boolean;
  buttonType?: 'submit' | 'button';
  colorMode: ColorMode;
  disabled?: boolean;
  onClick?: (e: React.PointerEvent<HTMLButtonElement>) => void;
  popOverTarget?: string;
  style: 'filled' | 'outlined' | 'text' | 'textSmall' | 'textBright' | 'buttonPlay' | 'socialLink';
  prefetch?: 'auto' | true | false | null;
  className?: string;
};

type ContentProps = {
  iconInlineStart?: keyof typeof Icon | undefined;
  iconInlineEnd?: keyof typeof Icon | undefined;
  element: 'button' | 'link';
  text: string;
}

type BaseProps = BaseWrapperProps & ContentProps;

type ButtonProps = BaseProps & {
  element: 'button';
  ariaHasPopUp?: boolean | undefined;
  ariaExpanded?: boolean | undefined;
};

type LinkProps = BaseProps & {
  element: 'link';
  href: string;
  target?: '_blank';
};

type ButtonPlayProps = ButtonProps & {
  style: 'buttonPlay';
  ariaLabel: '';
};

export type InterfaceButtonPropTypes =
  | ButtonProps
  | LinkProps
  | ButtonPlayProps;

// TODOs
// - Integrate tracking events or necessary data attributes
// - Add support for loading state
// - Add support for visually hidden text for target _blank

const buttonLinkContent = ({
  iconInlineStart,
  text,
  iconInlineEnd,
  element,
}: ContentProps): React.JSX.Element => (
  <Fragment>
    {iconInlineStart && (
      <span className={styles.iconStart}>
        <Icon name={iconInlineStart} className={`${element}__icon--${iconInlineStart}`} />
      </span>
    )}
    {
      text && (
        <span className={styles.innerText}>
          {text}
          <span className={styles.line}></span>
        </span>
      )
    }
    {
      iconInlineEnd && (
        <span className={styles.iconEnd}>
          <Icon name={iconInlineEnd} className={`${element}__icon--${iconInlineEnd}`} />
        </span>
      )
    }
  </Fragment>
);

export const Button = (props: InterfaceButtonPropTypes): React.JSX.Element => {
  const {
    ariaControls,
    ariaCurrent,
    ariaLabel,
    autoFocus,
    buttonType,
    colorMode,
    disabled,
    element,
    iconInlineEnd,
    iconInlineStart,
    popOverTarget,
    prefetch,
    style,
    text,
    onClick,
    className,
  } = props;

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (autoFocus && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [autoFocus]);

  const classes = cva([
    styles.button,
    className,
  ], {
    variants: {
      colorMode: {
        dark: [styles.dark],
        light: [styles.light],
        white: [styles.white],
      },
      style: {
        buttonPlay: [styles.buttonPlay],
        filled: [styles.buttonFilled],
        iconOnly: [styles.iconOnly],
        outlined: [styles.buttonOutlined],
        socialLink: [styles.socialLink],
        text: [styles.buttonText],
        textBright: [
          styles.buttonText,
          styles.buttonTextBright,
        ],
        textSmall: [
          styles.buttonText,
          styles.buttonTextSmall,
        ],
      },
    },
  });

  // Render the NextJS link element
  if (element === 'link') {
    const {
      href,
      target,
    } = props;

    let ariaLabelText = ariaLabel;

    if (target === '_blank') {

      ariaLabelText = ariaLabel
        ? ariaLabel
        : text;

      ariaLabelText += ' (link target opens in a new tab)';
    }

    return (
      <Link
        aria-current={ariaCurrent}
        aria-label={ariaLabelText}
        className={classes({
          colorMode,
          style,
        })}
        data-testid='link'
        href={href}
        target={target}
        prefetch={prefetch}
      >
        {buttonLinkContent({
          element: 'link',
          iconInlineEnd,
          iconInlineStart,
          text,
        })}
      </Link >
    );
  }

  if (element === 'button') {
    const {
      ariaExpanded,
    } = props;

    // Render a proper button
    return (
      <button
        ref={buttonRef}
        aria-current={ariaCurrent}
        aria-controls={ariaControls}
        aria-label={ariaLabel}
        autoFocus={autoFocus}
        className={classes({
          colorMode,
          style,
        })}
        disabled={disabled}
        data-testid='button'
        onClick={onClick}
        popoverTarget={popOverTarget}
        type={buttonType ?? 'button'}
        aria-expanded={ariaExpanded}
      >
        {buttonLinkContent({
          element: 'button',
          iconInlineEnd,
          iconInlineStart,
          text,
        })}
      </button>
    );
  }

  return <Fragment />;

};
