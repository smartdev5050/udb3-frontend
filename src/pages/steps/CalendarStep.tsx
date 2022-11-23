import { parseSpacing } from '@/ui/Box';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { getInlineProps, Inline } from '@/ui/Inline';
import { Panel } from '@/ui/Panel';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { ToggleBox } from '@/ui/ToggleBox';

import { Days } from './Days';
import { CalendarState, useCalendarMachine } from './machines/calendarMachine';
import { FormDataUnion, StepsConfiguration } from './Steps';

const isOneOrMoreDays = (value: string | Record<string, unknown>) =>
  typeof value === 'string' && ['single', 'multiple'].includes(value);

const isFixedDays = (value: string | Record<string, unknown>) =>
  ['periodic', 'permanent'].some(
    (key) => !!value && typeof value === 'object' && !!value[key],
  );

type OneOrMoreDaysProps<TState> = {
  state: TState;
  onAddDay: () => void;
  onDeleteDay: (index: number) => void;
  onChangeStartDate: (index: number, date: Date | null) => void;
  onChangeEndDate: (index: number, date: Date | null) => void;
  onChangeStartTime: (index: number, hours: number, minutes: number) => void;
  onChangeEndTime: (index: number, hours: number, minutes: number) => void;
};

const OneOrMoreDays = <TState extends CalendarState>({
  state,
  onAddDay,
  ...handlers
}: OneOrMoreDaysProps<TState>) => {
  return (
    <Stack spacing={5} alignItems="flex-start">
      <Days days={state.context.days} {...handlers} />
      <Button variant={ButtonVariants.SECONDARY} onClick={onAddDay}>
        Dag toevoegen
      </Button>
    </Stack>
  );
};

const FixedDays = () => {
  return <Text>FixedDays</Text>;
};

type CalendarOptionToggleProps = {
  value: string | Record<string, unknown>;
  onChooseOneOrMoreDays: () => void;
  onChooseFixedDays: () => void;
};

const CalendarOptionToggle = ({
  value,
  onChooseOneOrMoreDays,
  onChooseFixedDays,
  ...props
}: CalendarOptionToggleProps) => {
  return (
    <Inline
      spacing={5}
      alignItems="center"
      maxWidth={parseSpacing(9)}
      {...getInlineProps(props)}
    >
      <ToggleBox
        onClick={onChooseOneOrMoreDays}
        active={isOneOrMoreDays(value)}
        icon={<Icon name={Icons.CALENDAR_ALT} />}
        text="Een of meerdere dagen"
        width="30%"
        minHeight={parseSpacing(7)}
      />
      <ToggleBox
        onClick={onChooseFixedDays}
        active={isFixedDays(value)}
        icon={<Icon name={Icons.CALENDAR_ALT} />}
        text="Vaste dagen per week"
        width="30%"
        minHeight={parseSpacing(7)}
      />
    </Inline>
  );
};

type CalendarStepProps = StackProps;

const CalendarStep = ({ ...props }: CalendarStepProps) => {
  const [state, send] = useCalendarMachine();

  const handleDeleteDay = (index: number) => {
    return send('REMOVE_DAY', { index });
  };

  const handleAddDay = () => {
    send('ADD_DAY');
  };

  const handleChangeStartDate = (index: number, newDate: Date | null) => {
    return send('CHANGE_START_DATE', { index, newDate });
  };

  const handleChangeEndDate = (index: number, newDate: Date | null) => {
    return send('CHANGE_END_DATE', { index, newDate });
  };

  const handleChangeStartTime = (
    index: number,
    hours: number,
    minutes: number,
  ) => {
    send('CHANGE_START_HOUR', {
      index,
      newHours: hours,
      newMinutes: minutes,
    });
  };

  const handleChangeEndTime = (
    index: number,
    hours: number,
    minutes: number,
  ) => {
    send('CHANGE_END_HOUR', {
      index,
      newHours: hours,
      newMinutes: minutes,
    });
  };

  const handleChooseOneOrMoreDays = () => {
    send('CHOOSE_ONE_OR_MORE_DAYS');
  };

  const handleChooseFixedDays = () => {
    send('CHOOSE_FIXED_DAYS');
  };

  const calendarOption = state.value;

  return (
    <Stack spacing={4} {...getStackProps(props)}>
      <CalendarOptionToggle
        value={calendarOption}
        onChooseOneOrMoreDays={handleChooseOneOrMoreDays}
        onChooseFixedDays={handleChooseFixedDays}
      />
      <Panel backgroundColor="white" padding={5}>
        {isFixedDays(calendarOption) && <FixedDays />}
        {isOneOrMoreDays(calendarOption) && (
          <OneOrMoreDays
            state={state}
            onDeleteDay={handleDeleteDay}
            onChangeStartDate={handleChangeStartDate}
            onChangeEndDate={handleChangeEndDate}
            onChangeStartTime={handleChangeStartTime}
            onChangeEndTime={handleChangeEndTime}
            onAddDay={handleAddDay}
          />
        )}
      </Panel>
    </Stack>
  );
};

const calendarStepConfiguration: StepsConfiguration<FormDataUnion> = {
  Component: CalendarStep,
  name: 'calendar',
  title: ({ t }) => 'Wanneer vindt dit evenement of deze activiteit plaats?',
  shouldShowStep: ({ watch, eventId, formState }) => {
    return true;
  },
};

export { CalendarStep, calendarStepConfiguration };
