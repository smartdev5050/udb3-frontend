import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { UseQueryResult } from 'react-query';
import { css } from 'styled-components';

import { QueryStatus } from '@/hooks/api/authenticated-query';
import { useGetEventsByCreator } from '@/hooks/api/events';
import { useGetOrganizersByCreator } from '@/hooks/api/organizers';
import { useGetPlacesByCreator } from '@/hooks/api/places';
import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import type { Event } from '@/types/Event';
import { isEvents } from '@/types/Event';
import type { User } from '@/types/User';
import type { InlineProps } from '@/ui/Inline';
import { getInlineProps, Inline } from '@/ui/Inline';
import { Link } from '@/ui/Link';
import { List } from '@/ui/List';
import { Page } from '@/ui/Page';
import { Spinner } from '@/ui/Spinner';
import { Stack } from '@/ui/Stack';
import { Tabs } from '@/ui/Tabs';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';

type TabOptions = 'events' | 'places' | 'organizers';

type Props = { activeTab: TabOptions };

const getValue = getValueFromTheme('productionItem');

const GetEventsByCreatorMap = {
  events: useGetEventsByCreator,
  places: useGetPlacesByCreator,
  organizers: useGetOrganizersByCreator,
};

type EventMenuProps = InlineProps & { event: Event };

const EventMenu = ({ event, ...props }: EventMenuProps) => {
  return (
    <Inline {...getInlineProps(props)}>
      <Stack>
        <Text fontWeight="bold" color="blue">
          {event.name.nl}
        </Text>
        <Text>test</Text>
      </Stack>
    </Inline>
  );
};

type EventsProps = {
  events: Event[];
  loading: boolean;
};

const Events = ({ events, loading }: EventsProps) => {
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
          <EventMenu event={event} />
        </List.Item>
      ))}
    </List>
  );
};

Events.defaultProps = {
  loading: false,
};

const DashboardPage = ({ activeTab: initialActiveTab }: Props) => {
  const { t } = useTranslation();

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
    limit: 20,
  }) as UseQueryResult<{ member: unknown[] }, unknown>; // TODO: remove cast

  const items = UseGetItemsByCreatorQuery.data?.member ?? [];

  return (
    <Page>
      <Page.Title>
        {t('dashboard.welcome')}, {user?.username}
      </Page.Title>
      <Page.Actions>
        <Link href="/create" css="text-transform: lowercase;">
          {t('dashboard.create')}
        </Link>
      </Page.Actions>
      <Page.Content spacing={5}>
        <Stack spacing={3}>
          <Text>{t('dashboard.my_items')}</Text>
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
