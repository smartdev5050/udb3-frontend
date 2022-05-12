import { format, isMatch, nextWednesday, parse, set } from 'date-fns';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { CalendarType } from '@/constants/CalendarType';
import { useChangeCalendarMutation } from '@/hooks/api/events';
import type { FormDataIntersection, StepProps } from '@/pages/Steps';
import { Alert, AlertVariants } from '@/ui/Alert';
import { Box } from '@/ui/Box';
import type { StackProps } from '@/ui/Stack';
import { getStackProps, Stack } from '@/ui/Stack';
import { isOneTimeSlotValid, TimeTableValue } from '@/ui/TimeTable';
import {
  areAllTimeSlotsValid,
  isTimeTableEmpty,
  TimeTable,
} from '@/ui/TimeTable';
import { formatDateToISO } from '@/utils/formatDateToISO';

type EncodedTimeTable = Array<{ start: string; end: string }>;

const convertTimeTableToSubEvents = (timeTable: TimeTableValue) => {
  const { data = {} } = timeTable;
  return Object.keys(data).reduce<EncodedTimeTable>(
    (acc, date) => [
      ...acc,
      ...Object.keys(data[date]).reduce<EncodedTimeTable>((acc, index) => {
        const time = data[date][index];

        if (!time || !isMatch(time, "HH'h'mm'm'")) {
          return acc;
        }

        const isoDate = formatDateToISO(
          set(parse(date, 'dd/MM/yyyy', new Date()), {
            hours: parseInt(time.substring(0, 2)),
            minutes: parseInt(time.substring(3, 5)),
            seconds: 0,
          }),
        );

        return [
          ...acc,
          {
            start: isoDate,
            end: isoDate,
          },
        ];
      }, []),
    ],
    [],
  );
};

const useEditCalendar = <TFormData extends FormDataIntersection>({
  eventId,
  onSuccess,
}) => {
  const changeCalendarMutation = useChangeCalendarMutation({
    onSuccess: () => onSuccess('calendar', { shouldInvalidateEvent: false }),
  });

  return async ({ timeTable }: TFormData) => {
    await changeCalendarMutation.mutateAsync({
      id: eventId,
      calendarType: CalendarType.MULTIPLE,
      timeSpans: convertTimeTableToSubEvents(timeTable),
    });
  };
};

type TimeTableStepProps<TFormData extends FormDataIntersection> = StackProps &
  StepProps<TFormData>;

const TimeTableStep = <TFormData extends FormDataIntersection>({
  formState: { errors },
  control,
  className,
  field,
  onChange,
  ...props
}: TimeTableStepProps<TFormData>) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={3} {...getStackProps(props)}>
      <Box>
        <Controller<TFormData>
          name={field}
          control={control}
          render={({ field }) => {
            return (
              <TimeTable
                id="timetable-movies"
                className={className}
                value={field.value as TimeTableValue}
                onChange={(value) => {
                  field.onChange(value);

                  if (isTimeTableEmpty(value) || areAllTimeSlotsValid(value)) {
                    onChange(value);
                  }
                }}
              />
            );
          }}
        />
      </Box>
      {errors?.timeTable && (
        <Alert visible variant={AlertVariants.DANGER} maxWidth="53rem">
          {t(
            `movies.create.validation_messages.timeTable.${errors.timeTable.type}`,
          )}
        </Alert>
      )}
    </Stack>
  );
};

const formatDate = (date: Date) => format(date, 'dd/MM/yyyy');
const nextWeekWednesday = nextWednesday(new Date());

const timeTableStepConfiguration = {
  Component: TimeTableStep,
  defaultValue: {
    data: {},
    dateStart: formatDate(nextWeekWednesday),
    dateEnd: formatDate(nextWeekWednesday),
  },
  validation: yup
    .mixed()
    .test({
      name: 'all-timeslots-valid',
      test: (timeTableData) => areAllTimeSlotsValid(timeTableData),
    })
    .test({
      name: 'has-timeslot',
      test: (timeTableData) => !isTimeTableEmpty(timeTableData),
    })
    .required(),
  field: 'timeTable',
  shouldShowNextStep: ({ watch }) => {
    const watchedTimeTable = watch('timeTable');
    return isOneTimeSlotValid(watchedTimeTable);
  },
  title: (t) => t(`movies.create.step2.title`),
};

export {
  convertTimeTableToSubEvents,
  timeTableStepConfiguration,
  useEditCalendar,
};
