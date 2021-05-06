import { useMemo, useState } from 'react';
import type { UseQueryResult } from 'react-query';

import { QueryStatus } from '@/hooks/api/authenticated-query';
import { useGetEventsByCreator } from '@/hooks/api/events';
import { useGetOrganizersByCreator } from '@/hooks/api/organizers';
import { useGetPlacesByCreator } from '@/hooks/api/places';
import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import type { User } from '@/types/User';
import { List } from '@/ui/List';
import { Page } from '@/ui/Page';
import { Spinner } from '@/ui/Spinner';
import { Stack } from '@/ui/Stack';
import { Tabs } from '@/ui/Tabs';
import { Text } from '@/ui/Text';

type TabOptions = 'events' | 'places' | 'organizers';

type Props = { activeTab: TabOptions };

const GetEventsByCreatorMap = {
  events: useGetEventsByCreator,
  places: useGetPlacesByCreator,
  organizers: useGetOrganizersByCreator,
};

type EventProps = {
  events: unknown[];
  loading: boolean;
};

const Events = ({ events, loading }: EventProps) => {
  if (loading) {
    return <Spinner marginTop={4} />;
  }

  return (
    <List>
      {events.map((event) => (
        <List.Item key={event['@id']}>{event['@id']}</List.Item>
      ))}
    </List>
  );
};

Events.defaultProps = {
  loading: false,
};

const DashboardPage = ({ activeTab: initialActiveTab }: Props) => {
  const { cookies } = useCookiesWithOptions(['user']);
  const [activeTab, setActiveTab] = useState(initialActiveTab);

  const useGetEventsByCreator = useMemo(
    () => GetEventsByCreatorMap[activeTab],
    [activeTab],
  );

  const handleSelectTab = (eventKey: TabOptions) => {
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
  }) as UseQueryResult<{ member: unknown[] }, unknown>; // TODO: remove cast

  const events = UseGetEventsByCreatorQuery.data?.member ?? [];

  return (
    <Page>
      <Page.Title>Welkom {user?.username}</Page.Title>
      <Page.Content spacing={5}>
        <Stack spacing={3}>
          <Text>Mijn activiteiten, locaties en organisaties</Text>
          <Tabs activeKey={activeTab} onSelect={handleSelectTab}>
            <Tabs.Tab eventKey="events" title="Events">
              <Events
                events={events}
                loading={
                  UseGetEventsByCreatorQuery.status === QueryStatus.LOADING
                }
              />
            </Tabs.Tab>
            <Tabs.Tab eventKey="places" title="Places">
              <Events
                events={events}
                loading={
                  UseGetEventsByCreatorQuery.status === QueryStatus.LOADING
                }
              />
            </Tabs.Tab>
            <Tabs.Tab eventKey="organizers" title="Organizers">
              <Events
                events={events}
                loading={
                  UseGetEventsByCreatorQuery.status === QueryStatus.LOADING
                }
              />
            </Tabs.Tab>
          </Tabs>
        </Stack>
      </Page.Content>
    </Page>
  );
};

export { DashboardPage };
