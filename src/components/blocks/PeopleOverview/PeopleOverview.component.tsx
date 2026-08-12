'use client';

import {
  Person, Team,
} from '@/payload-types';
import React, { useState } from 'react';
import styles from '@/components/blocks/PeopleOverview/PeopleOverview.module.scss';
import {
  GenericTeaser, InterfaceGenericTeaserLink,
} from '@/components/base/GenericTeaser/GenericTeaser';
import { rteToHtml } from '@/utilities/rteToHtml';
import { personDisplayNameHtml } from '@/utilities/personDisplayName';
import { GenericOverview } from '@/components/base/GenericOverview/GenericOverview';
import {
  InterfaceResolveMailtoAction, openMailto,
} from '@/components/helpers/writeEmail';
import { useTranslations } from 'next-intl';

// The mail address is stripped server-side (PeopleOverview.tsx) so it
// never reaches the client; hasMail drives the "write email" button.
export type InterfacePeopleOverviewPerson = Omit<Person, 'mail'> & {
  hasMail?: boolean;
};

export type InterfacePeopleOverviewComponentPropTypes = {
  team: Team;
  people: InterfacePeopleOverviewPerson[];
  // The resolveMailto server action, passed down from the server
  // component. This module must not import the action itself, because
  // it is rendered in Storybook where 'use server' modules cannot be
  // bundled.
  resolveMailtoAction?: InterfaceResolveMailtoAction;
};

export const PeopleOverviewComponent = ({
  people,
  resolveMailtoAction,
}: InterfacePeopleOverviewComponentPropTypes): React.JSX.Element => {
  const internalI18nContact = useTranslations('contact');

  // Id of the person whose email address is currently being resolved,
  // used for the loading state of the respective "write email" button.
  const [
    loadingPersonId,
    setLoadingPersonId,
  ] = useState<string | null>(null);

  const handleMailClick = async (personId: string): Promise<void> => {
    setLoadingPersonId(personId);

    try {
      await openMailto({
        action: resolveMailtoAction,
        input: {
          personId,
          source: 'person',
        },
      });
    } finally {
      setLoadingPersonId(null);
    }
  };

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

    if (item.hasMail) {
      links.push({
        isLoading: loadingPersonId === item.id,
        onClick: (): Promise<void> => handleMailClick(item.id),
        text: internalI18nContact('writeEmail'),
        type: 'mail',
      });
    }

    return (
      <GenericTeaser
        className={styles.item}
        key={item.id}
        title={personDisplayNameHtml(item) ?? item.fullName}
        titleLevel={2}
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
