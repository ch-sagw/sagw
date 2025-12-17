import {
  InterfacePeopleOverviewBlock,
  Person,
} from '@/payload-types';
import React from 'react';
import { fetchTeam } from '@/data/fetch';
import { PeopleOverviewComponent } from '@/components/blocks/PeopleOverview/PeopleOverview.component';
import { getLocale } from 'next-intl/server';
import { TypedLocale } from 'payload';

export type InterfacePeopleOverviewPropTypes = {} & InterfacePeopleOverviewBlock;

export const PeopleOverview = async (props: InterfacePeopleOverviewPropTypes): Promise<React.JSX.Element | undefined> => {
  const locale = (await getLocale()) as TypedLocale;
  const {
    teams,
  } = props;

  const team = await fetchTeam({
    language: locale,
    team: teams,
  });

  if (!team) {
    return undefined;
  }

  // we're doing a fetch with depth 2, so we can
  // be sure we get the full objects back (including
  // image references), not just people id's.
  const people = team.people as Person[];

  return (
    <PeopleOverviewComponent
      team={team}
      people={people}
    />
  );
};
