import { useTranslation } from 'react-i18next';

import { Button } from '@/ui/Button';
import { FormElement } from '@/ui/FormElement';
import { getInlineProps, Inline } from '@/ui/Inline';
import { Stack, StackProps } from '@/ui/Stack';
import { Typeahead } from '@/ui/Typeahead';

import { Days } from './Days';
import { useCalendarMachine } from './machines/calendarMachine';
import { FormDataUnion, StepsConfiguration } from './Steps';

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

  return (
    <Inline {...getInlineProps(props)}>
      <Stack position="relative" width="50%">
        {state.matches('single') ? <h2>Single</h2> : <h2>Multiple</h2>}
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
