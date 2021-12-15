import throttle from 'lodash/throttle';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';

import { QueryStatus } from '@/hooks/api/authenticated-query';
import { useGetEventsByIds } from '@/hooks/api/events';
import {
  useAddEventById,
  useChangeProductionName,
  useDeleteEventsByIds,
  useGetProductions,
} from '@/hooks/api/productions';
import { FormElement } from '@/ui/FormElement';
import { Inline } from '@/ui/Inline';
import { Input } from '@/ui/Input';
import { Link } from '@/ui/Link';
import { Page } from '@/ui/Page';
import { Text } from '@/ui/Text';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';
import { parseOfferId } from '@/utils/parseOfferId';

import { DeleteModal } from './DeleteModal';
import { Events } from './Events';
import { Productions } from './Productions';

const productionsPerPage = 15;

const productionsQueryKey = ['productions', { limit: 15, name: '', start: 0 }];

const Index = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [searchInput, setSearchInput] = useState('');

  const [activeProductionId, setActiveProductionId] = useState('');
  const [selectedEventIds, setSelectedEventIds] = useState('');
  const [toBeAddedEventId, setToBeAddedEventId] = useState('');
  const [toBeChangedProductionName, setToBeChangedProductionName] = useState(
    '',
  );

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isAddActionVisible, setIsAddActionVisible] = useState(false);
  const [isChangeNameActionVisible, setIsChangeNameActionVisible] = useState(
    false,
  );
  const [currentPageProductions, setCurrentPageProductions] = useState(1);
  const [errorMessageEvents, setErrorMessageEvents] = useState('');

  const getProductionsQuery = useGetProductions({
    name: searchInput,
    paginationOptions: {
      start: currentPageProductions - 1,
      limit: productionsPerPage,
    },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rawProductions = getProductionsQuery.data?.member ?? [];

  useEffect(() => {
    if (rawProductions.length === 0) {
      setActiveProductionId('');
    }

    if (!activeProductionId) {
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

  useEffect(() => {
    setToBeChangedProductionName(activeProduction?.name ?? '');
  }, [activeProduction]);

  const totalItemsProductions = getProductionsQuery.data?.totalItems ?? 0;

  const getEventsByIdsQuery = useGetEventsByIds({
    ids: activeProduction?.events ?? [],
  });

  const events = useMemo(() => {
    if (!getEventsByIdsQuery.data) return [];
    return getEventsByIdsQuery.data
      .map((event) => {
        const eventId = event?.['@id'];
        if (!eventId) return undefined;

        const id = parseOfferId(eventId);
        return {
          ...event,
          id,
          selected: selectedEventIds.includes(id),
        };
      })
      .filter((event) => event);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEventsByIdsQuery.data]);

  const handleSuccessDeleteEvents = async () => {
    await queryClient.invalidateQueries('productions');
    setSelectedEventIds([]);
  };

  const deleteEventsByIdsMutation = useDeleteEventsByIds({
    onSuccess: handleSuccessDeleteEvents,
  });

  const handleSuccessAddEvent = async () => {
    await queryClient.invalidateQueries('productions');
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

  const addEventByIdMutation = useAddEventById({
    onSuccess: handleSuccessAddEvent,
    onError: handleErrorAddEvent,
  });

  const changeProductionName = useChangeProductionName({
    onMutate: async () => {
      setErrorMessageEvents('');
      setIsChangeNameActionVisible(false);
      const changedProduction = {
        ...activeProduction,
        name: toBeChangedProductionName,
      };

      await queryClient.cancelQueries(productionsQueryKey);

      const previousProductions = queryClient.getQueryData(productionsQueryKey);

      queryClient.setQueryData(productionsQueryKey, (productions) => {
        return {
          ...productions,
          member: productions.member.map((oldProduction) => {
            if (oldProduction.production_id === activeProduction.id) {
              return changedProduction;
            }
            return oldProduction;
          }),
        };
      });

      return { previousProductions };
    },

    onError: (err, previousProductions, context) => {
      setIsChangeNameActionVisible(true);
      handleErrorAddEvent(err);
      queryClient.setQueryData(
        productionsQueryKey,
        context.previousProductions,
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries(productionsQueryKey);
    },
  });

  const handleInputSearch = useCallback((event) => {
    const searchTerm = event.target.value.toString().trim();
    setCurrentPageProductions(1);
    setSearchInput(searchTerm);
  }, []);

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
        <FormElement
          id="productions-overview-search"
          label={t('productions.overview.search.label')}
          Component={
            <Input
              placeholder={t('productions.overview.search.placeholder')}
              onChange={throttle(handleInputSearch, 275)}
            />
          }
        />

        <Inline spacing={5}>
          {getProductionsQuery.status !== QueryStatus.LOADING &&
          productions.length === 0 ? (
            <Text>{t('productions.overview.no_productions')}</Text>
          ) : (
            [
              <Productions
                key="productions"
                loading={
                  getProductionsQuery.status === QueryStatus.LOADING &&
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
                loading={getEventsByIdsQuery.status === QueryStatus.LOADING}
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
                onClickChangeName={() => {
                  setIsChangeNameActionVisible(true);
                }}
                onAddEvent={() => {
                  setErrorMessageEvents('');
                  addEventByIdMutation.mutate({
                    productionId: activeProduction.id,
                    eventId: toBeAddedEventId,
                  });
                }}
                isAddActionVisible={isAddActionVisible}
                isChangeNameActionVisible={isChangeNameActionVisible}
                toBeAddedEventId={toBeAddedEventId}
                changedProductionName={toBeChangedProductionName}
                onChangedProductionName={(newProductionName) => {
                  setToBeChangedProductionName(newProductionName);
                }}
                onConfirmChangeProductionName={() => {
                  changeProductionName.mutate({
                    productionId: activeProduction.id,
                    productionName: toBeChangedProductionName,
                  });
                }}
                onCancelChangeProductionName={() => {
                  setToBeChangedProductionName(activeProduction?.name ?? '');
                  setIsChangeNameActionVisible(false);
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
            deleteEventsByIdsMutation.mutate({
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
      paginationOptions: { limit: productionsPerPage, start: 0 },
    });

    const eventIds = productions?.member?.[0]?.events ?? [];

    await useGetEventsByIds({ req, queryClient, ids: eventIds });

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        cookies,
      },
    };
  },
);

export default Index;
