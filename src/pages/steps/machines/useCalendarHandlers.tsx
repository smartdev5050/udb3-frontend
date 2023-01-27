import { CalendarType } from '@/constants/CalendarType';
import { Values } from '@/types/Values';

import {
  CalendarContext,
  CalendarState,
  OpeningHoursWithId,
  useCalendarContext,
} from './calendarMachine';

export const useCalendarHandlers = (
  onChangeState: (newState: CalendarState) => void,
) => {
  const calendarService = useCalendarContext();
  const send = calendarService.send;

  const handleLoadInitialContext = ({
    newContext,
    calendarType,
  }: {
    newContext?: CalendarContext;
    calendarType?: Values<typeof CalendarType>;
  }): void => {
    const newState = send('LOAD_INITIAL_CONTEXT', { newContext, calendarType });
    onChangeState(newState);
  };

  const handleAddDay = () => {
    const newState = send('ADD_DAY');
    onChangeState(newState);
  };

  const handleDeleteDay = (id: string) => {
    const newState = send('REMOVE_DAY', { id });
    onChangeState(newState);
  };

  const handleChangeStartDate = (newDate: Date) => {
    const newState = send('CHANGE_START_DATE', { newDate });
    onChangeState(newState);
  };

  const handleChangeEndDate = (newDate: Date) => {
    const newState = send('CHANGE_END_DATE', { newDate });
    onChangeState(newState);
  };

  const handleChangeStartDateOfDay = (id: string, newDate: Date | null) => {
    const newState = send('CHANGE_START_DATE_OF_DAY', { id, newDate });
    onChangeState(newState);
  };

  const handleChangeEndDateOfDay = (id: string, newDate: Date | null) => {
    const newState = send('CHANGE_END_DATE_OF_DAY', { id, newDate });
    onChangeState(newState);
  };

  const handleChangeStartTime = (
    id: string,
    hours: number,
    minutes: number,
  ) => {
    const newState = send('CHANGE_START_HOUR', {
      id,
      newHours: hours,
      newMinutes: minutes,
    });
    onChangeState(newState);
  };

  const handleChangeEndTime = (id: string, hours: number, minutes: number) => {
    const newState = send('CHANGE_END_HOUR', {
      id,
      newHours: hours,
      newMinutes: minutes,
    });
    onChangeState(newState);
  };

  const handleChooseOneOrMoreDays = () => {
    const newState = send('CHOOSE_ONE_OR_MORE_DAYS');
    onChangeState(newState);
  };

  const handleChooseFixedDays = () => {
    const newState = send('CHOOSE_FIXED_DAYS');
    onChangeState(newState);
  };

  const handleChooseWithStartAndEndDate = () => {
    const newState = send('CHOOSE_WITH_START_AND_END_DATE');
    onChangeState(newState);
  };

  const handleChoosePermanent = () => {
    const newState = send('CHOOSE_PERMANENT');
    onChangeState(newState);
  };

  const handleChangeOpeningHours = (newOpeningHours: OpeningHoursWithId[]) => {
    const newState = send('CHANGE_OPENING_HOURS', { newOpeningHours });
    onChangeState(newState);
  };

  return {
    handleLoadInitialContext,
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
  };
};
