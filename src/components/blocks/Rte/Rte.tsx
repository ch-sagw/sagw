import React from 'react';
import styles from '@/components/blocks/Rte/Rte.module.scss';
import { InterfaceRte } from '@/components/base/types/rte';
import { SafeHtml } from '@/components/base/SafeHtml/SafeHtml';
import { rte3ToHtml } from '@/utilities/rteToHtml';

// We explicitly don't take InterfaceTextBlock, since we want explicit
// rte typing here
export type InterfaceRtePropTypes = {
  text: InterfaceRte
};

export const Rte = ({
  text,
}: InterfaceRtePropTypes): React.JSX.Element => (
  <div className={styles.textBlock}>
    <SafeHtml
      as='div'
      html={rte3ToHtml(text)}
    />
  </div>
);
