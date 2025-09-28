import React from 'react';
import styles from '@/components/global/Navigation/Navigation.module.scss';
import { InterfaceNavigation } from '@/payload-types';

export type InterfaceNavigationPropTypes = {} & InterfaceNavigation;

export const Navigation = ({
  navItems,
}: InterfaceNavigationPropTypes): React.JSX.Element => (
  <ul className={styles.navigation}>
    {navItems.map((item) => <li key={item.id}>{item.navItemText}</li>)}
  </ul>
);
