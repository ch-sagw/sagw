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

const InternalLinkChooserClient = ({
  options, path,
}: InterfaceInternalLinkChooserClientProps): JSX.Element => {
  const {
    value, setValue,
  } = useField<string | null>({
    path,
  });

  const selectedOption = options.find((opt) => opt.value === value) ?? undefined;

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={(newValue) => {
        if (!newValue || Array.isArray(newValue)) {
          setValue(null);
        } else {
          setValue(newValue.value as string);
        }
      }}
      isClearable
    />);
};

export default InternalLinkChooserClient;
