'use client';

import React, {
  useEffect, useId, useRef,
} from 'react';
import { cva } from 'cva';
import { Icon } from '@/icons';
import styles from '@/components/base/Notification/Notification.module.scss';
import { ColorMode } from '@/components/base/types/colorMode';
import { SafeHtml } from '../SafeHtml/SafeHtml';
import { Button } from '@/components/base/Button/Button';
import { Config } from '@/payload-types';

type BaseNotification = {
  type: 'success' | 'error' | 'warn';
  title?: string;
  text: string;
  colorMode: ColorMode;
  autofocus?: boolean;
  className?: string;
  hideBorder?: boolean;
  hideIcon?: boolean;
};

type ActionProps =
  | {
    actionText: string;
    onAction: () => void
  }
  | {
    actionText?: undefined;
    onAction?: undefined
  };

type LinkProps =
  | {
    linkHref: string;
    linkText: string;
    pageLanguage: Config['locale'];
  }
  | {
    linkHref?: undefined;
    linkText?: undefined;
    pageLanguage?: undefined;
  }

export type InterfaceNotificationPropTypes = BaseNotification & ActionProps & LinkProps;

export const Notification = ({
  type,
  title,
  text,
  actionText,
  onAction,
  colorMode,
  autofocus,
  className,
  hideBorder,
  linkHref,
  linkText,
  pageLanguage,
  hideIcon,
}: InterfaceNotificationPropTypes): React.JSX.Element => {
  const elementRef = useRef<HTMLButtonElement | HTMLDivElement>(null);
  const notificationId = useId();
  const notifcationClasses = cva([
    styles.notification,
    className,
  ], {
    variants: {
      action: {
        false: undefined,
        true: [styles.isButton],
      },
      colorMode: {
        dark: [styles.dark],
        light: [styles.white],
        white: [styles.white],
      },
      hideBorder: {
        false: undefined,
        true: [styles.borderless],
      },
      type: {
        error: [styles.error],
        success: [styles.success],
        warn: [styles.warn],
      },
    },
  });

  useEffect(() => {
    if (autofocus && elementRef.current) {
      elementRef.current.focus();
    }
  }, [autofocus]);

  const WrapperElem: React.ElementType = actionText
    ? 'button'
    : 'div';

  let iconName;

  if (type === 'error') {
    iconName = 'errorFilled' as keyof typeof Icon;
  } else if (type === 'warn') {
    iconName = 'warningFilled' as keyof typeof Icon;
  } else if (type === 'success') {
    iconName = 'checkmarkFilled' as keyof typeof Icon;
  }

  return (
    <WrapperElem
      ref={elementRef as React.Ref<HTMLButtonElement & HTMLDivElement>}
      className={notifcationClasses({
        action: Boolean(actionText),
        colorMode,
        hideBorder,
        type,
      })}
      onClick={onAction ?? undefined}
      role={actionText
        ? undefined
        : 'alert'
      }
      aria-labelledby={actionText
        ? notificationId
        : undefined
      }
      type={WrapperElem === 'button'
        ? 'button'
        : undefined
      }
    >
      {iconName && !hideIcon &&
        <Icon
          className={styles.icon}
          name={iconName}
        />
      }

      <div id={notificationId}>
        {title &&
          <SafeHtml
            className={styles.title}
            as='p'
            html={title}
          />
        }

        <SafeHtml
          className={styles.text}
          as='div'
          html={text}
        />

        {actionText &&
          <SafeHtml
            className={styles.button}
            as='p'
            html={actionText}
          />
        }

        {(!actionText && (linkHref && linkText && pageLanguage)) &&
          <Button
            className={styles.bottomLink}
            element='link'
            href={linkHref}
            colorMode='white'
            style='text'
            text={linkText}
            pageLanguage={pageLanguage}
            iconInlineStart={'arrowRight' as keyof typeof Icon}
            prefetch={true}
          />
        }
      </div>
    </WrapperElem>
  );
};
