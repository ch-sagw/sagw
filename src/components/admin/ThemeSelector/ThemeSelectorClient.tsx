'use client';

import Image from 'next/image';
import React, { JSX } from 'react';
import {
  FieldLabel,
  Select,
  useField,
} from '@payloadcms/ui';
import {
  components, type OptionProps, type SingleValueProps,
} from 'react-select';
import type { InterfaceThemeOption } from '@/components/admin/ThemeSelector/Themes';
import styles from '@/components/admin/ThemeSelector/styles.module.scss';

interface InterfaceThemeSelectorClientProps {
  options: InterfaceThemeOption[];
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

  const selectedOption = options.find((opt) => opt.value === value);

  const ThemeOptionLabel = ({
    label, colors,
  }: { label: unknown; colors: string[] }): JSX.Element => (
    <div className={styles.optionRow}>
      <div className={styles.colors}>
        {colors.map((c, i) => (
          <div
            key={i}
            className={styles.color}
            style={{
              backgroundColor: c,
            }}
          />
        ))}
      </div>
      <span className={styles.label}>{String(label)}</span>
    </div>
  );

  const ColorOption = (props: OptionProps<InterfaceThemeOption>): JSX.Element => (
    <components.Option {...props}>
      <ThemeOptionLabel label={props.data.label} colors={props.data.colors} />
    </components.Option>
  );

  const ColorSingleValue = (props: SingleValueProps<InterfaceThemeOption>): JSX.Element => (
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
        options={options as unknown as any[]}
        inputId={`field-${path}`}
        value={selectedOption as any}
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

      {(selectedOption) && (
        <div
          className={styles.preview}
          data-testid='image'
        >
          <span className={styles.previewText}>Preview:</span>
          <Image
            className={styles.image}
            src={selectedOption.image}
            alt={`Theme preview for ${selectedOption.label}`}
            width={600}
            height={400}
          />
        </div>
      )}
    </div>
  );
};

export default InternalLinkChooserClient;
