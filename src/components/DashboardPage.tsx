import { format, isAfter, isFuture } from 'date-fns';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { UseQueryResult } from 'react-query';
import { useQueryClient } from 'react-query';
import { css } from 'styled-components';

import { QueryStatus } from '@/hooks/api/authenticated-query';
import { useDeleteEventById, useGetEventsByCreator } from '@/hooks/api/events';
import { useGetOrganizersByCreator } from '@/hooks/api/organizers';
import { useGetPlacesByCreator } from '@/hooks/api/places';
import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import type { Event } from '@/types/Event';
import { isEvents } from '@/types/Event';
import { Badge, BadgeVariants } from '@/ui/Badge';
import { Box } from '@/ui/Box';
import { Dropdown, DropDownVariants } from '@/ui/Dropdown';
import type { InlineProps } from '@/ui/Inline';
import { getInlineProps, Inline } from '@/ui/Inline';
import { Link, LinkVariants } from '@/ui/Link';
import { List } from '@/ui/List';
import { Modal, ModalVariants } from '@/ui/Modal';
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

const getValue = getValueFromTheme('dashboardPage');

const itemsPerPage = 14;

const GetItemsByCreatorMap = {
  events: useGetEventsByCreator,
  places: useGetPlacesByCreator,
  organizers: useGetOrganizersByCreator,
};

type EventMenuProps = InlineProps & {
  event: Event;
  onDelete: (id: Event) => void;
};

const EventMenu = ({ event, onDelete, ...props }: EventMenuProps) => {
  const { t, i18n } = useTranslation();

  const isFinished = isAfter(new Date(), new Date(event.availableTo));
  const isPublished = ['APPROVED', 'READY_FOR_VALIDATION'].includes(
    event.workflowStatus,
  );
  const isPlanned = isPublished && isFuture(new Date(event.availableFrom));

  const editUrl = `/event/${parseOfferId(event['@id'])}/edit`;
  const previewUrl = `/event/${parseOfferId(event['@id'])}/preview`;
  const typeId = event.terms.find((term) => term.domain === 'eventtype')?.id;
  // The custom keySeparator was necessary because the ids contain '.' which i18n uses as default keySeparator
  const eventType = t(`offerTypes*${typeId}`, { keySeparator: '*' });

  const period = event.calendarSummary[i18n.language]?.text?.md;

  return (
    <Inline flex={1} justifyContent="space-between" {...getInlineProps(props)}>
      <Stack spacing={2}>
        <Inline spacing={3}>
          <Link
            href={previewUrl}
            color={getValue('listItem.color')}
            fontWeight="bold"
          >
            {event.name[i18n.language] ?? event.name[event.mainLanguage]}
          </Link>
          {isPlanned ? (
            <Badge variant={BadgeVariants.SECONDARY}>
              {t('dashboard.online_from', {
                date: format(new Date(event.availableFrom), 'dd/MM/yyyy'),
              })}
            </Badge>
          ) : (
            !isPublished && (
              <Badge variant={BadgeVariants.SECONDARY}>
                {t('dashboard.not_published')}
              </Badge>
            )
          )}
        </Inline>
        <Text>
          {eventType}
          {period && ` - ${period}`}
        </Text>
      </Stack>
      {isFinished ? (
        <Text color={getValue('listItem.passedEvent.color')}>
          {t('dashboard.passed_event')}
        </Text>
      ) : (
        <Dropdown variant={DropDownVariants.SECONDARY}>
          <Link href={editUrl} variant={LinkVariants.BUTTON_SECONDARY}>
            {t('dashboard.actions.edit')}
          </Link>
          <Dropdown.Item href={previewUrl}>
            {t('dashboard.actions.preview')}
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => onDelete(event)}>
            {t('dashboard.actions.delete')}
          </Dropdown.Item>
        </Dropdown>
      )}
    </Inline>
  );
};

type EventsProps = {
  events: Event[];
  totalItems: number;
  currentPage: number;
  onDelete: (id: Event) => void;
  changeCurrentPage: (page: number) => void;
};

