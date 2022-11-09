import { useTranslation } from 'react-i18next';

import { getInlineProps, Inline, InlineProps } from './Inline';
import { Label, LabelVariants } from './Label';
import { Stack } from './Stack';
import { Typeahead } from './Typeahead';

const getHourOptions = () => {
  const hours = Array(24).fill(0);
  const minutes = Array(59).fill(0);
  const times = [];
  hours.forEach((_hour, i) => {
    minutes.forEach((_minute, minuteIndex) =>
      times.push(
        `${i > 9 ? i : `0${i}`}:${
          minuteIndex > 9 ? minuteIndex : `0${minuteIndex}`
        }`,
      ),
    );
  });
  return times;
};

const hourOptions = getHourOptions();

const quarterHours = ['00', '15', '30', '45'];

type Props = {
  id: string;
  startTime?: string;
  endTime?: string;
  onChangeStartTime: (newStartTime: string) => void;
  onChangeEndTime: (newEndTime: string) => void;
} & InlineProps;

const isQuarterHour = (time: string) =>
  quarterHours.some((quarterHour) => time.endsWith(quarterHour));

const timesToNumeric = (startTime: string, endTime: string) => {
  const startTimeValue = parseInt(startTime.replace(':', ''));
  const endTimeValue = parseInt(endTime.replace(':', ''));

  return [startTimeValue, endTimeValue];
};

const filterStartTimes = (time: string, endTime: string) => {
  const [startTimeValue, endTimeValue] = timesToNumeric(time, endTime);
  const isBeforeEndTime = startTimeValue < endTimeValue;

  return isQuarterHour(time) && isBeforeEndTime;
};

const filterEndTimes = (time: string, startTime: string) => {
  const [startTimeValue, endTimeValue] = timesToNumeric(startTime, time);
  const isAfterStartTime = startTimeValue < endTimeValue;

  return isQuarterHour(time) && isAfterStartTime;
};

const TimeSpanPicker = ({
  id,
  startTime,
  endTime,
  onChangeStartTime,
  onChangeEndTime,
  ...props
}: Props) => {
  const { t } = useTranslation();
  const idPrefix = `${id}-time-span-picker`;

  return (
    <Inline as="div" spacing={5} {...getInlineProps(props)}>
      <Stack spacing={2} as="div">
        <Label variant={LabelVariants.BOLD} htmlFor={`${idPrefix}-start`}>
          {t('time_span_picker.start')}
        </Label>
        <Typeahead<string>
          name="startTime"
          id="startTime"
          customFilter={(time) => filterStartTimes(time, endTime)}
          inputType="time"
          defaultInputValue={startTime}
          options={hourOptions}
          labelKey={(option) => option}
          onBlur={(event) => onChangeStartTime(event.target.value)}
          onChange={([newValue]: string[]) => {
            if (!newValue) return;
            onChangeStartTime(newValue);
          }}
        />
      </Stack>
      <Stack spacing={2} as="div">
        <Label variant={LabelVariants.BOLD} htmlFor={`${idPrefix}-end`}>
          {t('time_span_picker.end')}
        </Label>
        <Typeahead<string>
          inputType="time"
          name="endTime"
          id="endTime"
          customFilter={(time) => filterEndTimes(time, startTime)}
          defaultInputValue={endTime}
          options={hourOptions}
          labelKey={(option) => option}
          onBlur={(event) => onChangeEndTime(event.target.value)}
          onChange={([newValue]: string[]) => {
            if (!newValue) return;
            onChangeEndTime(newValue);
          }}
        />
      </Stack>
    </Inline>
  );
};

export { TimeSpanPicker };
