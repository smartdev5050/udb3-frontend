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
import { Pagination } from '@/ui/Pagination';
import { Panel } from '@/ui/Panel';
import { Spinner } from '@/ui/Spinner';
import { Stack } from '@/ui/Stack';
import { Tabs } from '@/ui/Tabs';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { parseOfferId } from '@/utils/parseOfferId';

type TabOptions = 'events' | 'places' | 'organizers';

type Props = { activeTab: TabOptions };

const getValue = getValueFromTheme('dashboardPage');

const itemsPerPage = 10;

const GetItemsByCreatorMap = {
  events: useGetEventsByCreator,
  places: useGetPlacesByCreator,
  organizers: useGetOrganizersByCreator,
};

type EventMenuProps = InlineProps & { event: Event };

const EventMenu = ({ event, ...props }: EventMenuProps) => {
  return (
    <Inline {...getInlineProps(props)}>
      <Stack>
        <Link
          href={`/event/${parseOfferId(event['@id'])}/preview`}
          color={getValue('listItem.color')}
          fontWeight="bold"
        >
          {event.name.nl}
        </Link>
        <Text>test</Text>
      </Stack>
    </Inline>
  );
};

type EventsProps = {
  events: Event[];
  totalItems: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

const Events = ({
  events,
  totalItems,
  currentPage,
  setCurrentPage,
}: EventsProps) => {
  const { t } = useTranslation();

  return (
    <Panel>
      <List marginTop={4}>
        {events.map((event, index) => (
          <List.Item
            key={event['@id']}
            paddingLeft={4}
            paddingRight={4}
            paddingBottom={3}
            paddingTop={3}
            backgroundColor={getValue('listItem.backgroundColor')}
            css={
              index !== events.length - 1 &&
              css`
                border-bottom: 1px solid ${getValue('listItem.borderColor')};
              `
            }
          >
            <EventMenu event={event} />
          </List.Item>
        ))}
      </List>
      <Panel.Footer>
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          perPage={5}
          prevText={t('pagination.previous')}
          nextText={t('pagination.next')}
          onChangePage={setCurrentPage}
        />
      </Panel.Footer>
    </Panel>
  );
};

Events.defaultProps = {
  loading: false,
};

const DashboardPage = ({ activeTab: initialActiveTab }: Props) => {
  const { t } = useTranslation();

  const { cookies } = useCookiesWithOptions(['user']);
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [currentPageItems, setCurrentPageItems] = useState(1);

  const useGetItemsByCreator = useMemo(() => GetItemsByCreatorMap[activeTab], [
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
    start: currentPageItems - 1,
    limit: itemsPerPage,
  }) as UseQueryResult<{ totalItems: number; member: unknown[] }, Error>; // TODO: remove cast

  const items = UseGetItemsByCreatorQuery.data?.member ?? [];
  const totalItems = UseGetItemsByCreatorQuery.data?.totalItems ?? 0;

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
              {UseGetItemsByCreatorQuery.status === QueryStatus.LOADING ? (
                <Spinner marginTop={4} />
              ) : (
                isEvents(items) && (
                  <Events
                    events={items}
                    totalItems={totalItems}
                    currentPage={currentPageItems}
                    setCurrentPage={setCurrentPageItems}
                  />
                )
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
