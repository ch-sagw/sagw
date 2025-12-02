import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/Breadcrumb/Breadcrumb.module.scss';
import { ColorMode } from '@/components/base/types/colorMode';
import { Icon } from '@/icons';
import { Button } from '@/components/base/Button/Button';
import { useTranslations } from 'next-intl';

export interface InterfaceBreadcrumbItem {
  link: string;
  text: string;
}

export type InterfaceBreadcrumbPropTypes = {
  colorMode: ColorMode;
  items: InterfaceBreadcrumbItem[] | undefined;
  className?: string;
};

export const Breadcrumb = ({
  colorMode,
  items,
  className,
}: InterfaceBreadcrumbPropTypes): React.JSX.Element | null => {
  const i18nA11y = useTranslations('a11y');

  const breadcrumbClasses = cva([
    styles.breadcrumb,
    className,
  ], {
    variants: {
      colorMode: {
        dark: [styles.dark],
        light: [styles.light],
        white: [styles.white],
      },
    },
  });

  if (!items || items.length < 1) {
    return null;
  }

  return (
    <div
      className={breadcrumbClasses({
        colorMode,
      })}
    >
      <Icon
        name='arrowLeft'
        className={styles.icon}
      />
      <p
        className={styles.hiddenLabel}
        id='breadcrumb-label'
      >{i18nA11y('breadcrumb')}</p>
      <ul
        aria-labelledby='breadcrumb-label'
        className={styles.content}
      >

        {items.map((item, index) => (
          <li
            className={styles.item}
            key={index}
          >
            {index !== 0 &&
              <Icon
                name='longDash'
                className={styles.separatorIcon}
              />
            }
            <Button
              className={styles.link}
              href={item.link}
              colorMode={colorMode}
              element='link'
              text={item.text}
              style='text'
              prefetch={true}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
