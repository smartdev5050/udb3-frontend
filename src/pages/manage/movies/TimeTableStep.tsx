import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { StepProps } from '@/pages/Steps';
import { Alert, AlertVariants } from '@/ui/Alert';
import { Box } from '@/ui/Box';
import type { StackProps } from '@/ui/Stack';
import { getStackProps, Stack } from '@/ui/Stack';
import {
  areAllTimeSlotsValid,
  isTimeTableEmpty,
  TimeTable,
} from '@/ui/TimeTable';

import type { FormData } from './MovieForm';

type TimeTableStepProps = StackProps & StepProps<FormData>;

const TimeTableStep = ({
  formState: { errors },
  control,
  className,
  onChange,
  ...props
}: TimeTableStepProps) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={3} {...getStackProps(props)}>
      <Box>
        <Controller
          name="timeTable"
          control={control}
          render={({ field }) => {
            return (
              <TimeTable
                id="timetable-movies"
                className={className}
                value={field.value}
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

export { TimeTableStep };
