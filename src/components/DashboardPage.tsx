import { format, isAfter, isFuture } from 'date-fns';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { css } from 'styled-components';

import { QueryStatus } from '@/hooks/api/authenticated-query';
import { useDeleteEventById, useGetEventsByCreator } from '@/hooks/api/events';
import { useGetOrganizersByCreator } from '@/hooks/api/organizers';
import { useDeletePlaceById, useGetPlacesByCreator } from '@/hooks/api/places';
import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import type { Event } from '@/types/Event';
import type { Place } from '@/types/Place';
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
} as const;

const DeleteEventByIdMap = {
  events: useDeleteEventById,
  places: useDeletePlaceById,
  // TODO: add organizer api call
} as const;

type RowProps = {
  title: string;
  description: string;
  actions: ReactNode[];
  url: string;
  status?: string;
  badge?: string;
};

const Row = ({
  title,
  description,
  actions,
  url,
  status,
  badge,
  ...props
}: RowProps) => {
  return (
    <Inline flex={1} justifyContent="space-between" {...getInlineProps(props)}>
      <Stack spacing={2}>
        <Inline spacing={3}>
          <Link href={url} color={getValue('listItem.color')} fontWeight="bold">
            {title}
          </Link>
          {badge && <Badge variant={BadgeVariants.SECONDARY}>{badge}</Badge>}
        </Inline>
        <Text>{description}</Text>
      </Stack>
      {status ? (
        <Text color={getValue('listItem.passedEvent.color')}>{status}</Text>
      ) : (
        <Dropdown variant={DropDownVariants.SECONDARY}>{actions}</Dropdown>
      )}
    </Inline>
  );
};

type EventRowProps = InlineProps & {
  item: Event;
  onDelete: (id: Event) => void;
};

const EventRow = ({ item: event, onDelete, ...props }: EventRowProps) => {
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
    <Row
      title={event.name[i18n.language] ?? event.name[event.mainLanguage]}
      description={`${eventType}${period && ` - ${period}`}`}
      url={previewUrl}
      actions={[
        <Link href={editUrl} variant={LinkVariants.BUTTON_SECONDARY} key="edit">
          {t('dashboard.actions.edit')}
        </Link>,
        <Dropdown.Item href={previewUrl} key="preview">
          {t('dashboard.actions.preview')}
        </Dropdown.Item>,
        <Dropdown.Divider key="divider" />,
        <Dropdown.Item onClick={() => onDelete(event)} key="delete">
          {t('dashboard.actions.delete')}
        </Dropdown.Item>,
      ]}
      status={
        isFinished && t('dashboard.passed', { type: t('dashboard.event') })
      }
      badge={
        isPlanned
          ? t('dashboard.online_from', {
              date: format(new Date(event.availableFrom), 'dd/MM/yyyy'),
            })
          : !isPublished && t('dashboard.not_published')
      }
      {...getInlineProps(props)}
    />
  );
};

type PlaceRowProps = InlineProps & {
  item: Place;
  onDelete: (id: Place) => void;
};

const PlaceRow = ({ item: place, onDelete, ...props }: PlaceRowProps) => {
  const { t, i18n } = useTranslation();

  const isFinished = isAfter(new Date(), new Date(place.availableTo));
  const isPublished = ['APPROVED', 'READY_FOR_VALIDATION'].includes(
    place.workflowStatus,
  );
  const isPlanned = isPublished && isFuture(new Date(place.availableFrom));

  const editUrl = `/place/${parseOfferId(place['@id'])}/edit`;
  const previewUrl = `/place/${parseOfferId(place['@id'])}/preview`;
  const typeId = place.terms.find((term) => term.domain === 'eventtype')?.id;
  // The custom keySeparator was necessary because the ids contain '.' which i18n uses as default keySeparator
  const placeType = t(`offerTypes*${typeId}`, { keySeparator: '*' });

  const period = place.calendarSummary[i18n.language]?.text?.md;

  return (
    <Row
      title={place.name[i18n.language] ?? place.name[place.mainLanguage]}
      description={`${placeType}${period && ` - ${period}`}`}
      url={previewUrl}
      actions={[
        <Link href={editUrl} variant={LinkVariants.BUTTON_SECONDARY} key="edit">
          {t('dashboard.actions.edit')}
        </Link>,
        <Dropdown.Item href={previewUrl} key="preview">
          {t('dashboard.actions.preview')}
        </Dropdown.Item>,
        <Dropdown.Divider key="divider" />,
        <Dropdown.Item onClick={() => onDelete(place)} key="delete">
          {t('dashboard.actions.delete')}
        </Dropdown.Item>,
      ]}
      status={
        isFinished && t('dashboard.passed', { type: t('dashboard.place') })
      }
      badge={
        isPlanned
          ? t('dashboard.online_from', {
              date: format(new Date(place.availableFrom), 'dd/MM/yyyy'),
            })
          : !isPublished && t('dashboard.not_published')
      }
      {...getInlineProps(props)}
    />
  );
};

