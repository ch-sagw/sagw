'use client';

import React, {
  forwardRef, Fragment, useEffect, useRef,
} from 'react';
import { cva } from 'cva';
import styles from '@/components/base/Button/Button.module.scss';
import { Icon } from '@/icons';
import Link from 'next/link';
import { ColorMode } from '@/components/base/types/colorMode';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { i18nA11y as internalI18nA11y } from '@/i18n/content';
import { Config } from '@/payload-types';

type BaseWrapperProps = {
  ariaCurrent?: boolean;
  ariaControls?: string;
  ariaLabel?: string;
  ariaDescription?: string;
  autoFocus?: boolean;
  buttonType?: 'submit' | 'button';
  colorMode: ColorMode;
  disabled?: boolean;
  onClick?: (e: React.PointerEvent<HTMLButtonElement>) => void;
  popOverTarget?: string;
  style: 'filled' | 'outlined' | 'text' | 'textSmall' | 'textBright' | 'buttonPlay' | 'socialLink';
  prefetch?: 'auto' | true | false | null;
  className?: string;
  isActive?: boolean;
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
  pageLanguage: Config['locale'];
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
          <SafeHtml
            as='span'
            html={text}
          />
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

export const Button = forwardRef<HTMLButtonElement, InterfaceButtonPropTypes>((props, ref) => {
  const {
    ariaControls,
    ariaCurrent,
    ariaLabel,
    ariaDescription,
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
    isActive,
  } = props;

  const internalButtonRef = useRef<HTMLButtonElement>(null);

  // Merge the internal and external refs
  useEffect(() => {
    if (!ref) {
      return;
    }

    if (typeof ref === 'function') {
      ref(internalButtonRef.current);
    } else {
      ref.current = internalButtonRef.current;
    }
  }, [ref]);

  useEffect(() => {
    if (autoFocus && internalButtonRef.current) {
      internalButtonRef.current.focus();
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
      isActive: {
        false: undefined,
        true: styles.isActive,
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
      const {
        pageLanguage,
      } = props;

      ariaLabelText = ariaLabel
        ? ariaLabel
        : text;

      ariaLabelText += `. ${internalI18nA11y.linkTarget[pageLanguage as keyof typeof internalI18nA11y.linkTarget]} ${internalI18nA11y.opensInNewWindow[pageLanguage as keyof typeof internalI18nA11y.linkTarget]}`;
    }

    return (
      <Link
        aria-current={ariaCurrent}
        aria-label={ariaLabelText}
        className={classes({
          colorMode,
          isActive,
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
      ariaHasPopUp,
    } = props;

    // Render a proper button
    return (
      <button
        ref={internalButtonRef}
        aria-current={ariaCurrent}
        aria-controls={ariaControls}
        aria-label={ariaLabel}
        aria-haspopup={ariaHasPopUp}
        autoFocus={autoFocus}
        className={classes({
          colorMode,
          isActive,
          style,
        })}
        disabled={disabled}
        data-testid='button'
        onClick={onClick}
        popoverTarget={popOverTarget}
        type={buttonType ?? 'button'}
        aria-expanded={ariaExpanded}
      >
        {ariaDescription &&
          <span className={styles.visuallyHidden}>{ariaDescription}</span>
        }

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

});

Button.displayName = 'Button';
