import { Alert, AlertVariants } from '@/ui/Alert';
import type { StackProps } from '@/ui/Stack';
import { getStackProps } from '@/ui/Stack';
import { TimeTable } from '@/ui/TimeTable';

import type { MachineProps } from './create';
import { MovieEventTypes } from './create';
import { Step } from './Step';

type Step2Props = StackProps & MachineProps;

const Step2 = ({
  movieState,
  sendMovieEvent,
  isInvalid,
  ...props
}: Step2Props) => {
  return (
    <Step stepNumber={2} {...getStackProps(props)}>
      <TimeTable
        id="timetable-movies"
        onTimeTableChange={(value) =>
          sendMovieEvent({ type: MovieEventTypes.CHANGE_TIME_TABLE, value })
        }
        {...getStackProps(props)}
      />
      {isInvalid ? (
        <Alert visible variant={AlertVariants.DANGER} maxWidth="53rem">
          this is an error
        </Alert>
      ) : null}
    </Step>
  );
};

export { Step2 };
