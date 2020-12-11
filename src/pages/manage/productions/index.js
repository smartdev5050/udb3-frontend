import { useTranslation } from 'react-i18next';
import { Page } from '../../../components/publiq-ui/Page';
import { InputWithLabel } from '../../../components/publiq-ui/InputWithLabel';
import { Inline } from '../../../components/publiq-ui/Inline';
import { Productions } from '../../../components/productions/index/Productions';
import {
  useDeleteEventsByIds,
  useGetProductions,
} from '../../../hooks/api/productions';
import { Events } from '../../../components/productions/index/Events';
import { parseSpacing } from '../../../components/publiq-ui/Box';
import { useEffect, useMemo, useState } from 'react';
import { Link } from '../../../components/publiq-ui/Link';
import { useGetEventsbyIds } from '../../../hooks/api/events';
import { parseEventId } from '../../../utils/parseEventId';
import { QueryStatus } from '../../../hooks/api/useAuthenticatedQuery';
import { Text } from '../../../components/publiq-ui/Text';
import { DeleteModal } from '../../../components/productions/index/DeleteModal';
import { queryCache } from '../../_app';
import { debounce } from 'lodash';

const Index = () => {
  const { t } = useTranslation();

  const [productions, setProductions] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeProduction, setActiveProduction] = useState();
  const [searchInput, setSearchInput] = useState('');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentPagePoductions, setCurrentPagePoductions] = useState(1);

  const productionsPerPage = 15;

  const eventIds = useMemo(() => {
    return activeProduction?.events ?? [];
  }, [activeProduction]);

  const selectedEventIds = useMemo(() => {
    return events.filter((event) => event.selected);
  }, [events]);

  const unselectAllEvents = () => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => ({ ...event, selected: false })),
    );
  };

  const {
    data: productionsData,
    status: productionsStatus,
  } = useGetProductions({
    name: searchInput,
    start: currentPagePoductions - 1,
    limit: productionsPerPage,
  });
  const rawProductions = productionsData?.member ?? [];
  const totalItemsProductions = productionsData?.totalItems ?? 0;
  const { data: rawEvents = [], status: eventsStatus } = useGetEventsbyIds({
    ids: eventIds,
  });
  const handleSuccessDeleteEvents = () => {
    queryCache.refetchQueries('productions');
    unselectAllEvents();
  };
  const [deleteEventsByIds] = useDeleteEventsByIds({
    onSuccess: handleSuccessDeleteEvents,
  });

  useEffect(() => {
    setProductions(
      rawProductions.map((production, index) => {
        if (index === 0) {
          setActiveProduction(production);
          return { ...production, active: true };
        }
        return { ...production, active: false };
      }),
    );
  }, [rawProductions]);

  useEffect(() => {
    setEvents(
      rawEvents.map((event) => ({
        ...event,
        id: parseEventId(event['@id']),
        selected: false,
      })),
    );
  }, [rawEvents]);

  useEffect(() => {
    if (productions.length === 0) {
      setEvents([]);
    }
  }, [productions]);

  const handleClickProduction = (id) => {
    if (id !== activeProduction?.production_id) {
      unselectAllEvents();
    }
    setProductions((prevProductions) =>
      prevProductions.map((production) => {
        if (production.production_id === id) {
          setActiveProduction(production);
          return { ...production, active: true };
        }
        if (production.active) {
          return { ...production, active: false };
        }
        return production;
      }),
    );
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
      <Page.Content>
        <InputWithLabel
          id="productions-overview-search"
          placeholder={t('productions.overview.search.placeholder')}
          marginBottom={4}
          onInput={(event) => {
            const searchTerm = event.target.value.toString().trim();
            debounce(() => setSearchInput(searchTerm), 800)();
          }}
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
                loading={productionsStatus === QueryStatus.LOADING}
                width={`calc(40% - ${parseSpacing(4)()})`}
                productions={productions}
                currentPage={currentPagePoductions}
                totalItems={totalItemsProductions}
                perPage={productionsPerPage}
                onClickProduction={handleClickProduction}
                onChangePage={(newPage) => {
                  setCurrentPagePoductions(newPage);
                }}
              />,
              <Events
                key="events"
                loading={eventsStatus === QueryStatus.LOADING}
                width="60%"
                events={events}
                activeProductionName={activeProduction?.name ?? ''}
                shouldDisableDeleteButton={selectedEventIds.length === 0}
                onToggleEvent={(id) => {
                  setEvents((prevEvents) =>
                    prevEvents.map((event) => {
                      if (event.id === id) {
                        return { ...event, selected: !event.selected };
                      }
                      return event;
                    }),
                  );
                }}
                onDeleteEvents={() => {
                  setIsDeleteModalVisible(true);
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
              productionId: activeProduction.production_id,
              eventIds: selectedEventIds,
            });
            setIsDeleteModalVisible(false);
          }}
          onClose={() => {
            setIsDeleteModalVisible(false);
          }}
        />
      </Page.Content>
    </Page>
  );
};

export default Index;
