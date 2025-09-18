import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/Button/Button.module.scss';
import { Icon } from '@/icons';
import Link from 'next/link';

type BaseProps = {
  ariaCurrent?: boolean;
  ariaControls?: string;
  ariaLabel?: string,
  autoFocus?: boolean;
  colorTheme: 'light' | 'dark';
  disabled?: boolean;
  element: 'button' | 'link';
  iconInlineStart?: keyof typeof Icon | undefined;
  iconInlineEnd?: keyof typeof Icon | undefined;
  onClick?: () => void;
  popOverTarget?: string;
  style: 'filled' | 'outlined' | 'text' | 'buttonPlay' | 'socialLink';
  text: string;
};

type ButtonProps = BaseProps & {
  ariaHasPopUp: boolean;
  buttonType?: 'submit' | 'button';
};

type ButtonLinkProps = BaseProps & {
  href: string;
  target?: '_blank' | undefined;
};

type ButtonPlayProps = ButtonProps & {
  ariaLabel: '';
};

export type InterfaceButtonPropTypes = ButtonProps | ButtonLinkProps | ButtonPlayProps;

const classes = cva([styles.button], {
  variants: {
    colorTheme: {
      dark: [styles.dark],
      light: [styles.light],
    },
    style: {
      buttonPlay: [styles.buttonPlay],
      filled: [styles.buttonFilled],
      iconEnd: [styles.iconEnd],
      iconOnly: [styles.iconOnly],
      iconStart: [styles.iconStart],
      innerText: [styles.innerText],
      line: [styles.line],
      outlined: [styles.buttonOutlined],
      socialLink: [styles.socialLink],
      text: [styles.buttonText],
    },
  },
});

// TODOs
// - Integrate tracking events or necessary data attributes
// - Add support for loading state
// - Add support for visually hidden text for target _blank

export const Button = (props: InterfaceButtonPropTypes): React.JSX.Element => {
  const {
    ariaControls,
    ariaCurrent,
    ariaLabel,
    autoFocus,
    colorTheme,
    disabled,
    element,
    iconInlineEnd,
    iconInlineStart,
    popOverTarget,
    style,
    text,
    onClick,
  } = props;

  // Render the NextJS link element
  if (element === 'link') {
    if ('href' in props && 'target' in props) {
      const {
        href,
        target,
      } = props;

      return (
        <Link
          aria-current={ariaCurrent}
          aria-label={ariaLabel}
          className={classes({
            colorTheme,
            style,
          })}
          data-testid='link'
          href={href}
          target={target}
        >
          {iconInlineStart && (
            <span className={styles.iconStart}>
              <Icon name={iconInlineStart} className={`link__icon--${iconInlineStart}`} />
            </span>
          )}
          {text && (
            <span className={styles.innerText}>
              {text}
              <span className={styles.line}></span>
            </span>
          )}
          {iconInlineEnd && (
            <span className={styles.iconEnd}>
              <Icon name={iconInlineEnd} className={`link__icon--${iconInlineEnd}`} />
            </span>
          )
          }
        </Link >
      );
    }
  }

  // Render a proper button
  return (
    <button
      aria-current={ariaCurrent}
      aria-controls={ariaControls}
      aria-label={ariaLabel}
      autoFocus={autoFocus}
      className={classes({
        colorTheme,
        style,
      })}
      disabled={disabled}
      data-testid='button'
      onClick={onClick}
      popoverTarget={popOverTarget}
      type='button'
    >
      {iconInlineStart && (
        <span className={styles.iconStart}>
          <Icon name={iconInlineStart} className={`button__icon--${iconInlineStart}`} />
        </span>
      )}
      {text && (
        <span className={styles.innerText}>
          {text}
          <span className={styles.line}></span>
        </span>
      )}
      {iconInlineEnd && (
        <span className={styles.iconEnd}>
          <Icon name={iconInlineEnd} className={`button__icon--${iconInlineEnd}`} />
        </span>
      )}
    </button>
  );
};