const Events = ({
  events,
  totalItems,
  currentPage,
  changeCurrentPage,
  onDelete,
}: EventsProps) => {
  const { t } = useTranslation();

  return (
    <Panel
      css={`
        border-top: none !important;
      `}
    >
      <List>
        {events.map((event, index) => (
          <List.Item
            key={event['@id']}
            paddingLeft={4}
            paddingRight={4}
            paddingBottom={3}
            paddingTop={3}
            backgroundColor={getValue('listItem.backgroundColor')}
            css={
              index !== events.length - 1
                ? css`
                    border-bottom: 1px solid ${getValue('listItem.borderColor')};
                  `
                : undefined
            }
          >
            <EventMenu event={event} onDelete={onDelete} />
          </List.Item>
        ))}
      </List>
      <Panel.Footer>
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          perPage={itemsPerPage}
          prevText={t('pagination.previous')}
          nextText={t('pagination.next')}
          onChangePage={changeCurrentPage}
        />
      </Panel.Footer>
    </Panel>
  );
};

Events.defaultProps = {
  loading: false,
};

type Props = { activeTab: TabOptions; page?: number };

// Error: Its return type 'Element[]' is not a valid JSX element.
// return type any following this solution https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20356#issuecomment-492831432
const DashboardPage = ({ activeTab, page }: Props): any => {
  const { t, i18n } = useTranslation();
  const { asPath, ...router } = useRouter();

  const getCurrentUrl = () =>
    new URL(`${window.location.protocol}//${window.location.host}${asPath}`);

  const { cookies } = useCookiesWithOptions(['user']);

  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(page);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [toBeDeletedItem, setToBeDeletedItem] = useState<Event>();

  const useGetItemsByCreator = useMemo(() => GetItemsByCreatorMap[activeTab], [
    activeTab,
  ]);

  const handleSelectTab = async (eventKey: TabOptions) => {
    const url = getCurrentUrl();
    url.pathname = eventKey;
    url.searchParams.set('page', '1');

    await router.push(url);
  };

  const changeCurrentPage = async (page: number) => {
    const url = getCurrentUrl();
    url.searchParams.set('page', `${page}`);

    await router.push(url, undefined, { shallow: true });

    setCurrentPage(page);
  };

  const user = cookies.user;

  const UseGetItemsByCreatorQuery = useGetItemsByCreator({
    creator: user,
    paginationOptions: {
      start: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage,
    },
  }) as UseQueryResult<{ totalItems: number; member: unknown[] }, Error>; // TODO: remove cast

  const UseDeleteEventByIdMutation = useDeleteEventById({
    onSuccess: async () => {
      await queryClient.invalidateQueries('events');
    },
  });

  const items = UseGetItemsByCreatorQuery.data?.member ?? [];
  const totalItems = UseGetItemsByCreatorQuery.data?.totalItems ?? 0;

  const itemType = isEvents(items) ? 'events' : undefined;

  return [
    <Page key="page">
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

          <Tabs
            activeKey={activeTab}
            onSelect={handleSelectTab}
            activeBackgroundColor="white"
          >
            <Tabs.Tab eventKey="events" title={t('dashboard.tabs.events')}>
              {UseGetItemsByCreatorQuery.status === QueryStatus.LOADING ? (
                <Panel
                  backgroundColor="white"
                  css={`
                    border-top: none !important;
                  `}
                >
                  <Spinner marginY={4} />
                </Panel>
              ) : (
                isEvents(items) && (
                  <Events
                    events={items}
                    totalItems={totalItems}
                    currentPage={currentPage}
                    changeCurrentPage={changeCurrentPage}
                    onDelete={(event) => {
                      setToBeDeletedItem(event);
                      setIsModalVisible(true);
                    }}
                  />
                )
              )}
            </Tabs.Tab>
            <Tabs.Tab eventKey="places" title={t('dashboard.tabs.places')} />
            <Tabs.Tab
              eventKey="organizers"
              title={t('dashboard.tabs.organizers')}
            />
          </Tabs>
        </Stack>
      </Page.Content>
    </Page>,
    <Modal
      key="modal"
      variant={ModalVariants.QUESTION}
      visible={isModalVisible}
      onConfirm={async () => {
        UseDeleteEventByIdMutation.mutate({
          id: parseOfferId(toBeDeletedItem['@id']),
        });
        setIsModalVisible(false);
      }}
      onClose={() => setIsModalVisible(false)}
      title={t('dashboard.modal.title', {
        type: t(`dashboard.modal.types.${itemType}`),
      })}
      confirmTitle={t('dashboard.actions.delete')}
      cancelTitle={t('dashboard.actions.cancel')}
    >
      {toBeDeletedItem && (
        <Box padding={4}>
          {t('dashboard.modal.question', {
            name:
              toBeDeletedItem.name[i18n.language] ??
              toBeDeletedItem.name[toBeDeletedItem.mainLanguage],
          })}
        </Box>
      )}
    </Modal>,
  ];
};

export { DashboardPage, itemsPerPage };
