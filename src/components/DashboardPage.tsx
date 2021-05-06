import { useMemo, useState } from 'react';
import type { UseQueryResult } from 'react-query';
import { css, ThemeProps } from 'styled-components';

import { QueryStatus } from '@/hooks/api/authenticated-query';
import { useGetEventsByCreator } from '@/hooks/api/events';
import { useGetOrganizersByCreator } from '@/hooks/api/organizers';
import { useGetPlacesByCreator } from '@/hooks/api/places';
import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import type { Event } from '@/types/Event';
import { isEvents } from '@/types/Event';
import type { User } from '@/types/User';
import { List } from '@/ui/List';
import { Page } from '@/ui/Page';
import { Spinner } from '@/ui/Spinner';
import { Stack } from '@/ui/Stack';
import { Tabs } from '@/ui/Tabs';
import { Text } from '@/ui/Text';
import { getValueFromTheme, Theme } from '@/ui/theme';

type TabOptions = 'events' | 'places' | 'organizers';

type Props = { activeTab: TabOptions };

const getValue = getValueFromTheme('productionItem');

const GetEventsByCreatorMap = {
  events: useGetEventsByCreator,
  places: useGetPlacesByCreator,
  organizers: useGetOrganizersByCreator,
};

type EventProps = {
  events: Event[];
  loading: boolean;
};

const Events = ({ events, loading }: EventProps) => {
  if (loading) {
    return <Spinner marginTop={4} />;
  }

  return (
    <List marginTop={4}>
      {events.map((event, index) => (
        <List.Item
          key={event['@id']}
          paddingLeft={4}
          paddingRight={4}
          paddingBottom={3}
          paddingTop={3}
          backgroundColor={getValue('backgroundColor')}
          cursor="pointer"
          css={
            index !== events.length - 1 &&
            css`
              border-bottom: 1px solid ${getValue('borderColor')};
            `
          }
        >
          {event.name.nl}
        </List.Item>
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

  const useGetItemsByCreator = useMemo(() => GetEventsByCreatorMap[activeTab], [
    activeTab,
  ]);

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

  const UseGetItemsByCreatorQuery = useGetItemsByCreator({
    creator: { id: user.id, email: user.email },
  }) as UseQueryResult<{ member: unknown[] }, unknown>; // TODO: remove cast

  const items = UseGetItemsByCreatorQuery.data?.member ?? [];

  return (
    <Page>
      <Page.Title>Welkom {user?.username}</Page.Title>
      <Page.Content spacing={5}>
        <Stack spacing={3}>
          <Text>Mijn activiteiten, locaties en organisaties</Text>
          <Tabs activeKey={activeTab} onSelect={handleSelectTab}>
            <Tabs.Tab eventKey="events" title="Events">
              {isEvents(items) && (
                <Events
                  events={items}
                  loading={
                    UseGetItemsByCreatorQuery.status === QueryStatus.LOADING
                  }
                />
              )}
            </Tabs.Tab>
            <Tabs.Tab eventKey="places" title="Places" />
            <Tabs.Tab eventKey="organizers" title="Organizers" />
          </Tabs>
        </Stack>
      </Page.Content>
    </Page>
  );
};

export { DashboardPage };
