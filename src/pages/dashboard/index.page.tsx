import { format, isAfter, isFuture } from 'date-fns';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Cookies } from 'react-cookie';
import { Trans, useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { css } from 'styled-components';

import { CalendarType } from '@/constants/CalendarType';
import { QueryStatus } from '@/hooks/api/authenticated-query';
import {
  useDeleteEventByIdMutation,
  useGetEventsByCreatorQuery,
} from '@/hooks/api/events';
import {
  useDeleteOrganizerByIdMutation,
  useGetOrganizersByCreatorQuery,
} from '@/hooks/api/organizers';
import {
  useDeletePlaceByIdMutation,
  useGetPlacesByCreatorQuery,
} from '@/hooks/api/places';
import { useCookiesWithOptions } from '@/hooks/useCookiesWithOptions';
import { Footer } from '@/pages/Footer';
import type { Event } from '@/types/Event';
import type { Organizer } from '@/types/Organizer';
import type { Place } from '@/types/Place';
import type { User } from '@/types/User';
import { Alert, AlertVariants } from '@/ui/Alert';
import { Badge, BadgeVariants } from '@/ui/Badge';
import { Box } from '@/ui/Box';
import { Dropdown, DropDownVariants } from '@/ui/Dropdown';
import type { InlineProps } from '@/ui/Inline';
import { getInlineProps, Inline } from '@/ui/Inline';
import { LabelPositions } from '@/ui/Label';
import { Link, LinkVariants } from '@/ui/Link';
import { List } from '@/ui/List';
import { Modal, ModalVariants } from '@/ui/Modal';
import { Page } from '@/ui/Page';
import { Pagination } from '@/ui/Pagination';
import { Panel } from '@/ui/Panel';
import { SelectWithLabel } from '@/ui/SelectWithLabel';
import { Spinner } from '@/ui/Spinner';
import { Stack } from '@/ui/Stack';
import { Tabs } from '@/ui/Tabs';
import { Text } from '@/ui/Text';
import { getValueFromTheme } from '@/ui/theme';
import { formatAddressInternal } from '@/utils/formatAddress';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';
import { parseOfferId } from '@/utils/parseOfferId';

import { NewsletterSignupForm } from './NewsletterSingupForm';

const { publicRuntimeConfig } = getConfig();

type TabOptions = 'events' | 'places' | 'organizers';

type Item = Event | Place | Organizer;

const globalAlertMessages =
  typeof publicRuntimeConfig.globalAlertMessage === 'string'
    ? JSON.parse(publicRuntimeConfig.globalAlertMessage)
    : undefined;

const globalAlertVariant = Object.values(AlertVariants).some(
  (variant) => variant === publicRuntimeConfig.globalAlertVariant,
)
  ? publicRuntimeConfig.globalAlertVariant
  : AlertVariants.INFO;

const getValue = getValueFromTheme('dashboardPage');

const itemsPerPage = 14;

const UseGetItemsByCreatorMap = {
  events: useGetEventsByCreatorQuery,
  places: useGetPlacesByCreatorQuery,
  organizers: useGetOrganizersByCreatorQuery,
} as const;

const UseDeleteItemByIdMap = {
  events: useDeleteEventByIdMutation,
  places: useDeletePlaceByIdMutation,
  organizers: useDeleteOrganizerByIdMutation,
} as const;

const CreateMap = {
  events: '/create',
  places: '/create',
  organizers: '/organizer',
};

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
        actions.length > 0 && (
          <Dropdown variant={DropDownVariants.SECONDARY}>{actions}</Dropdown>
        )
      )}
    </Inline>
  );
};

Row.defaultProps = {
  actions: [],
};

