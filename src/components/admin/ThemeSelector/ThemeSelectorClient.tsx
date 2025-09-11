'use client';

import React, { JSX } from 'react';
import {
  FieldLabel,
  Select,
  useField,
} from '@payloadcms/ui';
import type { Option } from '@payloadcms/ui/elements/ReactSelect/';
import type { ThemeOption } from '@/components/admin/ThemeSelector/Themes';
import {
  components, type OptionProps, type SingleValueProps,
} from 'react-select';

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

  const ThemeOptionLabel = ({
    label, colors,
  }: { label: unknown; colors: string[] }): JSX.Element => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      gap: '1rem',
      padding: '.5rem',
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'nowrap',
        gap: '1rem',
      }}>
        {colors.map((c, i) => (
          <div
            key={i}
            style={{
              backgroundColor: c,
              border: '1px solid #ccc',
              borderRadius: '50%',
              flexBasis: '2rem',
              height: '2rem',
            }}
          />
        ))}
      </div>
      <span style={{
        fontWeight: 'bold',
      }}>{String(label)}</span>
    </div>
  );

  const ColorOption = (props: OptionProps<ThemeOption>): JSX.Element => (
    <components.Option {...props}>
      <ThemeOptionLabel label={props.data.label} colors={props.data.colors} />
    </components.Option>
  );

  const ColorSingleValue = (props: SingleValueProps<ThemeOption>): JSX.Element => (
    <components.SingleValue {...props}>
      <ThemeOptionLabel label={props.data.label} colors={props.data.colors} />
    </components.SingleValue>
  );

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
        components={{
          Option: ColorOption,
          SingleValue: ColorSingleValue,
        }}
      />
    </div>
  );
};

export default InternalLinkChooserClient;
