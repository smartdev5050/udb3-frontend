import { getStackProps } from '@/ui/Stack';
import { TimeTable } from '@/ui/TimeTable';

import type { MachineProps } from './create';
import { MovieEventTypes } from './create';
import type { StepProps } from './Step';
import { Step } from './Step';

type Step2Props = StepProps & MachineProps;

const Step2 = ({
  movieState,
  sendMovieEvent,
  stepNumber,
  ...props
}: Step2Props) => {
  return (
    <Step stepNumber={stepNumber}>
      <TimeTable
        id="timetable-movies"
        onTimeTableChange={(value) =>
          sendMovieEvent({ type: MovieEventTypes.CHANGE_TIME_TABLE, value })
        }
        {...getStackProps(props)}
      />
    </Step>
  );
};

export { Step2 };
