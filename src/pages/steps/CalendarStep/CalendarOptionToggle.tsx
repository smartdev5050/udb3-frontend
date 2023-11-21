import { useTranslation } from 'react-i18next';

import { parseSpacing } from '@/ui/Box';
import { CustomIcon, CustomIconVariants } from '@/ui/CustomIcon';
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
  const { t } = useTranslation();
  const isOneOrMoreDays = useIsOneOrMoreDays();
  const isFixedDays = useIsFixedDays();

  return (
    <Inline spacing={5} alignItems="center" {...getInlineProps(props)}>
      <ToggleBox
        onClick={onChooseOneOrMoreDays}
        active={isOneOrMoreDays}
        icon={
          <CustomIcon name={CustomIconVariants.CALENDAR_SINGLE} width="80" />
        }
        text={t('create.calendar.types.one_or_more_days')}
        minHeight={parseSpacing(7)}
        flex={1}
      />
      <ToggleBox
        onClick={onChooseFixedDays}
        active={isFixedDays}
        icon={
          <CustomIcon name={CustomIconVariants.CALENDAR_MULTIPLE} width="80" />
        }
        text={t('create.calendar.types.fixed_days')}
        minHeight={parseSpacing(7)}
        flex={1}
        disabled={disableChooseFixedDays}
      />
    </Inline>
  );
};
