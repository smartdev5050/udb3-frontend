import { parseSpacing } from '@/ui/Box';
import { Icon, Icons } from '@/ui/Icon';
import { getInlineProps, Inline } from '@/ui/Inline';
import { ToggleBox } from '@/ui/ToggleBox';

import { useIsFixedDays, useIsOneOrMoreDays } from './machines/calendarMachine';

type CalendarOptionToggleProps = {
  onChooseOneOrMoreDays: () => void;
  onChooseFixedDays: () => void;
};
export const CalendarOptionToggle = ({
  onChooseOneOrMoreDays,
  onChooseFixedDays,
  ...props
}: CalendarOptionToggleProps) => {
  const isOneOrMoreDays = useIsOneOrMoreDays();
  const isFixedDays = useIsFixedDays();

  return (
    <Inline
      spacing={5}
      alignItems="center"
      maxWidth={parseSpacing(9)}
      {...getInlineProps(props)}
    >
      <ToggleBox
        onClick={onChooseOneOrMoreDays}
        active={isOneOrMoreDays}
        icon={<Icon name={Icons.CALENDAR_ALT} />}
        text="Een of meerdere dagen"
        width="30%"
        minHeight={parseSpacing(7)}
      />
      <ToggleBox
        onClick={onChooseFixedDays}
        active={isFixedDays}
        icon={<Icon name={Icons.CALENDAR_ALT} />}
        text="Vaste dagen per week"
        width="30%"
        minHeight={parseSpacing(7)}
      />
    </Inline>
  );
};
