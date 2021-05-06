import { useMemo, useState } from 'react';
import type { UseQueryResult } from 'react-query';

import { useGetEventsByCreator } from '@/hooks/api/events';
import { useGetOrganizersByCreator } from '@/hooks/api/organizers';
import { useGetPlacesByCreator } from '@/hooks/api/places';
import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import type { User } from '@/types/User';
// import { List } from '@/ui/List';
import { Page } from '@/ui/Page';
import { Stack } from '@/ui/Stack';
import { Tabs } from '@/ui/Tabs';
import { Text } from '@/ui/Text';

type DashboardOptions = 'events' | 'places' | 'organizers';

type Props = { activeTab: DashboardOptions };

const GetEventsByCreatorMap = {
  events: useGetEventsByCreator,
  places: useGetPlacesByCreator,
  organizers: useGetOrganizersByCreator,
};

const DashboardPage = ({ activeTab: initialActiveTab }: Props) => {
  const { cookies } = useCookiesWithOptions(['user']);
  const [activeTab, setActiveTab] = useState(initialActiveTab);

  const useGetEventsByCreator = useMemo(
    () => GetEventsByCreatorMap[activeTab],
    [activeTab],
  );

  const handleSelectTab = (eventKey: DashboardOptions) => {
    setActiveTab(eventKey);
    // change the url to match the tab, but don't trigger a refresh
    window.history.pushState(
      undefined,
      '',
      `${window.location.protocol}//${window.location.host}/${eventKey}`,
    );
  };

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
          <Text>Mijn activiteiten, locaties en organisaties</Text>
          <Tabs activeKey={activeTab} onSelect={handleSelectTab}>
            <Tabs.Tab eventKey="events" title="Events">
              <Text>EVENTS</Text>
            </Tabs.Tab>
            <Tabs.Tab eventKey="places" title="Places">
              <Text>PLACES</Text>
            </Tabs.Tab>
            <Tabs.Tab eventKey="organizers" title="Organizers">
              <Text>ORGANIZERS</Text>
            </Tabs.Tab>
          </Tabs>
        </Stack>
      </Page.Content>
    </Page>
  );
};

export { DashboardPage };
