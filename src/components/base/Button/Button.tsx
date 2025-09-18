import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/Button/Button.module.scss';
import { Icon } from '@/icons';
import Link from 'next/link';

type BaseProps = {
  colorTheme: 'light' | 'dark';
  iconInlineStart?: string;
  iconInlineEnd?: string;
  type: 'button' | 'link';
  style: 'filled' | 'outlined' | 'text';
  text: string;
};

type ButtonProps = BaseProps & {
  ariaHasPopUp: boolean,
};

type ButtonLinkProps = BaseProps & {
  href: string;
  target: '_blank' | '_self';
};

export type InterfaceButtonPropTypes = ButtonProps | ButtonLinkProps;

const classes = cva([styles.button], {
  variants: {
    colorTheme: {
      dark: [styles.dark],
      light: [styles.light],
    },
    style: {
      filled: [styles.buttonFilled],
      iconEnd: [styles.iconEnd],
      iconStart: [styles.iconStart],
      innerText: [styles.innerText],
      line: [styles.line],
      outlined: [styles.buttonOutlined],
      text: [styles.buttonText],
    },
  },
});

// TODOs
// - Integrate tracking
// - Add support for disabled state
// - Add support for loading state
// - Add support for visually hidden text for target _blank

export const Button = (props: InterfaceButtonPropTypes): React.JSX.Element => {
  const {
    colorTheme,
    iconInlineEnd,
    iconInlineStart,
    type,
    style,
    text,
  } = props;

  // Render the NextJS link element
  if (type === 'link') {
    if ('href' in props && 'target' in props) {
      const {
        href,
        target,
      } = props;

      return (
        <Link
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
              <Icon name={iconInlineStart} />
            </span>
          )}
          <span className={styles.innerText}>
            {text}
            <span className={styles.line}></span>
          </span>
          {iconInlineEnd && (
            <span className={styles.iconEnd}>
              <Icon name={iconInlineEnd} />
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
      className={classes({
        colorTheme,
        style,
      })}
      data-testid='button'
      type='button'
    >
      {iconInlineStart && (
        <span className={styles.iconStart}>
          <Icon name={iconInlineStart} />
        </span>
      )}
      <span className={styles.innerText}>
        {text}
        <span className={styles.line}></span>
      </span>
      {iconInlineEnd && (
        <span className={styles.iconEnd}>
          <Icon name={iconInlineEnd} />
        </span>
      )}
    </button>
  );
};
