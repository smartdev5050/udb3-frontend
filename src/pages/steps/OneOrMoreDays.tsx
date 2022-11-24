import { Button, ButtonVariants } from '@/ui/Button';
import { Stack } from '@/ui/Stack';
import { Days } from './Days';

type OneOrMoreDaysProps = {
  onAddDay: () => void;
  onDeleteDay: (index: number) => void;
  onChangeStartDate: (index: number, date: Date | null) => void;
  onChangeEndDate: (index: number, date: Date | null) => void;
  onChangeStartTime: (index: number, hours: number, minutes: number) => void;
  onChangeEndTime: (index: number, hours: number, minutes: number) => void;
};
export const OneOrMoreDays = ({
  onAddDay,
  ...handlers
}: OneOrMoreDaysProps) => {
  return (
    <Stack spacing={5} alignItems="flex-start">
      <Days {...handlers} />
      <Button variant={ButtonVariants.SECONDARY} onClick={onAddDay}>
        Dag toevoegen
      </Button>
    </Stack>
  );
};
