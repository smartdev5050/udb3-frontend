import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { QueryStatus } from '@/hooks/api/authenticated-query';
import {
  useAddEventsByIdsMutation,
  useCreateWithEventsMutation,
  useGetProductionsQuery,
  useGetSuggestedEventsQuery,
  useMergeProductionsMutation,
  useSkipSuggestedEventsMutation,
} from '@/hooks/api/productions';
import { Button, ButtonVariants } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Inline } from '@/ui/Inline';
import { Page } from '@/ui/Page';
import { RadioButtonGroup } from '@/ui/RadioButtonGroup';
import { Spinner } from '@/ui/Spinner';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { Typeahead } from '@/ui/Typeahead';
import { getApplicationServerSideProps } from '@/utils/getApplicationServerSideProps';
import { parseOfferId } from '@/utils/parseOfferId';

import { Event } from './Event';

const ProductionStatus = {
  MISSING: 'missing',
  EXISTING_SELECTED: 'existingSelected',
  NEW: 'new',
};

const Create = () => {
  const minSearchLength = 3;
  const { t, i18n } = useTranslation();
  const [searchInput, setSearchInput] = useState('');
  const [selectedProductionId, setSelectedProductionId] = useState('');
  const typeaheadComponent = useRef();

  const getSuggestedEventsQuery = useGetSuggestedEventsQuery({ retry: false });

  const getProductionsQuery = useGetProductionsQuery({
    name: searchInput,
    paginationOptions: { limit: 10 },
  });

  const handleSuccess = async () => {
    setSelectedProductionId('');
    setSearchInput('');
    await getSuggestedEventsQuery.refetch();
    typeaheadComponent?.current?.clear();
  };

  const skipSuggestedEventsMutation = useSkipSuggestedEventsMutation({
    onSuccess: handleSuccess,
  });

  const createProductionWithEventsMutation = useCreateWithEventsMutation({
    onSuccess: handleSuccess,
  });

  const mergeProductionsMutation = useMergeProductionsMutation({
    onSuccess: handleSuccess,
  });

  const addEventsByIdsMutation = useAddEventsByIdsMutation({
    onSuccess: handleSuccess,
  });

  const suggestedProductions = searchInput
    ? getProductionsQuery.data?.member ?? []
    : [];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const events = getSuggestedEventsQuery.data?.events ?? [];
  const similarity = getSuggestedEventsQuery.data?.similarity ?? 0;

  const availableProductions = useMemo(
    () =>
      events
        .map((event) => event?.production)
        .filter((production) => !!production),
    [events],
  );

  const selectedProduction = useMemo(
    () =>
      availableProductions.find(
        (production) => production.id === selectedProductionId,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedProductionId],
  );

  const isEditingProduction = useMemo(
    () =>
      [
        createProductionWithEventsMutation.status,
        mergeProductionsMutation.status,
        addEventsByIdsMutation.status,
      ].some((status) => status === QueryStatus.LOADING),
    [
      createProductionWithEventsMutation.status,
      mergeProductionsMutation.status,
      addEventsByIdsMutation.status,
    ],
  );

  useEffect(() => {
    if (availableProductions.length === 1) {
      setSelectedProductionId(availableProductions[0].id);
    }
  }, [availableProductions]);

  const status = useMemo(() => {
    if (selectedProductionId) {
      return ProductionStatus.EXISTING_SELECTED;
    }
    if (searchInput) {
      return ProductionStatus.NEW;
    }
    return ProductionStatus.MISSING;
  }, [selectedProductionId, searchInput]);

  const handleInputSearch = useCallback((searchTerm) => {
    const trimmedSearchTerm = searchTerm.toString().trim();

    if (trimmedSearchTerm.length < minSearchLength) {
      return;
    }

    setSelectedProductionId(undefined);
    setSearchInput(trimmedSearchTerm);
  }, []);

  const handleClickLink = () => {
    if (status === ProductionStatus.MISSING) return;
    if (status === ProductionStatus.NEW) {
      // create a new production
      createProductionWithEventsMutation.mutate({
        productionName: searchInput,
        eventIds: events.map((event) => parseOfferId(event['@id'])),
      });
      return;
    }
    // merge the unselected production into the selected production when there are 2 availableProductions
    if (availableProductions.length === 2) {
      const unselectedProductionId = availableProductions.find(
        (production) => production.id !== selectedProductionId,
      )?.id;
      mergeProductionsMutation.mutate({
        fromProductionId: unselectedProductionId,
        toProductionId: selectedProductionId,
      });
      return;
    }
    // add event to production when there is only 1 production
    addEventsByIdsMutation.mutate({
      productionId: selectedProductionId,
      eventIds: events
        .filter((event) => !event.production)
        .map((event) => parseOfferId(event['@id'])),
    });
  };

  return (
    <Page>
      <Page.Title>{t('productions.create.title')}</Page.Title>
      <Page.Content>
        {getSuggestedEventsQuery.status === QueryStatus.LOADING ? (
          <Spinner marginTop={4} />
        ) : events.length === 0 ? (
          <Text>{t('productions.create.no_suggested_events_found')}</Text>
        ) : (
          <Stack spacing={5}>
            <Text>
              <Text fontWeight="bold">
                {t('productions.create.suggested_events')}
              </Text>{' '}
              {Math.round(similarity * 100)}%
            </Text>
            <Inline spacing={4}>
              {events.map((event) => {
                const id = event?.['@id'] && parseOfferId(event['@id']);
                return (
                  <Event
                    id={id}
                    key={id}
                    title={
                      event?.name?.[i18n.language] ??
                      event?.name?.[event.mainLanguage]
                    }
                    locationName={
                      event?.location?.name?.[i18n.language] ??
                      event?.location?.name?.[event.location.mainLanguage]
                    }
                    locationCity={
                      event?.location?.address?.[i18n.language]
                        ?.addressLocality ??
                      event?.location?.address?.[event.location.mainLanguage]
                        ?.addressLocality
                    }
                    organizerName={
                      event?.organizer?.name?.[i18n.language] ??
                      event?.organizer?.name?.[event.location.mainLanguage]
                    }
                    terms={event?.terms}
                    flex={1}
                    imageUrl={event?.image}
                    description={
                      event?.description?.[i18n.language] ??
                      event?.description?.[event.mainLanguage]
                    }
                    productionName={event?.production?.title}
                    calendarType={event?.calendarType}
                  />
                );
              })}
            </Inline>
            <Stack spacing={4}>
              {availableProductions.length === 2 ? (
                <RadioButtonGroup
                  name="production-names"
                  items={events
                    .map((event) =>
                      event.production
                        ? {
                            label: event.production.title,
                            value: event.production.id,
                          }
                        : undefined,
                    )
                    .filter((productionName) => productionName !== undefined)}
                  groupLabel={t('productions.create.production_name')}
                  selected={selectedProductionId}
                  onChange={(e) => {
                    setSelectedProductionId(e.target.value.toString());
                  }}
                />
              ) : (
                <FormElement
                  id="typeahead-productionname"
                  label={t('productions.create.production_name')}
                  Component={
                    <Typeahead
                      options={suggestedProductions}
                      labelKey={(production) => production.name}
                      disabled={!!selectedProduction}
                      placeholder={selectedProduction?.title}
                      maxWidth="43rem"
                      emptyLabel={t('productions.create.no_productions')}
                      minLength={minSearchLength}
                      onInputChange={debounce(handleInputSearch, 275)}
                      onChange={(selected) => {
                        if (!selected || selected.length !== 1) {
                          setSelectedProductionId(undefined);
                          return;
                        }
                        setSelectedProductionId(selected[0].production_id);
                      }}
                      ref={typeaheadComponent}
                    />
                  }
                />
              )}
              <Inline spacing={3}>
                <Button
                  variant={ButtonVariants.SUCCESS}
                  disabled={
                    status === ProductionStatus.MISSING ||
                    skipSuggestedEventsMutation.status === QueryStatus.LOADING
                  }
                  onClick={handleClickLink}
                  loading={isEditingProduction}
                >
                  {t('productions.create.link')}
                </Button>
                <Button
                  variant={ButtonVariants.DANGER}
                  onClick={() => {
                    skipSuggestedEventsMutation.mutate({
                      eventIds: events.map((event) =>
                        parseOfferId(event['@id']),
                      ),
                    });
                  }}
                  disabled={isEditingProduction}
                >
                  {t('productions.create.skip')}
                </Button>
              </Inline>
            </Stack>
          </Stack>
        )}
      </Page.Content>
    </Page>
  );
};

export const getServerSideProps = getApplicationServerSideProps();

export default Create;
