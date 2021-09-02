import { Text } from '@/ui/Text';

import type { MachineProps } from './create';
import type { StepProps } from './Step';
import { Step } from './Step';

type Step5Props = StepProps & MachineProps;

const Step5 = ({
  movieState,
  sendMovieEvent,
  stepNumber,
  ...props
}: Step5Props) => {
  return (
    <Step stepNumber={stepNumber}>
      <Text>Hello</Text>
    </Step>
  );
};

export { Step5 };
