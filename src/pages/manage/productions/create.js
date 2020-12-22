import { useTranslation } from 'react-i18next';
import { Text } from '../../../components/publiq-ui/Text';
import { Page } from '../../../components/publiq-ui/Page';
import { Typeahead } from '../../../components/publiq-ui/Typeahead';
import { Inline } from '../../../components/publiq-ui/Inline';
import { Event } from '../../../components/manage/productions/create/Event';
import { getApplicationServerSideProps } from '../../../utils/getApplicationServerSideProps';
import { parseEventId } from '../../../utils/parseEventId';
import { useGetSuggestedEvents } from '../../../hooks/api/events';
import { memo, useState } from 'react';
import { useGetProductions } from '../../../hooks/api/productions';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';

const ZeroOrOneProduction = ({
  productionName,
  onSearch: handleSearch,
  options,
}) => {
  return (
    <Typeahead
      options={options}
      disabled={!!productionName}
      defaultInputValue={productionName}
      onSearch={handleSearch}
      maxWidth="43rem"
    />
  );
};

ZeroOrOneProduction.propTypes = {
  productionName: PropTypes.string,
  onSearch: PropTypes.func,
  options: PropTypes.array,
};

const TwoProductions = () => {
  return <div>two</div>;
};

const Create = memo(() => {
  const { t, i18n } = useTranslation();
  const [searchInput, setSearchInput] = useState('');

  const { data: suggestedEvents } = useGetSuggestedEvents();
  const { data: suggestedProductions } = useGetProductions({
    name: searchInput,
    limit: 10,
  });

  const suggestedProductionsData = suggestedProductions?.member ?? [];
  const events = suggestedEvents?.events ?? [];
  const similarity = suggestedEvents?.similarity ?? 0;

  const amountOfProductions = events.filter((event) => event.production).length;

  const handleInputSearch = (searchTerm) => {
    debounce(() => setSearchInput(searchTerm), 275)();
  };

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
        {amountOfProductions === 2 ? (
          <TwoProductions />
        ) : (
          <ZeroOrOneProduction
            onSearch={handleInputSearch}
            options={suggestedProductionsData.map(
              (production) => production.name,
            )}
            productionName={
              events.find((event) => event?.production)?.production?.title
            }
          />
        )}
      </Page.Content>
    </Page>
  );
});

export const getServerSideProps = getApplicationServerSideProps();

export default Create;
