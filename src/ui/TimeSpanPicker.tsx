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
    minutes.forEach((minute, minuteIndex) =>
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
          {t('time_table.start')}
        </Label>
        <Typeahead<string>
          name="startTime"
          id="startTime"
          customFilter={(time) =>
            quarterHours.some((quarterHour) => time.endsWith(quarterHour))
          }
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
          {t('time_table.end')}
        </Label>
        <Typeahead<string>
          inputType="time"
          name="endTime"
          id="endTime"
          customFilter={(time) =>
            quarterHours.some((quarterHour) => time.endsWith(quarterHour))
          }
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
