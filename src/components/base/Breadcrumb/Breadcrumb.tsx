import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/Breadcrumb/Breadcrumb.module.scss';
import { ColorMode } from '@/components/base/types/colorMode';
import { Icon } from '@/icons';
import { Button } from '@/components/base/Button/Button';
import { useTranslations } from 'next-intl';
import type {
  BreadcrumbList,
  WithContext,
} from 'schema-dts';

export interface InterfaceBreadcrumbItem {
  link: string;
  text: string;
}

export type InterfaceBreadcrumbPropTypes = {
  colorMode: ColorMode;
  items: InterfaceBreadcrumbItem[] | undefined;
  className?: string;
};

const constructStructuredData = ({
  items,
}: InterfaceBreadcrumbPropTypes): WithContext<BreadcrumbList> => {
  const breadCrumbItems = items?.slice(1);

  const data: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadCrumbItems?.map((item, index) => ({
      '@type': 'ListItem',
      'item': item.link,
      'name': item.text,
      'position': index + 1,
    })),
  };

  return data;
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
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          /* eslint-disable @typescript-eslint/naming-convention */
          __html: JSON.stringify(constructStructuredData({
            className,
            colorMode,
            items,
          })),
          /* eslint-enmdisable @typescript-eslint/naming-convention */
        }}
      />
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
              <Button
                className={styles.link}
                href={item.link}
                colorMode={colorMode}
                element='link'
                text={item.text}
                style='text'
                prefetch={true}
              />
              {index < items.length - 1 && (
                <Icon
                  name='longDash'
                  className={styles.separatorIcon}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
