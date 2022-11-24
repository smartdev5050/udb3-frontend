import { Button, ButtonSizes, ButtonVariants } from '@/ui/Button';
import { DatePeriodPicker } from '@/ui/DatePeriodPicker';
import { Icons } from '@/ui/Icon';
import { List } from '@/ui/List';
import { getStackProps, StackProps } from '@/ui/Stack';
import { TimeSpanPicker } from '@/ui/TimeSpanPicker';

import {
  useCalendarSelector,
  useIsOneOrMoreDays,
} from './machines/calendarMachine';

type ChangeTimeHandler = (
  index: number,
  hours: number,
  minutes: number,
) => void;

const createChangeTimeHandler = (
  index: number,
  changeTimeHandler: ChangeTimeHandler,
) => (newValue: string) => {
  const [hours, minutes] = newValue.split(':');
  changeTimeHandler(index, parseInt(hours), parseInt(minutes));
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
  onDeleteDay?: (index: number) => void;
  onChangeStartDate: (index: number, date: Date | null) => void;
  onChangeEndDate: (index: number, date: Date | null) => void;
  onChangeStartTime?: (index: number, hours: number, minutes: number) => void;
  onChangeEndTime?: (index: number, hours: number, minutes: number) => void;
} & StackProps;

export const Days = ({
  onDeleteDay,
  onChangeStartDate,
  onChangeEndDate,
  onChangeStartTime,
  onChangeEndTime,
  ...props
}: DaysProps) => {
  const days = useCalendarSelector((state) => state.context.days);

  const isOneOrMoreDays = useIsOneOrMoreDays();

  return (
    <List spacing={4} {...getStackProps(props)}>
      {days.map((day, index) => {
        const startTime = getStartTime(day);
        const endTime = getEndTime(day);

        const handleChangeStartTime = createChangeTimeHandler(
          index,
          onChangeStartTime,
        );
        const handleChangeEndTime = createChangeTimeHandler(
          index,
          onChangeEndTime,
        );

        return (
          <List.Item alignItems="center" key={index} spacing={5}>
            <DatePeriodPicker
              spacing={3}
              id={`calendar-step-day-${index}`}
              dateStart={new Date(day.startDate)}
              dateEnd={new Date(day.endDate)}
              onDateStartChange={(newDate) => onChangeStartDate(index, newDate)}
              onDateEndChange={(newDate) => onChangeEndDate(index, newDate)}
            />
            {isOneOrMoreDays && (
              <TimeSpanPicker
                spacing={3}
                id={`calendar-step-day-${index}`}
                startTime={startTime}
                endTime={endTime}
                onChangeStartTime={handleChangeStartTime}
                onChangeEndTime={handleChangeEndTime}
              />
            )}

            {days.length > 1 && (
              <Button
                alignSelf="flex-end"
                size={ButtonSizes.SMALL}
                variant={ButtonVariants.DANGER}
                onClick={() => onDeleteDay(index)}
                iconName={Icons.TRASH}
              />
            )}
          </List.Item>
        );
      })}
    </List>
  );
};
