import { ChangeEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, ButtonVariants } from '@/ui/Button';
import { DatePeriodPicker } from '@/ui/DatePeriodPicker';
import { FormElement } from '@/ui/FormElement';
import { List } from '@/ui/List';
import { RadioButtonGroup } from '@/ui/RadioButtonGroup';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';

import {
  OpeningHour,
  useCalendarSelector,
  useIsPeriodic,
  useIsPermanent,
} from '../machines/calendarMachine';
import { CalendarOpeninghoursModal } from './CalendarOpeninghoursModal';

const FixedDayOptions = {
  PERMANENT: 'permanent',
  PERIODIC: 'periodic',
} as const;

const options = [
  {
    label: 'Met start-en einddatum',
    value: FixedDayOptions.PERIODIC,
  },
  {
    label: 'Permanent',
    value: FixedDayOptions.PERMANENT,
  },
];

type FixedDaysProps = {
  onChooseWithStartAndEndDate: () => void;
  onChoosePermanent: () => void;
  onChangeStartDate: (date: Date | null) => void;
  onChangeEndDate: (date: Date | null) => void;
  onChangeOpeningHours: (newOpeningHours: OpeningHour[]) => void;
};

export const FixedDays = ({
  onChooseWithStartAndEndDate,
  onChoosePermanent,
  onChangeStartDate,
  onChangeEndDate,
  onChangeOpeningHours,
}: FixedDaysProps) => {
  const { t } = useTranslation();

  const [
    isCalendarOpeninghoursModalVisible,
    setIsCalendarOpeninghoursModalVisible,
  ] = useState(false);

  const isPeriodic = useIsPeriodic();
  const isPermanent = useIsPermanent();

  const startDate = useCalendarSelector((state) => state.context.startDate);
  const endDate = useCalendarSelector((state) => state.context.endDate);

  const openingHours = useCalendarSelector(
    (state) => state.context.openingHours,
  );

  const hasOpeningHours = openingHours.length > 0;

  const handleChangeOption = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === FixedDayOptions.PERIODIC) {
      onChooseWithStartAndEndDate();
    }
    if (value === FixedDayOptions.PERMANENT) {
      onChoosePermanent();
    }
  };

  const selectedOption = useMemo(() => {
    if (isPermanent) {
      return FixedDayOptions.PERMANENT;
    }
    return FixedDayOptions.PERIODIC;
  }, [isPermanent]);

  return (
    <Stack spacing={5} alignItems="flex-start">
      <FormElement
        Component={
          <RadioButtonGroup
            name="fixed-days-options"
            items={options}
            selected={selectedOption}
            onChange={handleChangeOption}
          />
        }
        id="fixed-days-options"
      />
      {isPeriodic && (
        <DatePeriodPicker
          key="date-period-picker"
          spacing={3}
          id={`calendar-step-fixed`}
          dateStart={new Date(startDate)}
          dateEnd={new Date(endDate)}
          onDateStartChange={onChangeStartDate}
          onDateEndChange={onChangeEndDate}
        />
      )}
      {hasOpeningHours && (
        <List width="75%">
          <List.Item
            alignItems="center"
            paddingTop={3}
            paddingBottom={3}
            justifyContent="space-between"
            spacing={5}
          >
            <Text fontWeight="bold">Openingsuren</Text>
            <Button
              key="date-change-openinghours-button"
              variant={ButtonVariants.SECONDARY}
              onClick={() => setIsCalendarOpeninghoursModalVisible(true)}
            >
              Openingsuren wijzigen
            </Button>
          </List.Item>
          {openingHours.map((openingHour, index) => (
            <List.Item
              paddingTop={2}
              paddingBottom={2}
              css={`
                border-top: 1px solid lightgrey;
              `}
              justifyContent="space-between"
              key={index}
            >
              <Text>
                {openingHour.dayOfWeek
                  .map((dayOfWeek) =>
                    t(`create.calendar.days.full.${dayOfWeek}`),
                  )
                  .join(', ')}
              </Text>
              <Text>
                {openingHour.opens} - {openingHour.closes}
              </Text>
            </List.Item>
          ))}
        </List>
      )}
      {!hasOpeningHours && (
        <Button
          key="date-add-openinghours-button"
          variant={ButtonVariants.SECONDARY}
          onClick={() => setIsCalendarOpeninghoursModalVisible(true)}
        >
          Openingsuren toevoegen
        </Button>
      )}
      <CalendarOpeninghoursModal
        visible={isCalendarOpeninghoursModalVisible}
        onClose={() => setIsCalendarOpeninghoursModalVisible(false)}
      />
    </Stack>
  );
};
