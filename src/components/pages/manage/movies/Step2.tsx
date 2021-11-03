import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Alert, AlertVariants } from '@/ui/Alert';
import type { StackProps } from '@/ui/Stack';
import { getStackProps } from '@/ui/Stack';
import { TimeTable } from '@/ui/TimeTable';

import type { StepProps } from './create';
import { Step } from './Step';

type Step2Props = StackProps &
  StepProps & { dateStart: string; onDateStartChange: (date: Date) => void };

const Step2 = ({
  errors,
  control,
  dateStart,
  onDateStartChange,
  ...props
}: Step2Props) => {
  const { t } = useTranslation();

  return (
    <Step stepNumber={2} {...getStackProps(props)}>
      <Controller
        name="timeTable"
        control={control}
        render={({ field }) => {
          return (
            <TimeTable
              id="timetable-movies"
              value={field.value}
              onChange={(value) => field.onChange(value)}
              dateStart={dateStart}
              onDateStartChange={onDateStartChange}
              {...getStackProps(props)}
            />
          );
        }}
      />

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
