import truncate from 'lodash/truncate';
import { PropTypes } from 'prop-types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import stripHTML from 'string-strip-html';

import { CalendarType } from '@/constants/CalendarType';
import { useGetCalendarSummary } from '@/hooks/api/events';
import { Alert, AlertVariants } from '@/ui/Alert';
import { Card } from '@/ui/Card';
import { Image } from '@/ui/Image';
import { Inline } from '@/ui/Inline';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { Title } from '@/ui/Title';

const Event = ({
  terms,
  title,
  id,
  locationName,
  locationCity,
  organizerName,
  imageUrl,
  description: rawDescription,
  productionName,
  calendarType,
  ...props
}) => {
  const { t, i18n } = useTranslation();

  const type = useMemo(() => {
    const typeId = terms.find((term) => term.domain === 'eventtype')?.id ?? '';
    // The custom keySeparator was necessary because the ids contain '.' which i18n uses as default keySeparator
    return t(`offerTypes*${typeId}`, { keySeparator: '*' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terms]);

  const getCalendarSummaryQuery = useGetCalendarSummary({
    id,
    locale: i18n.language,
    format: calendarType === CalendarType.SINGLE ? 'lg' : 'sm',
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
            <Text>{getCalendarSummaryQuery.data}</Text>
          </Stack>
          <Text>
            {locationName} {locationCity}
          </Text>
          {!!organizerName && <Text>{organizerName}</Text>}
        </Stack>
        {imageUrl && (
          <Image
            width="10rem"
            height="10rem"
            src={imageUrl}
            alt={description}
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
  organizerName: PropTypes.string,
  imageUrl: PropTypes.string,
  description: PropTypes.string,
  productionName: PropTypes.string,
  calendarType: PropTypes.string,
};

Event.defaultProps = {
  locationName: '',
  locationCity: '',
  organizerName: '',
  terms: [],
  description: '',
  title: '',
  calendarType: CalendarType.SINGLE,
};

export { Event };
