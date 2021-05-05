import { useMemo } from 'react';
import type { UseQueryResult } from 'react-query';

import { useGetEventsByCreator } from '@/hooks/api/events';
import { useGetOrganizersByCreator } from '@/hooks/api/organizers';
import { useGetPlacesByCreator } from '@/hooks/api/places';
import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import type { User } from '@/types/User';
import { List } from '@/ui/List';
import { Page } from '@/ui/Page';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';

type DashboardOptions = 'events' | 'places' | 'organizers';

type Props = { activeTab: DashboardOptions };

const GetEventsByCreatorMap = {
  events: useGetEventsByCreator,
  places: useGetPlacesByCreator,
  organizers: useGetOrganizersByCreator,
};

const DashboardPage = ({ activeTab }: Props) => {
  const { cookies } = useCookiesWithOptions(['user']);

  const useGetEventsByCreator = useMemo(
    () => GetEventsByCreatorMap[activeTab],
    [activeTab],
  );

  const user: User = cookies.user;

  const UseGetEventsByCreatorQuery = useGetEventsByCreator({
    creator: { id: user.id, email: user.email },
  }) as UseQueryResult<void, unknown>; // TODO: remove cast

  console.log(UseGetEventsByCreatorQuery.data);

  return (
    <Page>
      <Page.Title>Welkom {user?.username}</Page.Title>
      <Page.Content spacing={5}>
        <Stack spacing={3}>
          <Text>Mijn activiteiten en locaties</Text>
          <List>
            <List.Item>
              <Text>Test</Text>
            </List.Item>
          </List>
        </Stack>
      </Page.Content>
    </Page>
  );
};

export { DashboardPage };
