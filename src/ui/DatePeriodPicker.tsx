import { useTranslation } from 'react-i18next';

import { DatePicker } from './DatePicker';
import type { InlineProps } from './Inline';
import { getInlineProps, Inline } from './Inline';
import { Label, LabelVariants } from './Label';
import { Stack } from './Stack';

type Props = InlineProps & {
  id: string;
  dateStart: Date;
  dateEnd: Date;
  onDateStartChange: (date: Date) => void;
  onDateEndChange: (date: Date) => void;
};

const DatePeriodPicker = ({
  id,
  dateStart,
  dateEnd,
  onDateStartChange,
  onDateEndChange,
  ...props
}: Props) => {
  const { t } = useTranslation();

  const idPrefix = `${id}date-period-picker`;

  return (
    <Inline as="div" spacing={5} {...getInlineProps(props)}>
      <Stack as="div">
        <Label variant={LabelVariants.BOLD} htmlFor={`${idPrefix}-start`}>
          {t('time_table.start')}
        </Label>
        <DatePicker
          id={`${idPrefix}-start`}
          selected={dateStart}
          onChange={(newDateStart) => {
            onDateStartChange(newDateStart);
            if (dateEnd.getTime() < newDateStart.getTime()) {
              onDateEndChange(newDateStart);
            }
          }}
        />
      </Stack>
      <Stack as="div">
        <Label variant={LabelVariants.BOLD} htmlFor={`${idPrefix}-end`}>
          {t('time_table.end')}
        </Label>
        <DatePicker
          id={`${idPrefix}-end`}
          selected={dateEnd}
          onChange={(newDateEnd) => {
            onDateEndChange(newDateEnd);
            if (dateStart.getTime() > newDateEnd.getTime()) {
              onDateStartChange(newDateEnd);
            }
          }}
          minDate={dateStart}
        />
      </Stack>
    </Inline>
  );
};

export { DatePeriodPicker };
