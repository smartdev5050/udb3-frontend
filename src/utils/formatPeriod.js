import { differenceInDays, format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import nl from 'date-fns/locale/nl-BE';
import capitalize from 'lodash/capitalize';

const locales = {
  nl,
  fr,
};

const formatPeriod = (startDate, endDate, locale, t) => {
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