type EventRowProps = InlineProps & {
  item: Event;
  onDelete: (item: Event) => void;
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
  const eventType = t(`eventTypes*${typeId}`, { keySeparator: '*' });

  const period =
    event.calendarSummary[i18n.language]?.text?.[
      event.calendarType === CalendarType.SINGLE ? 'lg' : 'sm'
    ];

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
  onDelete: (item: Place) => void;
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
  const placeType = t(`eventTypes*${typeId}`, { keySeparator: '*' });

  const period =
    place.calendarSummary[i18n.language]?.text?.[
      place.calendarType === CalendarType.SINGLE ? 'lg' : 'sm'
    ];

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

type OrganizerRowProps = InlineProps & {
  item: Organizer;
  onDelete: (item: Organizer) => void;
};

const OrganizerRow = ({
  item: organizer,
  onDelete,
  ...props
}: OrganizerRowProps) => {
  const { t, i18n } = useTranslation();

  const address =
    organizer?.address?.[i18n.language] ??
    organizer?.address?.[organizer.mainLanguage];
  const formattedAddress = address ? formatAddressInternal(address) : '';
  const editUrl = `/organizer/${parseOfferId(organizer['@id'])}/edit`;
  const previewUrl = `/organizer/${parseOfferId(organizer['@id'])}/preview`;

  return (
    <Row
      title={
        organizer.name[i18n.language] ?? organizer.name[organizer.mainLanguage]
      }
      url={previewUrl}
      description={formattedAddress}
      actions={[
        <Link href={editUrl} variant={LinkVariants.BUTTON_SECONDARY} key="edit">
          {t('dashboard.actions.edit')}
        </Link>,
      ]}
      {...getInlineProps(props)}
    />
  );
};

const TabContent = ({
  tab,
  items,
  status,
  Row,
  page,
  totalItems,
  onDelete,
  onChangePage,
}) => {
  const { t } = useTranslation();

  const hasMoreThanOnePage = Math.ceil(totalItems / itemsPerPage) > 1;

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

  if (items.length === 0) {
    return (
      <Panel
        css={`
          border-top: none !important;
        `}
        backgroundColor="white"
      >
        <Text margin={3} maxWidth="36rem">
          {t(`dashboard.no_items.${tab}`)}
        </Text>
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
      {hasMoreThanOnePage && (
        <Panel.Footer>
          <Pagination
            currentPage={page}
            totalItems={totalItems}
            perPage={itemsPerPage}
            prevText={t('pagination.previous')}
            nextText={t('pagination.next')}
            onChangePage={onChangePage}
          />
        </Panel.Footer>
      )}
    </Panel>
  );
};

const SortingField = {
  AVAILABLETO: 'availableTo',
  CREATED: 'created',
} as const;

const SortingOrder = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

const Dashboard = (): any => {
  const { t, i18n } = useTranslation();
  const { pathname, query, asPath, ...router } = useRouter();

  const { cookies } = useCookiesWithOptions(['user']);

  const queryClient = useQueryClient();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [toBeDeletedItem, setToBeDeletedItem] = useState<Item>();

  const tab = (query?.tab as TabOptions) ?? 'events';
  const page = parseInt((query?.page as string) ?? '1');
  const sort = (query?.sort as string) ?? 'created_desc';

  const useGetItemsByCreator = useMemo(
    () => UseGetItemsByCreatorMap[tab ?? 'events'],
    [tab],
  );

  const sortingField = useMemo(() => {
    return sort?.split('_')?.[0] ?? SortingField.CREATED;
  }, [sort]);

  const sortingOrder = useMemo(() => {
    return sort?.split('_')?.[1] ?? SortingOrder.DESC;
  }, [sort]);

  const useDeleteItemById = useMemo(
    () => UseDeleteItemByIdMap[tab ?? 'events'],
    [tab],
  );

  const handleSelectTab = async (tabKey: TabOptions) =>
    router.push(
      {
        pathname: `/dashboard`,
        query: { tab: tabKey, page: 1, ...(tabKey === 'events' && { sort }) },
      },
      undefined,
      { shallow: true },
    );

  const user = cookies.user;

  const handleSelectSorting = (event) => {
    const sortValue = event.target.value;
    router.push(
      { pathname: `/dashboard`, query: { tab, page: 1, sort: sortValue } },
      undefined,
      { shallow: true },
    );
  };

  const UseGetItemsByCreatorQuery = useGetItemsByCreator({
    creator: user,
    ...(tab === 'events' && {
      sortOptions: { field: sortingField, order: sortingOrder },
    }),
    paginationOptions: {
      start: (page - 1) * itemsPerPage,
      limit: itemsPerPage,
    },
  });

  const UseDeleteItemByIdMutation = useDeleteItemById({
    onSuccess: async () => {
      await queryClient.invalidateQueries(tab);
    },
  });

  // @ts-expect-error
  const items = UseGetItemsByCreatorQuery.data?.member ?? [];

  const sharedTableContentProps = {
    tab,
    // @ts-expect-error
    status: UseGetItemsByCreatorQuery.status,
    items,
    // @ts-expect-error
    totalItems: UseGetItemsByCreatorQuery.data?.totalItems ?? 0,
    page,
    onChangePage: async (page: number) => {
      await router.push({ pathname, query: { ...query, page } }, undefined, {
        shallow: true,
      });
    },
    onDelete: (item: Item) => {
      setToBeDeletedItem(item);
      setIsModalVisible(true);
    },
  };

  const SORTING_OPTIONS = [
    'created_desc',
    'created_asc',
    'availableTo_desc',
    'availableTo_asc',
  ];

  return [
    <Page key="page">
      <Page.Title>{`${t('dashboard.welcome')}, ${user?.username}`}</Page.Title>
      <Page.Content spacing={5}>
        {globalAlertMessages && (
          <Inline>
            <Alert variant={globalAlertVariant}>
              {globalAlertMessages[i18n.language ?? 'nl']}
            </Alert>
          </Inline>
        )}

        <Inline>
          <Link href={CreateMap[tab]} variant={LinkVariants.BUTTON_PRIMARY}>
            {t(`dashboard.create.${tab}`)}
          </Link>
        </Inline>

        <Stack position="relative">
          <Inline
            position="absolute"
            height="2.8rem"
            top={0}
            right={0}
            alignItems="center"
            spacing={4}
          >
            <Text as="div" display={{ default: 'block', l: 'none' }}>
              <Trans
                i18nKey={`dashboard.sorting.results.${tab}`}
                count={sharedTableContentProps.totalItems}
              >
                <Text fontWeight="bold" />
              </Trans>
            </Text>
            {tab === 'events' && (
              <SelectWithLabel
                key="select"
                id="sorting"
                label={`${t('dashboard.sorting.label')}:`}
                value={sort}
                onChange={handleSelectSorting}
                width="auto"
                labelPosition={LabelPositions.LEFT}
              >
                {SORTING_OPTIONS.map((sortOption) => (
                  <option key={sortOption} value={sortOption}>
                    {t(`dashboard.sorting.${sortOption}`)}
                  </option>
                ))}
              </SelectWithLabel>
            )}
          </Inline>
          <Tabs<TabOptions>
            activeKey={tab}
            onSelect={handleSelectTab}
            activeBackgroundColor="white"
          >
            <Tabs.Tab eventKey="events" title={t('dashboard.tabs.events')}>
              {tab === 'events' && (
                <TabContent {...sharedTableContentProps} Row={EventRow} />
              )}
            </Tabs.Tab>
            <Tabs.Tab eventKey="places" title={t('dashboard.tabs.places')}>
              {tab === 'places' && (
                <TabContent {...sharedTableContentProps} Row={PlaceRow} />
              )}
            </Tabs.Tab>
            <Tabs.Tab
              eventKey="organizers"
              title={t('dashboard.tabs.organizers')}
            >
              {tab === 'organizers' && (
                <TabContent {...sharedTableContentProps} Row={OrganizerRow} />
              )}
            </Tabs.Tab>
          </Tabs>
        </Stack>
        {i18n.language === 'nl' && <NewsletterSignupForm />}
        <Footer />
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
        type: t(`dashboard.modal.types.${tab}`),
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

const getServerSideProps = getApplicationServerSideProps(
  async ({ req, query, cookies: rawCookies, queryClient }) => {
    const cookies = new Cookies(rawCookies);
    const user: User = cookies.get('user');

    await Promise.all(
      Object.entries(UseGetItemsByCreatorMap).map(([key, hook]) => {
        const page =
          query.tab === key ? (query.page ? parseInt(query.page) : 1) : 1;

        const sortingField = query?.sort?.split('_')[0] ?? SortingField.CREATED;
        const sortingOrder = query?.sort?.split('_')[1] ?? SortingOrder.DESC;

        return hook({
          req,
          queryClient,
          creator: user,
          ...(key === 'events' && {
            sortOptions: {
              field: sortingField,
              order: sortingOrder,
            },
          }),
          paginationOptions: {
            start: (page - 1) * itemsPerPage,
            limit: itemsPerPage,
          },
        });
      }),
    );

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        cookies: rawCookies,
      },
    };
  },
);

const DashboardWrapper = (props) => {
  return <Dashboard {...props} />;
};

export default DashboardWrapper;
export { getServerSideProps, itemsPerPage };
