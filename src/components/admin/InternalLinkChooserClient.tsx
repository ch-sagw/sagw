'use client';

import React from 'react';
import { Select } from '@payloadcms/ui';
import type { Option } from '@payloadcms/ui/elements/ReactSelect/';

interface InternalLinkChooserClientProps {
  options: Option[];
  value?: Option | Option[];
  onChange?: (value: Option | Option[] | undefined) => void;
}

const InternalLinkChooserClient: React.FC<InternalLinkChooserClientProps> = ({
  options,
  value,
  onChange,
}) => {

  const handleChange = (selectedOption: Option | Option[] | null) => {
    if (onChange) {
      onChange(selectedOption ?? undefined);
    }
  };

  return (
    <Select
      options={options}
      value={value}
      onChange={handleChange}
      isClearable
    />
  );
};

export default InternalLinkChooserClient;
