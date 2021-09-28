import type { StackProps } from '@/ui/Stack';
import { getStackProps } from '@/ui/Stack';
import { TimeTable } from '@/ui/TimeTable';

import type { MachineProps } from './create';
import { MovieEventTypes } from './create';
import { Step } from './Step';

type Step2Props = StackProps & MachineProps;

const Step2 = ({ movieState, sendMovieEvent, ...props }: Step2Props) => {
  return (
    <Step stepNumber={2}>
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