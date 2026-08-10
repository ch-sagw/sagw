import 'server-only';
import {
  InterfacePeopleOverviewBlock,
  Person,
} from '@/payload-types';
import React from 'react';
import { fetchTeam } from '@/data/fetch';
import { PeopleOverviewComponent } from '@/components/blocks/PeopleOverview/PeopleOverview.component';
import { resolveMailto } from '@/app/actions/resolveMailto';
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
  //
  // The mail address is stripped here so it never reaches the client
  // (it would otherwise be part of the RSC payload); it is resolved on
  // click via the resolveMailto server action.
  const people = (team.people as Person[]).map(({
    mail,
    ...person
  }) => ({
    ...person,
    hasMail: Boolean(mail),
  }));

  return (
    <PeopleOverviewComponent
      team={team}
      people={people}
      resolveMailtoAction={resolveMailto}
    />
  );
};
