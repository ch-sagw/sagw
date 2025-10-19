import React from 'react';
import { cva } from 'cva';
import styles from '@/components/base/EventsNewsList/EventsNewsList.module.scss';
import { Button } from '@/components/base/Button/Button';
import { Pagination } from '@/components/base/Pagination/Pagination';
import { Icon } from '@/icons';
import { ColorMode } from '@/components/base/types/colorMode';

interface InterfaceBaseProps {
  children: React.ReactNode;
  title: string;
  colorMode: ColorMode;
}

interface InterfaceTeaserProps extends InterfaceBaseProps {
  type: 'teaser';
  allLink?: {
    text: string;
    href: string;
  };
  pagination?: never;
}

interface InterfaceOverviewProps extends InterfaceBaseProps {
  type: 'overview';
  pagination: {
    totalPages: number;
    currentPage: number;
    paginationTitle: string;
    onPageChange?: (page: number) => void;
  };
  allLink?: never;
}

export type InterfaceEventsNewsListPropTypes = InterfaceTeaserProps | InterfaceOverviewProps;

const sectionClasses = cva([styles.eventsNewsList], {
  variants: {
    colorMode: {
      dark: undefined,
      light: [styles.light],
      white: undefined,
    },
    type: {
      overview: [styles.overview],
      teaser: [styles.teaser],
    },
  },
});

export const EventsNewsList = (props: InterfaceEventsNewsListPropTypes): React.JSX.Element => {
  const {
    title,
    type,
    colorMode,
  } = props;

  return (
    <section
      className={sectionClasses({
        colorMode,
        type,
      })}
    >
      <h2 className={styles.title}>{title}</h2>

      <ul className={styles.list}>
        {props.children}
      </ul>

      {type === 'teaser' && props.allLink &&
        <Button
          style='text'
          colorMode={colorMode}
          element='link'
          href={props.allLink.href}
          className={styles.allLink}
          text={props.allLink.text}
          iconInlineStart={'arrowRight' as keyof typeof Icon}
        />
      }

      {type === 'overview' &&
        <Pagination
          className={styles.pagination}
          totalPages={props.pagination.totalPages}
          currentPage={props.pagination.currentPage}
          paginationTitle={props.pagination.paginationTitle}
          onPageChange={props.pagination.onPageChange}
        />
      }
      <span className={styles.line} />
    </section>
  );
};
