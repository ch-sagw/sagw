import React from 'react';
import {
  Config, InterfaceStatusMessage,
} from '@/payload-types';
// import { Icon } from '@/icons';

export type InterfaceStatusMessagePropTypes = {
  pageLanguage: Config['locale'],
} & InterfaceStatusMessage;

export const StatusMessage = (props: InterfaceStatusMessagePropTypes): React.JSX.Element => {
  console.log(props);

  return (
    <p>some content</p>
  );

};

/*
export const StatusMessage = ({
  type,
  // title,
  // message,
  // optionalLink,
  // pageLanguage,
}: InterfaceStatusMessagePropTypes): React.JSX.Element => {
  let iconName;

  if (type === 'error') {
    iconName = 'errorFilled' as keyof typeof Icon;
  } else if (type === 'warn') {
    iconName = 'warningFilled' as keyof typeof Icon;
  } else if (type === 'success') {
    iconName = 'checkmarkFilled' as keyof typeof Icon;
  }

  return (
    <p>some content</p>
  );
};
*/
