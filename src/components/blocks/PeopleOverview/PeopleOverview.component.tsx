'use client';

import {
  Person, Team,
} from '@/payload-types';
import React from 'react';
import styles from '@/components/blocks/PeopleOverview/PeopleOverview.module.scss';
import {
  GenericTeaser, InterfaceGenericTeaserLink,
} from '@/components/base/GenericTeaser/GenericTeaser';
import { rteToHtml } from '@/utilities/rteToHtml';
import { GenericOverview } from '@/components/base/GenericOverview/GenericOverview';

export type InterfacePeopleOverviewComponentPropTypes = {
  team: Team;
  people: Person[];
};

export const PeopleOverviewComponent = ({
  people,
}: InterfacePeopleOverviewComponentPropTypes): React.JSX.Element => {
  const allItems = people.map((item) => {
    if (!item.fullName) {
      return undefined;
    }

    const links: InterfaceGenericTeaserLink[] = [];

    if (item.phone) {
      links.push({
        href: `tel:${item.phone}`,
        text: item.phone,
        type: 'phone',
      });
    }

    if (item.mail) {
      links.push({
        href: `mailto:${item.mail}`,
        text: item.mail,
        type: 'phone',
      });
    }

    return (
      <GenericTeaser
        className={styles.item}
        key={item.id}
        title={item.fullName}
        texts={[rteToHtml(item.function)]}
        links={links}
        type='people'
        image={item.image && typeof item.image === 'object'
          ? item.image
          : undefined
        }
      />
    );
  });

  return (
    <GenericOverview
      showPagination={false}
    >
      {allItems}
    </GenericOverview>
  );
};
