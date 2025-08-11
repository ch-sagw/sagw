'use client';

import {
  Select, useField,
} from '@payloadcms/ui';
import { JSX } from 'react';
import type { Option } from '@payloadcms/ui/elements/ReactSelect/';

interface InterfaceInternalLinkChooserClientPropsGroupedOptions {
  label: string;
  options: Option[];
}

interface InterfaceInternalLinkChooserClientProps {
  path: string;
  options: InterfaceInternalLinkChooserClientPropsGroupedOptions[];
}

const isGroupedOptions = (arr: Option[] | InterfaceInternalLinkChooserClientPropsGroupedOptions[]): arr is InterfaceInternalLinkChooserClientPropsGroupedOptions[] => arr.length > 0 && 'options' in arr[0];

const InternalLinkChooserClient = ({
  options, path,
}: InterfaceInternalLinkChooserClientProps): JSX.Element => {
  const {
    value, setValue,
  } = useField<string | null>({
    path,
  });

  const flatOptions = isGroupedOptions(options)
    ? options.flatMap((group) => group.options)
    : options;

  const selectedOption = flatOptions.find((opt) => opt.value === value) ?? undefined;

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
