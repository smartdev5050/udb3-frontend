import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PropTypes } from 'prop-types';
import { Alert, AlertVariants } from '../../../publiq-ui/Alert';
import { Card } from '../../../publiq-ui/Card';
import { Image } from '../../../publiq-ui/Image';
import { Inline } from '../../../publiq-ui/Inline';
import { Stack } from '../../../publiq-ui/Stack';
import { Text } from '../../../publiq-ui/Text';
import { Title } from '../../../publiq-ui/Title';
import { useGetCalendarSummary } from '../../../../hooks/api/events';

import { truncate } from 'lodash';
import stripHTML from 'string-strip-html';

const Event = ({
  terms,
  title,
  id,
  locationName,
  locationCity,
  imageUrl,
  description: rawDescription,
  productionName,
  calendarType,
  ...props
}) => {
  const { t, i18n } = useTranslation();

  const type = useMemo(() => {
    const typeId = terms.find((term) => term.domain === 'eventtype')?.id ?? '';
    return t(`offerTypes*${typeId}`, { keySeparator: '*' });
  }, [terms]);

  const { data: period } = useGetCalendarSummary({
    id,
    locale: i18n.language,
    format: calendarType === 'single' ? 'lg' : 'sm',
  });

  const description = useMemo(() => {
    if (typeof document === 'undefined') return '';
    const dummyInput = document.createElement('textarea');
    dummyInput.innerHTML = stripHTML(rawDescription).result;
    const description = dummyInput.value;
    return truncate(description, { length: 750 });
  }, [rawDescription]);

  return (
    <Card {...props} spacing={5} padding={5}>
      <Inline justifyContent="space-between" spacing={5}>
        <Stack spacing={4}>
          <Text>{type}</Text>
          <Stack>
            <Title>{title}</Title>
            <Text>{period}</Text>
          </Stack>
          <Text>
            {locationName} {locationCity}
          </Text>
        </Stack>
        {imageUrl && (
          <Image
            width="10rem"
            height="10rem"
            src={imageUrl}
            backgroundRepeat="no-repeat"
            backgroundPosition="center center"
            objectFit="cover"
          />
        )}
      </Inline>

      <Text>{description}</Text>

      <Alert variant={AlertVariants.DARK} visible={!!productionName}>
        {t('productions.event.part_of_production')}{' '}
        <Text fontWeight="bold">{productionName}</Text>
      </Alert>
    </Card>
  );
};

Event.propTypes = {
  terms: PropTypes.array,
  title: PropTypes.string,
  id: PropTypes.string,
  locationName: PropTypes.string,
  locationCity: PropTypes.string,
  imageUrl: PropTypes.string,
  description: PropTypes.string,
  productionName: PropTypes.string,
  calendarType: PropTypes.string,
};

Event.defaultProps = {
  locationName: '',
  locationCity: '',
  terms: [],
  description: '',
  title: '',
  calendarType: 'single',
};

export { Event };
