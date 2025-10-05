import React from 'react';
import styles from '@/components/blocks/Rte/Rte.module.scss';
import { Rte as RteBaseComponent } from '@/components/base/Rte/Rte';
import { InterfaceRte } from '@/components/base/types/rte';

// We explicitly don't take InterfaceTextBlock, since we want explicit
// rte typing here
export type InterfaceRtePropTypes = {
  text: InterfaceRte
};

export const Rte = ({
  text,
}: InterfaceRtePropTypes): React.JSX.Element => (
  <div className={styles.textBlock}>
    <RteBaseComponent
      text={text}
      rteConfig='rte1'
      context='magazineDetailText'
    />
  </div>
);
