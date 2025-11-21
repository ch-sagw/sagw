import {
  Config, InterfacePeopleOverviewBlock,
  Person,
} from '@/payload-types';
import React from 'react';
import { fetchTeam } from '@/data/fetch';
import { PeopleOverviewComponent } from '@/components/blocks/PeopleOverview/PeopleOverview.component';

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

  return (
    <PeopleOverviewComponent
      team={team}
      people={people}
      language={language}
    />
  );
};
