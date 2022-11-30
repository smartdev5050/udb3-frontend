import { Panel } from '@/ui/Panel';
import { getStackProps, Stack, StackProps } from '@/ui/Stack';

import {
  CalendarMachineProvider,
  useCalendarService,
  useIsFixedDays,
  useIsOneOrMoreDays,
  useSetCalendarContext,
} from '../machines/calendarMachine';
import { useCalendarHandlers } from '../machines/useCalendarHandlers';
import { FormDataUnion, StepsConfiguration } from '../Steps';
import { CalendarOptionToggle } from './CalendarOptionToggle';
import { FixedDays } from './FixedDays';
import { OneOrMoreDays } from './OneOrMoreDays';

type CalendarStepProps = StackProps;

const CalendarStep = ({ ...props }: CalendarStepProps) => {
  const isOneOrMoreDays = useIsOneOrMoreDays();
  const isFixedDays = useIsFixedDays();

  const {
    handleInitialContext,
    handleAddDay,
    handleDeleteDay,
    handleChangeStartDate,
    handleChangeEndDate,
    handleChangeStartDateOfDay,
    handleChangeEndDateOfDay,
    handleChangeStartTime,
    handleChangeEndTime,
    handleChooseOneOrMoreDays,
    handleChooseFixedDays,
    handleChooseWithStartAndEndDate,
    handleChoosePermanent,
    handleChangeOpeningHours,
  } = useCalendarHandlers();

  const startDate = new Date();

  const initialContext = {
    days: [
      { startDate: startDate.toString(), endDate: startDate.toString() },
      { startDate: startDate.toString(), endDate: startDate.toString() },
      { startDate: startDate.toString(), endDate: startDate.toString() },
      { startDate: startDate.toString(), endDate: startDate.toString() },
    ],
    startDate: startDate.toString(),
    endDate: startDate.toString(),
    openingHours: [],
  };

  handleInitialContext(initialContext);

  return (
    <Stack spacing={4} {...getStackProps(props)}>
      <CalendarOptionToggle
        onChooseOneOrMoreDays={handleChooseOneOrMoreDays}
        onChooseFixedDays={handleChooseFixedDays}
      />
      <Panel backgroundColor="white" padding={5}>
        {isFixedDays && (
          <FixedDays
            onChooseWithStartAndEndDate={handleChooseWithStartAndEndDate}
            onChoosePermanent={handleChoosePermanent}
            onChangeStartDate={handleChangeStartDate}
            onChangeEndDate={handleChangeEndDate}
            onChangeOpeningHours={handleChangeOpeningHours}
          />
        )}
        {isOneOrMoreDays && (
          <OneOrMoreDays
            onDeleteDay={handleDeleteDay}
            onChangeStartDate={handleChangeStartDateOfDay}
            onChangeEndDate={handleChangeEndDateOfDay}
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
