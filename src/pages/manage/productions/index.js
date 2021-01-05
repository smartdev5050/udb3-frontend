import { useTranslation } from 'react-i18next';
import { Page } from '../../../components/publiq-ui/Page';
import { InputWithLabel } from '../../../components/publiq-ui/InputWithLabel';
import { Inline } from '../../../components/publiq-ui/Inline';
import {
  useAddEventById,
  useDeleteEventsByIds,
  useGetProductions,
} from '../../../hooks/api/productions';
import { useEffect, useMemo, useState } from 'react';
import { Link } from '../../../components/publiq-ui/Link';
import { useGetEventsbyIds } from '../../../hooks/api/events';
import { parseEventId } from '../../../utils/parseEventId';
import { QueryStatus } from '../../../hooks/api/authenticated-query';

import { Text } from '../../../components/publiq-ui/Text';
import { debounce } from 'lodash';
import { useQueryClient } from 'react-query';
import { DeleteModal } from '../../../components/manage/productions/index/DeleteModal';
import { Events } from '../../../components/manage/productions/index/Events';
import { Productions } from '../../../components/manage/productions/index/Productions';
import { dehydrate } from 'react-query/hydration';
import { getApplicationServerSideProps } from '../../../utils/getApplicationServerSideProps';

const productionsPerPage = 15;

const Index = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [searchInput, setSearchInput] = useState('');

  const [activeProductionId, setActiveProductionId] = useState('');
  const [selectedEventIds, setSelectedEventIds] = useState('');
  const [toBeAddedEventId, setToBeAddedEventId] = useState('');

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isAddActionVisible, setIsAddActionVisible] = useState(false);
  const [currentPageProductions, setCurrentPageProductions] = useState(1);
  const [errorMessageEvents, setErrorMessageEvents] = useState('');

  const {
    data: productionsData,
    status: productionsStatus,
  } = useGetProductions({
    name: searchInput,
    start: currentPageProductions - 1,
    limit: productionsPerPage,
  });

  const rawProductions = productionsData?.member ?? [];

  useEffect(() => {
    if (rawProductions.length === 0) {
      setActiveProductionId('');
    } else {
      setActiveProductionId(rawProductions[0].production_id);
    }
  }, [rawProductions]);

  const productions = useMemo(() => {
    return rawProductions.map((production) => ({
      ...production,
      id: production.production_id,
      active: production.production_id === activeProductionId,
    }));
  }, [activeProductionId, rawProductions]);

  const activeProduction = useMemo(
    () => productions.find((production) => production.active),
    [productions],
  );

  const totalItemsProductions = productionsData?.totalItems ?? 0;

  const { data: rawEvents = [], status: eventsStatus } = useGetEventsbyIds({
    ids: activeProduction?.events ?? [],
  });

  const events = useMemo(
    () =>
      rawEvents
        .map((event) => {
          const eventId = event?.['@id'];
          if (!eventId) return undefined;

          const id = parseEventId(eventId);
          return {
            ...event,
            id,
            selected: selectedEventIds.includes(id),
          };
        })
        .filter((event) => event),
    [rawEvents],
  );

  const handleSuccessDeleteEvents = async () => {
    await queryClient.refetchQueries(['productions']);
    setSelectedEventIds([]);
  };

  const { mutate: deleteEventsByIds } = useDeleteEventsByIds({
    onSuccess: handleSuccessDeleteEvents,
  });

  const handleSuccessAddEvent = () => {
    queryClient.refetchQueries(['productions']);
    setToBeAddedEventId('');
  };

  const handleErrorAddEvent = (error) => setErrorMessageEvents(error.message);

  const handleToggleSelectEvent = (selectedEventId) => {
    setIsAddActionVisible(false);
    setToBeAddedEventId('');

    setSelectedEventIds((oldSelectedEventIds) => {
      if (oldSelectedEventIds.includes(selectedEventId)) {
        return oldSelectedEventIds.filter((id) => selectedEventId !== id);
      }
      return [...oldSelectedEventIds, selectedEventId];
    });
  };

  const { mutate: addEventById } = useAddEventById({
    onSuccess: handleSuccessAddEvent,
    onError: handleErrorAddEvent,
  });

  const handleInputSearch = (event) => {
    const searchTerm = event.target.value.toString().trim();
    debounce(() => setSearchInput(searchTerm), 275)();
  };

  return (
    <Page>
      <Page.Title>{t('menu.productions')}</Page.Title>
      <Page.Actions>
        <Link
          href="/manage/productions/create"
          css="text-transform: lowercase;"
        >
          {t('productions.overview.create')}
        </Link>
      </Page.Actions>
      <Page.Content spacing={5}>
        <InputWithLabel
          id="productions-overview-search"
          placeholder={t('productions.overview.search.placeholder')}
          onInput={handleInputSearch}
        >
          {t('productions.overview.search.label')}
        </InputWithLabel>
        <Inline spacing={4}>
          {productionsStatus !== QueryStatus.LOADING &&
          productions.length === 0 ? (
            <Text>{t('productions.overview.no_productions')}</Text>
          ) : (
            [
              <Productions
                key="productions"
                loading={
                  productionsStatus === QueryStatus.LOADING &&
                  searchInput !== ''
                }
                width="40%"
                productions={productions}
                currentPage={currentPageProductions}
                totalItems={totalItemsProductions}
                perPage={productionsPerPage}
                onClickProduction={setActiveProductionId}
                onChangePage={setCurrentPageProductions}
              />,
              <Events
                key="events"
                loading={eventsStatus === QueryStatus.LOADING}
                flex={1}
                events={events}
                activeProductionName={activeProduction?.name ?? ''}
                errorMessage={errorMessageEvents}
                onToggleSelectEvent={handleToggleSelectEvent}
                onClickDelete={() => setIsDeleteModalVisible(true)}
                onCancelAddEvent={() => {
                  setToBeAddedEventId('');
                  setIsAddActionVisible(false);
                }}
                onClickAdd={() => {
                  setIsAddActionVisible(true);
                }}
                onAddEvent={() => {
                  setErrorMessageEvents('');
                  addEventById({
                    productionId: activeProduction.id,
                    eventId: toBeAddedEventId,
                  });
                }}
                isAddActionVisible={isAddActionVisible}
                toBeAddedEventId={toBeAddedEventId}
                onDismissError={() => {
                  setErrorMessageEvents('');
                }}
                onToBeAddedEventIdInput={(newInput) => {
                  setToBeAddedEventId(newInput);
                  setErrorMessageEvents('');
                }}
              />,
            ]
          )}
        </Inline>
        <DeleteModal
          visible={isDeleteModalVisible}
          eventCount={selectedEventIds.length}
          productionName={activeProduction?.name ?? ''}
          onConfirm={() => {
            deleteEventsByIds({
              productionId: activeProduction.id,
              eventIds: selectedEventIds,
            });
            setIsDeleteModalVisible(false);
          }}
          onClose={() => setIsDeleteModalVisible(false)}
        />
      </Page.Content>
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps(
  async ({ req, query, cookies, queryClient }) => {
    const productions = await useGetProductions({
      req,
      queryClient,
      name: '',
      start: 0,
      limit: productionsPerPage,
    });

    const eventIds = productions?.member?.[0]?.events ?? [];

    await useGetEventsbyIds({ req, queryClient, ids: eventIds });

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        cookies,
      },
    };
  },
);

export default Index;
