import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useLog } from '@/hooks/useLog';
import { parseSpacing } from '@/ui/Box';
import { Button } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { Icon, Icons } from '@/ui/Icon';
import { getInlineProps, Inline } from '@/ui/Inline';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { ToggleBox } from '@/ui/ToggleBox';
import { Typeahead } from '@/ui/Typeahead';

import { Days } from './Days';
import { useCalendarMachine } from './machines/calendarMachine';
import { FormDataUnion, StepsConfiguration } from './Steps';

type Props = {
  value: string | Record<string, unknown>;
  onChooseOneOrMoreDays: () => void;
  onChooseFixedDays: () => void;
};

const CalendarOptionToggle = ({
  value,
  onChooseOneOrMoreDays,
  onChooseFixedDays,
  ...props
}: Props) => {
  const { t } = useTranslation();

  const isOneOrMoreDays =
    typeof value === 'string' && ['single', 'multiple'].includes(value);
  const isFixedDays = ['periodic', 'permanent'].some(
    (key) => !!value && typeof value === 'object' && !!value[key],
  );

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
  const { t, i18n } = useTranslation();

  const [state, send] = useCalendarMachine();

  const handleDeleteDay = (index: number) => {
    console.log('in handleDeleteDay');
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
    <Stack {...getStackProps(props)}>
      <CalendarOptionToggle
        value={calendarOption}
        onChooseOneOrMoreDays={handleChooseOneOrMoreDays}
        onChooseFixedDays={handleChooseFixedDays}
      />
      <Inline>
        <Stack position="relative" width="50%">
          <Text>{JSON.stringify(state.value)}</Text>
          {state.context.days.length > 0 && (
            <Days
              days={state.context.days}
              onDeleteDay={handleDeleteDay}
              onChangeStartDate={handleChangeStartDate}
              onChangeEndDate={handleChangeEndDate}
              onChangeStartHour={handleChangeStartTime}
              onChangeEndHour={handleChangeEndTime}
            />
          )}
          <Button onClick={handleAddDay}>Add day</Button>
        </Stack>
        <Stack position="relative" width="50%" justifyContent="center">
          <code
            style={{
              position: 'sticky',
              top: '3rem',
              maxWidth: '80%',
              whiteSpace: 'normal',
              padding: '1.5rem',
              height: 'fit-content',
            }}
          >
            {JSON.stringify(state.context, undefined, 8)}
          </code>
        </Stack>
      </Inline>
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
