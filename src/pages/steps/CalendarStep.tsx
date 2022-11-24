import { useSelector } from '@xstate/react';

import { parseSpacing } from '@/ui/Box';
import { Button, ButtonVariants } from '@/ui/Button';
import { Icon, Icons } from '@/ui/Icon';
import { getInlineProps, Inline } from '@/ui/Inline';
import { Panel } from '@/ui/Panel';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { ToggleBox } from '@/ui/ToggleBox';

import { Days } from './Days';
import {
  CalendarMachineProvider,
  useCalendarContext,
  useCalendarSelector,
  useIsFixedDays,
  useIsOneOrMoreDays,
} from './machines/calendarMachine';
import { FormDataUnion, StepsConfiguration } from './Steps';

type OneOrMoreDaysProps = {
  onAddDay: () => void;
  onDeleteDay: (index: number) => void;
  onChangeStartDate: (index: number, date: Date | null) => void;
  onChangeEndDate: (index: number, date: Date | null) => void;
  onChangeStartTime: (index: number, hours: number, minutes: number) => void;
  onChangeEndTime: (index: number, hours: number, minutes: number) => void;
};

const OneOrMoreDays = ({ onAddDay, ...handlers }: OneOrMoreDaysProps) => {
  return (
    <Stack spacing={5} alignItems="flex-start">
      <Days {...handlers} />
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
  onChooseOneOrMoreDays: () => void;
  onChooseFixedDays: () => void;
};

const CalendarOptionToggle = ({
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

type CalendarStepProps = StackProps;

const CalendarStep = ({ ...props }: CalendarStepProps) => {
  const calendarService = useCalendarContext();
  const send = calendarService.send;

  const isOneOrMoreDays = useIsOneOrMoreDays();
  const isFixedDays = useIsFixedDays();

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

  return (
    <Stack spacing={4} {...getStackProps(props)}>
      <CalendarOptionToggle
        onChooseOneOrMoreDays={handleChooseOneOrMoreDays}
        onChooseFixedDays={handleChooseFixedDays}
      />
      <Panel backgroundColor="white" padding={5}>
        {isFixedDays && <FixedDays />}
        {isOneOrMoreDays && (
          <OneOrMoreDays
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
  // eslint-disable-next-line react/display-name
  Component: (props: any) => (
    <CalendarMachineProvider>
      <CalendarStep {...props} />
    </CalendarMachineProvider>
  ),
  name: 'calendar',
  title: ({ t }) => 'Wanneer vindt dit evenement of deze activiteit plaats?',
  shouldShowStep: ({ watch, eventId, formState }) => {
    return true;
  },
};

export { CalendarStep, calendarStepConfiguration };
