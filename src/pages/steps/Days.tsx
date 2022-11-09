import { Button } from '@/ui/Button';
import { DatePeriodPicker } from '@/ui/DatePeriodPicker';
import { List } from '@/ui/List';
import { getStackProps, StackProps } from '@/ui/Stack';
import { TimeSpanPicker } from '@/ui/TimeSpanPicker';

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
  days: any[];
  onDeleteDay: (index: number) => void;
  onChangeStartDate: (index: number, date: Date | null) => void;
  onChangeEndDate: (index: number, date: Date | null) => void;
  onChangeStartHour: (index: number, hours: number, minutes: number) => void;
  onChangeEndHour: (index: number, hours: number, minutes: number) => void;
} & StackProps;

export const Days = ({
  days,
  onDeleteDay,
  onChangeStartDate,
  onChangeEndDate,
  onChangeStartHour,
  onChangeEndHour,
  ...props
}: DaysProps) => {
  return (
    <List {...getStackProps(props)}>
      {days.map((day, index) => {
        const startTime = getStartTime(day);
        const endTime = getEndTime(day);

        const handleChangeStartTime = createChangeTimeHandler(
          index,
          onChangeStartHour,
        );
        const handleChangeEndTime = createChangeTimeHandler(
          index,
          onChangeEndHour,
        );

        return (
          <List.Item key={index} spacing={5}>
            <DatePeriodPicker
              spacing={3}
              id={`calendar-step-day-${index}`}
              dateStart={new Date(day.startDate)}
              dateEnd={new Date(day.endDate)}
              onDateStartChange={(newDate) => onChangeStartDate(index, newDate)}
              onDateEndChange={(newDate) => onChangeEndDate(index, newDate)}
            />
            <TimeSpanPicker
              spacing={3}
              id={`calendar-step-day-${index}`}
              startTime={startTime}
              endTime={endTime}
              onChangeStartTime={handleChangeStartTime}
              onChangeEndTime={handleChangeEndTime}
            />
            {days.length > 1 && (
              <Button onClick={() => onDeleteDay(index)}> X</Button>
            )}
          </List.Item>
        );
      })}
    </List>
  );
};
