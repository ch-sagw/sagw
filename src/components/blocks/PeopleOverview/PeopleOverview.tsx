import {
  Config, InterfacePeopleOverviewBlock,
  Person,
} from '@/payload-types';
import React from 'react';
import { fetchTeam } from '@/data/fetch';
import {
  GenericTeaser, InterfaceGenericTeaserLink,
} from '@/components/base/GenericTeaser/GenericTeaser';
import { GenericOverview } from '@/components/base/GenericOverview/GenericOverview';
import styles from '@/components/blocks/PeopleOverview/PeopleOverview.module.scss';
import { rteToHtml } from '@/utilities/rteToHtml';

export type InterfacePeopleOverviewPropTypes = {
  language: Config['locale'];
} & InterfacePeopleOverviewBlock;

export const PeopleOverview = async (props: InterfacePeopleOverviewPropTypes): Promise<React.JSX.Element | undefined> => {
  const {
    language,
    teams,
  } = props;

  const team = await fetchTeam({
    language,
    team: teams,
  });

  if (!team) {
    return undefined;
  }

  // we're doing a fetch with depth 1, so we can be sure we get the full
  // objects back, not just people id's.
  const people = team.people as Person[];

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
        texts={[
          rteToHtml(team.name),
          rteToHtml(item.function),
        ]}
        links={links}
        pageLanguage={language}
        type='people'
        image={typeof item.image === 'object'
          ? item.image?.id
          : item.image
        }
      />
    );
  });

  return (
    <GenericOverview
      showPagination={false}
      language={language}
    >
      {allItems}
    </GenericOverview>
  );
};
