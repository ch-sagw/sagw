'use client';

import {
  Select, useField,
} from '@payloadcms/ui';
import { JSX } from 'react';
import type { Option } from '@payloadcms/ui/elements/ReactSelect/';

interface InterfaceInternalLinkChooserClientProps {
  path: string;
  options: Option[];
}

// Select component
const InternalLinkChooserClient = ({
  options, path,
}: InterfaceInternalLinkChooserClientProps): JSX.Element => {
  const {
    value, setValue,
  } = useField<Option | undefined>({
    path,
  });

  return (
    <Select
      options={options}
      value={value}
      onChange={(newValue) => {
        setValue(Array.isArray(newValue)
          ? null
          : newValue);
      }}
      isClearable
    />);
};

export default InternalLinkChooserClient;
