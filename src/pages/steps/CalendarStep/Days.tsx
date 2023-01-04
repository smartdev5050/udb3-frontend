import { camelCase } from 'lodash';
import { useTranslation } from 'react-i18next';

import { BookingAvailabilityType } from '@/constants/BookingAvailabilityType';
import { OfferStatus } from '@/constants/OfferStatus';
import { Alert, AlertVariants } from '@/ui/Alert';
import { Button, ButtonSizes, ButtonVariants } from '@/ui/Button';
import { DatePeriodPicker } from '@/ui/DatePeriodPicker';
import { Icons } from '@/ui/Icon';
import { List } from '@/ui/List';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { TimeSpanPicker } from '@/ui/TimeSpanPicker';

import {
  useCalendarSelector,
  useIsOneOrMoreDays,
} from '../machines/calendarMachine';

type ChangeTimeHandler = (id: string, hours: number, minutes: number) => void;

const createChangeTimeHandler =
  (id: string, changeTimeHandler: ChangeTimeHandler) => (newValue: string) => {
    const [hours, minutes] = newValue.split(':');
    changeTimeHandler(id, parseInt(hours), parseInt(minutes));
  };

const getEndTime = (day: any) => {
  const end = new Date(day.endDate);
  const endHour = end.getHours().toString().padStart(2, '0');
  const endMinutes = end.getMinutes().toString().padStart(2, '0');
  const endTime = endHour ? `${endHour}:${endMinutes}` : `00:00`;
  return endTime;
};

const getStartTime = (day: any) => {
  const start = new Date(day.startDate);
  const startHour = start.getHours().toString().padStart(2, '0');
  const startMinutes = start.getMinutes().toString().padStart(2, '0');
  const startTime = startHour ? `${startHour}:${startMinutes}` : `00:00`;
  return startTime;
};

type DaysProps = {
  onDeleteDay?: (id: string) => void;
  onChangeStartDate: (id: string, date: Date | null) => void;
  onChangeEndDate: (id: string, date: Date | null) => void;
  onChangeStartTime?: (id: string, hours: number, minutes: number) => void;
  onChangeEndTime?: (id: string, hours: number, minutes: number) => void;
} & StackProps;

export const Days = ({
  onDeleteDay,
  onChangeStartDate,
  onChangeEndDate,
  onChangeStartTime,
  onChangeEndTime,
  ...props
}: DaysProps) => {
  const { t } = useTranslation();

  const days = useCalendarSelector((state) => state.context.days);

  const isOneOrMoreDays = useIsOneOrMoreDays();

  return (
    <List spacing={4} {...getStackProps(props)}>
      {days.map((day) => {
        const startTime = getStartTime(day);
        const endTime = getEndTime(day);

        const handleChangeStartTime = createChangeTimeHandler(
          day.id,
          onChangeStartTime,
        );
        const handleChangeEndTime = createChangeTimeHandler(
          day.id,
          onChangeEndTime,
        );

        const isDisabled = day.status.type !== OfferStatus.AVAILABLE;

        const isBookingUnavailable =
          day.bookingAvailability.type === BookingAvailabilityType.UNAVAILABLE;

        return (
          <Stack spacing={4} key={`list-item-${day.id}`}>
            <List.Item alignItems="center" spacing={5}>
              <DatePeriodPicker
                spacing={3}
                id={`calendar-step-day-${day.id}`}
                dateStart={new Date(day.startDate)}
                dateEnd={new Date(day.endDate)}
                onDateStartChange={(newDate) =>
                  onChangeStartDate(day.id, newDate)
                }
                onDateEndChange={(newDate) => onChangeEndDate(day.id, newDate)}
                disabled={isDisabled}
              />
              {isOneOrMoreDays && (
                <TimeSpanPicker
                  spacing={3}
                  id={`calendar-step-day-${day.id}`}
                  startTime={startTime}
                  endTime={endTime}
                  onChangeStartTime={handleChangeStartTime}
                  onChangeEndTime={handleChangeEndTime}
                  disabled={isDisabled}
                />
              )}
              {days.length > 1 && (
                <Button
                  alignSelf="flex-end"
                  size={ButtonSizes.SMALL}
                  variant={ButtonVariants.DANGER}
                  onClick={() => onDeleteDay(day.id)}
                  iconName={Icons.TRASH}
                  disabled={isDisabled}
                />
              )}
            </List.Item>
            {isDisabled && (
              <Alert
                variant={AlertVariants.PRIMARY}
                fullWidth
                css={`
                  width: 100%;
                `}
              >
                {t(`offerStatus.status.events.${camelCase(day.status.type)}`)}
                {day.status.reason.nl ? `: ${day.status.reason.nl}` : ''}
              </Alert>
            )}
            {isBookingUnavailable && (
              <Alert
                variant={AlertVariants.PRIMARY}
                fullWidth
                css={`
                  width: 100%;
                `}
              >
                {t(`bookingAvailability.unavailable`)}
              </Alert>
            )}
          </Stack>
        );
      })}
    </List>
  );
};
