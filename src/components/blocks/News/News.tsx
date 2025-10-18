import React from 'react';
import {
  EventsNewsList, InterfaceEventsNewsListPropTypes,
} from '@/components/base/EventsNewsList/EventsNewsList';
import {
  InterfaceNewsListItemPropTypes, NewsListItem,
} from '@/components/base/NewsListItem/NewsListItem';

export type InterfaceNewsPropTypes = Omit<
  InterfaceEventsNewsListPropTypes,
  'children'
> & {
  items: InterfaceNewsListItemPropTypes[];
};

export const News = ({
  items, title, type, allLink, pagination,
}: InterfaceNewsPropTypes): React.JSX.Element => {
  const listProps =
    type === 'overview'
      ? ({

        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        pagination: pagination!,
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
        title,
        type,
      } as const)
      : ({
        allLink,
        title,
        type,
      } as const);

  return (
    <EventsNewsList
      {...listProps}
    >
      {items.map((item, key) => (
        <NewsListItem
          key={key}
          {...item}
        />
      ))}
    </EventsNewsList>
  );
};
