import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/KeyVisual/KeyVisual.module.scss';
import { Icon } from '@/icons';

export type InterfaceKeyVisualPropTypes = {
  animation: boolean;
  className?: string;
};

const keyVisualClasses = cva([styles.keyVisual], {
  variants: {
    animation: {
      false: [styles.static],
      true: [styles.animated],
    },
  },
});

export const KeyVisual = ({
  animation,
  className,
}: InterfaceKeyVisualPropTypes): React.JSX.Element => (
  <div className={keyVisualClasses({
    animation,
    className,
  })}>
    <div className={styles.keyVisualVertical}>
      <div className={styles.keyVisualVerticalSvgs}>
        <Icon className={styles.keyVisualVerticalInner} name='verticalInner' />
        <Icon className={styles.keyVisualVerticalMiddle} name='verticalMiddle' />
        <Icon className={styles.keyVisualVerticalOuter} name='verticalOuter' />
      </div>
    </div>
    <div className={styles.keyVisualHorizontal}>
      <div className={styles.keyVisualHorizontalSvgs}>
        <Icon className={styles.keyVisualHorizontalInner} name='horizontalInner' />
        <Icon className={styles.keyVisualHorizontalMiddle} name='horizontalMiddle' />
        <Icon className={styles.keyVisualHorizontalOuter} name='horizontalOuter' />
      </div>
    </div>
  </div>
);
