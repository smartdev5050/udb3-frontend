import { Button } from '@/ui/Button';
import { DatePeriodPicker } from '@/ui/DatePeriodPicker';
import { DatePicker } from '@/ui/DatePicker';
import { Typeahead } from '@/ui/Typeahead';
import { arrayToValue } from '@/utils/arrayToValue';
import { valueToArray } from '@/utils/valueToArray';

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

const getHourOptions = () => {
  const hours = Array(24).fill(0);
  const quarterHours = ['00', '15', '30', '45'];
  const times = [];
  hours.forEach((_hour, i) => {
    quarterHours.forEach((quarterHour) =>
      times.push(`${i > 9 ? i : `0${i}`}:${quarterHour}`),
    );
  });
  return times;
};

const hourOptions = getHourOptions();

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

        return (
          <div key={index}>
            <li>
              <span>{day.startDate}</span>
              <span> - </span>
              <span>{day.endDate}</span>
              <DatePeriodPicker
                id={`calendar-day-${index}-period`}
                dateStart={new Date(day.startDate)}
                dateEnd={new Date(day.endDate)}
                onDateStartChange={(newDate) =>
                  onChangeStartDate(index, newDate)
                }
                onDateEndChange={(newDate) => onChangeEndDate(index, newDate)}
              />
              <label htmlFor="startTime">Start</label>
              <Typeahead<string>
                inputType="time"
                name="startTime"
                id="startTime"
                customFilter={(time) => time.startsWith('0')}
                selected={valueToArray(startTime)}
                options={hourOptions}
                labelKey={(option) => option}
                onChange={([newValue]: string[]) => {
                  const [hours, minutes] = newValue.split(':');
                  onChangeStartHour(index, parseInt(hours), parseInt(minutes));
                }}
              />
              <label htmlFor="endTime">Start</label>
              <Typeahead<string>
                inputType="time"
                name="endTime"
                id="endTime"
                customFilter={(time) => time.startsWith('0')}
                options={hourOptions}
                selected={valueToArray(endTime)}
                labelKey={(option) => option}
                onChange={([newValue]: string[]) => {
                  const [hours, minutes] = newValue.split(':');
                  onChangeEndHour(index, parseInt(hours), parseInt(minutes));
                }}
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
