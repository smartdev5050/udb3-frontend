import { Button } from '@/ui/Button';
import { DatePeriodPicker } from '@/ui/DatePeriodPicker';
import { TimeSpanPicker } from '@/ui/TimeSpanPicker';

type ChangeTimeHandler = (
  index: number,
  hours: number,
  minutes: number,
) => void;

const createChangeTimeHandler = (changeTimeHandler: ChangeTimeHandler) => (
  newValue: string,
) => {
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
};

export const Days = ({
  days,
  onDeleteDay,
  onChangeStartDate,
  onChangeEndDate,
  onChangeStartHour,
  onChangeEndHour,
}: DaysProps) => {
  return (
    <ul>
      {days.map((day, index) => {
        const startTime = getStartTime(day);
        const endTime = getEndTime(day);

        const handleChangeStartTime = createChangeTimeHandler(
          onChangeStartHour,
        );
        const handleChangeEndTime = createChangeTimeHandler(onChangeEndHour);

        return (
          <div key={index}>
            <li>
              <span>{day.startDate}</span>
              <span> - </span>
              <span>{day.endDate}</span>
              <DatePeriodPicker
                id={`calendar-step-day-${index}`}
                dateStart={new Date(day.startDate)}
                dateEnd={new Date(day.endDate)}
                onDateStartChange={(newDate) =>
                  onChangeStartDate(index, newDate)
                }
                onDateEndChange={(newDate) => onChangeEndDate(index, newDate)}
              />
              <TimeSpanPicker
                id={`calendar-step-day-${index}`}
                startTime={startTime}
                endTime={endTime}
                onChangeStartTime={handleChangeStartTime}
                onChangeEndTime={handleChangeEndTime}
              />
              {days.length > 1 && (
                <Button onClick={() => onDeleteDay(index)}> X</Button>
              )}
            </li>
            <hr />
          </div>
        );
      })}
    </ul>
  );
};
