import React from 'react';
import styles from '@/components/blocks/Rte/Rte.module.scss';
import { InterfaceTextBlock } from '@/payload-types';
import { Rte as RteBaseComponent } from '@/components/base/Rte/Rte';

export type InterfaceRtePropTypes = {} & InterfaceTextBlock;

export const Rte = ({
  text,
}: InterfaceRtePropTypes): React.JSX.Element => (
  <div className={styles.textBlock}>
    <RteBaseComponent
      text={text.content}
      rteConfig='rte1'
      context='magazineDetailText'
    />
  </div>
);
