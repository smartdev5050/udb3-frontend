import { parseSpacing } from '@/ui/Box';
import { Icon, Icons } from '@/ui/Icon';
import { getInlineProps, Inline, InlineProps } from '@/ui/Inline';
import { ToggleBox } from '@/ui/ToggleBox';

import {
  useIsFixedDays,
  useIsOneOrMoreDays,
} from '../machines/calendarMachine';

type CalendarOptionToggleProps = InlineProps & {
  onChooseOneOrMoreDays: () => void;
  onChooseFixedDays: () => void;
  disableChooseFixedDays?: boolean;
};
export const CalendarOptionToggle = ({
  onChooseOneOrMoreDays,
  onChooseFixedDays,
  disableChooseFixedDays,
  ...props
}: CalendarOptionToggleProps) => {
  const isOneOrMoreDays = useIsOneOrMoreDays();
  const isFixedDays = useIsFixedDays();

  return (
    <Inline spacing={5} alignItems="center" {...getInlineProps(props)}>
      <ToggleBox
        onClick={onChooseOneOrMoreDays}
        active={isOneOrMoreDays}
        icon={<Icon name={Icons.CALENDAR_ALT} />}
        text="Een of meerdere dagen"
        minHeight={parseSpacing(7)}
        flex={1}
      />
      <ToggleBox
        onClick={onChooseFixedDays}
        active={isFixedDays}
        icon={<Icon name={Icons.CALENDAR_ALT} />}
        text="Vaste dagen per week"
        minHeight={parseSpacing(7)}
        flex={1}
        disabled={disableChooseFixedDays}
      />
    </Inline>
  );
};
