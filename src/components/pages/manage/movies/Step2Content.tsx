import { MovieEventTypes } from 'machines/movie';

import type { StackProps } from '@/ui/Stack';
import { getStackProps } from '@/ui/Stack';
import { TimeTable } from '@/ui/TimeTable';

import type { MachineProps } from './create';

type Step2ContentProps = StackProps & MachineProps;

const Step2Content = ({
  movieState,
  sendMovieEvent,
  ...props
}: Step2ContentProps) => {
  return (
    <TimeTable
      id="timetable-movies"
      onTimeTableChange={(value) =>
        sendMovieEvent({ type: MovieEventTypes.CHANGE_TIME_TABLE, value })
      }
      {...getStackProps(props)}
    />
  );
};

export { Step2Content };
