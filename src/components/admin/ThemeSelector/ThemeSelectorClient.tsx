'use client';

import React, { JSX } from 'react';
import {
  FieldLabel,
  Select,
  useField,
} from '@payloadcms/ui';
import type { Option } from '@payloadcms/ui/elements/ReactSelect/';

interface InterfaceThemeSelectorClientProps {
  options: Option[];
  path: string;
}

const InternalLinkChooserClient = ({
  options,
  path,
}: InterfaceThemeSelectorClientProps): JSX.Element => {

  const {
    value,
    setValue,
  } = useField<string | null>({
    path,
  });

  const selectedOption = options.find((opt) => opt.value === value) ?? undefined;

  return (
    <div>
      <FieldLabel
        label='Color Theme'
        htmlFor={`field-${path}`}
      />
      <Select
        options={options}
        inputId={`field-${path}`}
        value={selectedOption}
        isClearable={false}
        onChange={(newValue): void => {
          if (!newValue || Array.isArray(newValue)) {
            return;
          }

          setValue(newValue.value);
        }}
      />
    </div>
  );
};

export default InternalLinkChooserClient;
