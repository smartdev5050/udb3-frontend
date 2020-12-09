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

const Index = () => {
  const { t } = useTranslation();

  const [productions, setProductions] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeProduction, setActiveProduction] = useState();
  const [searchInput, setSearchInput] = useState('');
  const [selectedEventIds, setSelectedEventIds] = useState([]);

  const eventIds = useMemo(() => {
    return activeProduction?.events ?? [];
  }, [activeProduction]);

  const {
    data: productionsData,
    status: productionsStatus,
    refetch: refetchProductions,
  } = useGetProductions({
    name: searchInput,
    limit: 15,
  });
  const rawProductions = productionsData?.member ?? [];
  const { data: rawEvents = [], status: eventsStatus } = useGetEventsbyIds({
    ids: eventIds,
  });
  const handleSuccessDeleteEvents = async () => {
    await refetchProductions();
    setSelectedEventIds([]);
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
      setSelectedEventIds([]);
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
      <Page.Title
        actionTitle={t('productions.overview.create')}
        actionHref="/manage/productions/create"
      >
        {t('menu.productions')}
      </Page.Title>
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
            setSearchInput(event.target.value.toString().trim());
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
                onClickProduction={handleClickProduction}
              />,
              <Events
                key="events"
                loading={eventsStatus === QueryStatus.LOADING}
                width="60%"
                events={events}
                activeProductionName={activeProduction?.name ?? ''}
                selectedIds={selectedEventIds}
                onToggleEvent={(id) => {
                  setSelectedEventIds((prevValue) => {
                    if (prevValue.includes(id)) {
                      return prevValue.filter((eventId) => eventId !== id);
                    }
                    return [...prevValue, id];
                  });
                }}
                onDeleteEvents={(ids) => {
                  deleteEventsByIds({
                    productionId: activeProduction.production_id,
                    eventIds: ids,
                  });
                }}
              />,
            ]
          )}
        </Inline>
      </Page.Content>
    </Page>
  );
};

export default Index;
