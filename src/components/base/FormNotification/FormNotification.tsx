import React, {
  useEffect, useId, useRef,
} from 'react';
import { cva } from 'cva';
import { Icon } from '@/icons';
import styles from '@/components/base/FormNotification/FormNotification.module.scss';
import { ColorMode } from '@/components/base/types/colorMode';

type BaseNotification = {
  type: 'success' | 'error';
  title: string;
  text: string;
  colorMode: ColorMode;
  autofocus?: boolean;
};

type ActionProps =
  | { actionText: string; onAction: () => void }
  | { actionText?: undefined; onAction?: undefined };

export type InterfaceFormNotificationPropTypes = BaseNotification & ActionProps;

export const FormNotification = ({
  type,
  title,
  text,
  actionText,
  onAction,
  colorMode,
  autofocus,
}: InterfaceFormNotificationPropTypes): React.JSX.Element => {
  const elementRef = useRef<HTMLButtonElement | HTMLDivElement>(null);
  const notificationId = useId();
  const sampleClasses = cva([styles.formNotification], {
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
      type: {
        error: [styles.error],
        success: [styles.success],
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

  const iconName = type === 'error'
    ? 'errorFilled'
    : 'checkmarkFilled';

  return (
    <WrapperElem
      ref={elementRef as React.Ref<HTMLButtonElement & HTMLDivElement>}
      className={sampleClasses({
        action: Boolean(actionText),
        colorMode,
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
    >
      <Icon
        className={styles.icon}
        name={iconName}
      />

      <div id={notificationId}>
        <p className={styles.title}>{title}</p>
        <p className={styles.text}>{text}</p>
        {actionText &&
          <p className={styles.button}>{actionText}</p>
        }
      </div>
    </WrapperElem>
  );
};
