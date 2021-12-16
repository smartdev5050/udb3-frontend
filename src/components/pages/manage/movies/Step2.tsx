import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Alert, AlertVariants } from '@/ui/Alert';
import { Box } from '@/ui/Box';
import type { StackProps } from '@/ui/Stack';
import { getStackProps } from '@/ui/Stack';
import {
  areAllTimeSlotsValid,
  isTimeTableEmpty,
  TimeTable,
} from '@/ui/TimeTable';

import type { StepProps } from './MoviePage';
import { Step } from './Step';

type Step2Props = StackProps & StepProps;

const Step2 = ({
  errors,
  control,
  className,
  onChange,
  ...props
}: Step2Props) => {
  const { t } = useTranslation();

  return (
    <Step stepNumber={2} spacing={3} {...getStackProps(props)}>
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
      {errors?.timeTable ? (
        <Alert visible variant={AlertVariants.DANGER} maxWidth="53rem">
          {t(
            `movies.create.validation_messages.timeTable.${errors.timeTable.type}`,
          )}
        </Alert>
      ) : null}
    </Step>
  );
};

export { Step2 };
