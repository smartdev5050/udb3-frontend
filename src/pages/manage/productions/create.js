import { useTranslation } from 'react-i18next';
import { Text } from '../../../components/publiq-ui/Text';
import { Page } from '../../../components/publiq-ui/Page';
import { TypeaheadWithLabel } from '../../../components/publiq-ui/TypeaheadWithLabel';
import { getInlineProps, Inline } from '../../../components/publiq-ui/Inline';
import { Button, ButtonVariants } from '../../../components/publiq-ui/Button';
import { Event } from '../../../components/manage/productions/create/Event';
import { getApplicationServerSideProps } from '../../../utils/getApplicationServerSideProps';
import { parseEventId } from '../../../utils/parseEventId';
import { useGetSuggestedEvents } from '../../../hooks/api/events';
import { memo, useState } from 'react';
import { useGetProductions } from '../../../hooks/api/productions';
import PropTypes from 'prop-types';
import { getStackProps, Stack } from '../../../components/publiq-ui/Stack';
import { RadioButtonGroup } from '../../../components/publiq-ui/RadioButtonGroup';
import { getBoxProps } from '../../../components/publiq-ui/Box';

const LinkAndSkipButtons = ({ shouldDisableLinkButton, ...props }) => {
  const { t } = useTranslation();
  return (
    <Inline spacing={3} {...getInlineProps(props)}>
      <Button
        variant={ButtonVariants.SUCCESS}
        disabled={shouldDisableLinkButton}
      >
        {t('productions.create.link')}
      </Button>
      <Button variant={ButtonVariants.DANGER}>
        {t('productions.create.skip')}
      </Button>
    </Inline>
  );
};

LinkAndSkipButtons.propTypes = {
  shouldDisableLinkButton: PropTypes.bool,
};

const ZeroOrOneProduction = ({
  productionName,
  onSearch,
  options,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <TypeaheadWithLabel
      id="typeahead-productionname"
      options={options}
      disabled={!!productionName}
      placeholder={productionName}
      allowNew
      newSelectionPrefix={t('productions.create.new_production')}
      maxWidth="43rem"
      label={t('productions.create.production_name')}
      emptyLabel={t('productions.create.no_productions')}
      onSearch={onSearch}
      {...getBoxProps(props)}
    />
  );
};

ZeroOrOneProduction.propTypes = {
  productionName: PropTypes.string,
  onSearch: PropTypes.func,
  options: PropTypes.array,
  className: PropTypes.string,
};

const TwoProductions = ({ productionNames, onChange, ...props }) => {
  const { t } = useTranslation();
  return (
    <RadioButtonGroup
      name="production-names"
      items={productionNames}
      groupLabel={t('productions.create.production_name')}
      onChange={onChange}
      {...getStackProps(props)}
    />
  );
};

TwoProductions.propTypes = {
  productionNames: PropTypes.array,
  onChange: PropTypes.func,
};

TwoProductions.defaultProps = {
  productionNames: [],
};

const Create = memo(() => {
  const { t, i18n } = useTranslation();
  const [searchInput, setSearchInput] = useState('');
  const [selectedProductionId, setSelectedProductionId] = useState('');

  const { data: suggestedEvents } = useGetSuggestedEvents();
  const { data: suggestedProductions } = useGetProductions({
    name: searchInput,
    limit: 10,
  });

  const suggestedProductionsData = suggestedProductions?.member ?? [];
  const events = suggestedEvents?.events ?? [];
  const similarity = suggestedEvents?.similarity ?? 0;

  const amountOfProductions = events.filter((event) => event.production).length;

  return (
    <Page>
      <Page.Title>{t('productions.create.title')}</Page.Title>
      <Page.Content spacing={5}>
        <Text>
          <Text fontWeight="bold">
            {t('productions.create.suggested_events')}
          </Text>{' '}
          {Math.round(similarity * 100)}%
        </Text>
        <Inline spacing={4}>
          {events.map((event) => {
            return (
              <Event
                id={parseEventId(event['@id'])}
                key={parseEventId(event['@id'])}
                title={event.name[i18n.language ?? event.mainLanguage]}
                locationName={
                  event.location.name[
                    i18n.language ?? event.location.mainLanguage
                  ]
                }
                locationCity={
                  event.location.address[
                    i18n.language ?? event.location.mainLanguage
                  ].addressLocality
                }
                terms={event.terms}
                flex={1}
                imageUrl={event.image}
                description={event.description[i18n.language]}
                productionName={event?.production?.title}
                calendarType={event.calendarType}
              />
            );
          })}
        </Inline>
        <Stack spacing={4}>
          {amountOfProductions === 2 ? (
            <TwoProductions
              productionNames={events
                .map((event) =>
                  event.production
                    ? {
                        label: event.production.title,
                        value: event.production.id,
                      }
                    : undefined,
                )
                .filter((productionName) => productionName !== undefined)}
              onChange={(e) => {
                setSelectedProductionId(e.target.value.toString());
              }}
            />
          ) : (
            <ZeroOrOneProduction
              onSearch={setSearchInput}
              options={suggestedProductionsData.map(
                (production) => production.name,
              )}
              productionName={
                events.find((event) => event?.production)?.production?.title
              }
            />
          )}
          <LinkAndSkipButtons shouldDisableLinkButton={!selectedProductionId} />
        </Stack>
      </Page.Content>
    </Page>
  );
});

export const getServerSideProps = getApplicationServerSideProps();

export default Create;
