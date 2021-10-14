import { Controller } from 'react-hook-form';

import { Alert, AlertVariants } from '@/ui/Alert';
import type { StackProps } from '@/ui/Stack';
import { getStackProps } from '@/ui/Stack';
import { TimeTable } from '@/ui/TimeTable';

import { Step } from './Step';

type Step2Props = StackProps;

const Step2 = ({ errors, control, ...props }: Step2Props) => {
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
              {...getStackProps(props)}
            />
          );
        }}
      />

      {errors?.timeTable ? (
        <Alert visible variant={AlertVariants.DANGER} maxWidth="53rem">
          this is an error
        </Alert>
      ) : null}
    </Step>
  );
};

export { Step2 };
