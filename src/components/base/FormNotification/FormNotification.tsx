import React from 'react';
import { cva } from 'cva';
import { Icon } from '@/icons';
import styles from '@/components/base/FormNotification/FormNotification.module.scss';

type BaseNotification = {
  type: 'success' | 'error';
  title: string;
  text: string;
  colorMode: 'white' | 'dark';
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
}: InterfaceFormNotificationPropTypes): React.JSX.Element => {
  const sampleClasses = cva([styles.formNotification], {
    variants: {
      action: {
        false: undefined,
        true: [styles.isButton],
      },
      colorMode: {
        dark: [styles.dark],
        white: [styles.white],
      },
      type: {
        error: [styles.error],
        success: [styles.success],
      },
    },
  });

  const WrapperElem: React.ElementType = actionText
    ? 'button'
    : 'div';

  const iconName = type === 'error'
    ? 'errorFilled'
    : 'checkmarkFilled';

  return (
    <WrapperElem
      className={sampleClasses({
        action: Boolean(actionText),
        colorMode,
        type,
      })}
      onClick={onAction ?? undefined}
    >
      <Icon
        className={styles.icon}
        name={iconName}
      />
      <p className={styles.title}>{title}</p>
      <p className={styles.text}>{text}</p>
      {actionText &&
        <p className={styles.button}>{actionText}</p>
      }
    </WrapperElem>
  );
};