// TODO: OrganizerRow

const TabContent = ({
  items,
  status,
  Row,
  currentPage,
  totalItems,
  onDelete,
  onChangePage,
}) => {
  const { t } = useTranslation();

  if (status === QueryStatus.LOADING) {
    return (
      <Panel
        backgroundColor="white"
        css={`
          border-top: none !important;
        `}
      >
        <Spinner marginY={4} />
      </Panel>
    );
  }

  return (
    <Panel
      css={`
        border-top: none !important;
      `}
    >
      <List>
        {items.map((item, index) => (
          <List.Item
            key={item['@id']}
            paddingLeft={4}
            paddingRight={4}
            paddingBottom={3}
            paddingTop={3}
            backgroundColor={getValue('listItem.backgroundColor')}
            css={
              index !== items.length - 1
                ? css`
                    border-bottom: 1px solid ${getValue('listItem.borderColor')};
                  `
                : css``
            }
          >
            <Row item={item} onDelete={onDelete} />
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
          onChangePage={onChangePage}
        />
      </Panel.Footer>
    </Panel>
  );
};

type Props = { activeTab: TabOptions; page?: number };

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

  const useDeleteItemById = useMemo(() => DeleteEventByIdMap[activeTab], [
    activeTab,
  ]);

  const handleSelectTab = async (eventKey: TabOptions) => {
    const url = getCurrentUrl();
    url.pathname = eventKey;
    url.searchParams.set('page', '1');

    await router.push(url);
  };

  const user = cookies.user;

  const UseGetItemsByCreatorQuery = useGetItemsByCreator({
    creator: user,
    paginationOptions: {
      start: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage,
    },
  });

  const UseDeleteItemByIdMutation = useDeleteItemById({
    onSuccess: async () => {
      await queryClient.invalidateQueries(activeTab);
    },
  });

  // @ts-expect-error
  const items = UseGetItemsByCreatorQuery.data?.member ?? [];

  const sharedTableContentProps = {
    // @ts-expect-error
    status: UseGetItemsByCreatorQuery.status,
    items,
    // @ts-expect-error
    totalItems: UseGetItemsByCreatorQuery.data?.totalItems ?? 0,
    currentPage,
    onChangePage: async (page: number) => {
      const url = getCurrentUrl();
      url.searchParams.set('page', `${page}`);
      await router.push(url, undefined, { shallow: true });
      setCurrentPage(page);
    },
    onDelete: (item) => {
      setToBeDeletedItem(item);
      setIsModalVisible(true);
    },
  };

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
        <Text>{t('dashboard.my_items')}</Text>

        <Tabs<TabOptions>
          activeKey={activeTab}
          onSelect={handleSelectTab}
          activeBackgroundColor="white"
        >
          <Tabs.Tab eventKey="events" title={t('dashboard.tabs.events')}>
            {activeTab === 'events' && (
              <TabContent {...sharedTableContentProps} Row={EventRow} />
            )}
          </Tabs.Tab>
          <Tabs.Tab eventKey="places" title={t('dashboard.tabs.places')}>
            {activeTab === 'places' && (
              <TabContent {...sharedTableContentProps} Row={PlaceRow} />
            )}
          </Tabs.Tab>
          <Tabs.Tab
            eventKey="organizers"
            title={t('dashboard.tabs.organizers')}
          >
            {/* <TabContent {...sharedTableContentProps} Row={OrganizerRow} /> */}
          </Tabs.Tab>
        </Tabs>
      </Page.Content>
    </Page>,
    <Modal
      key="modal"
      variant={ModalVariants.QUESTION}
      visible={isModalVisible}
      onConfirm={async () => {
        UseDeleteItemByIdMutation.mutate({
          id: parseOfferId(toBeDeletedItem['@id']),
        });
        setIsModalVisible(false);
      }}
      onClose={() => setIsModalVisible(false)}
      title={t('dashboard.modal.title', {
        type: t(`dashboard.modal.types.${activeTab}`),
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
