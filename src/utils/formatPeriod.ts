import { differenceInDays, format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import nl from 'date-fns/locale/nl-BE';
import capitalize from 'lodash/capitalize';
import type { TFunction } from 'react-i18next';

const locales = {
  nl,
  fr,
};

const formatPeriod = (
  startDate: Date | string,
  endDate: Date | string,
  locale: string,
  t: TFunction<'translation'>,
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const formatTypeDate = 'EEEE d MMMM yyyy';
  const formatTypeTime = 'HH:mm';

  const formattedDateStart = format(start, formatTypeDate, {
    locale: locales[locale],
  });
  const formattedTimeStart = format(start, formatTypeTime);

  const formattedDateEnd = format(end, formatTypeDate, {
    locale: locales[locale],
  });
  const formattedTimeEnd = format(end, formatTypeTime);

  if (differenceInDays(start, end) === 0) {
    return capitalize(
      `${formattedDateStart} ${t(
        'calendarSummary.from',
      )} ${formattedTimeStart} ${t(
        'calendarSummary.till',
      )} ${formattedTimeEnd}`,
    );
  }

  return `${t('calendarSummary.from')} ${formattedDateStart} ${t(
    'calendarSummary.at',
  )} ${formattedTimeStart} ${t('calendarSummary.till')} ${formattedDateEnd} ${t(
    'calendarSummary.at',
  )} ${formattedTimeEnd}`;
};

export { formatPeriod };
