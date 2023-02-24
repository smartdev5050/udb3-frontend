import { useTranslation } from 'react-i18next';

import { parseSpacing } from '@/ui/Box';
import { getInlineProps, Inline, InlineProps } from '@/ui/Inline';
import { ToggleBox } from '@/ui/ToggleBox';

import {
  useIsFixedDays,
  useIsOneOrMoreDays,
} from '../machines/calendarMachine';
import { IconFixedDays } from './IconFixedDays';
import { IconOneOrMoreDays } from './IconOneOrMoreDays';

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
  const { t } = useTranslation();
  const isOneOrMoreDays = useIsOneOrMoreDays();
  const isFixedDays = useIsFixedDays();

  return (
    <Inline spacing={5} alignItems="center" {...getInlineProps(props)}>
      <ToggleBox
        onClick={onChooseOneOrMoreDays}
        active={isOneOrMoreDays}
        icon={<IconOneOrMoreDays />}
        text={t('create.calendar.types.one_or_more_days')}
        minHeight={parseSpacing(7)}
        flex={1}
      />
      <ToggleBox
        onClick={onChooseFixedDays}
        active={isFixedDays}
        icon={<IconFixedDays />}
        text={t('create.calendar.types.one_or_more_days')}
        minHeight={parseSpacing(7)}
        flex={1}
        disabled={disableChooseFixedDays}
      />
    </Inline>
  );
};
