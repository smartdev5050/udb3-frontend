import { CalendarType } from '@/constants/CalendarType';
import { OpeningHours } from '@/types/Offer';
import { Values } from '@/types/Values';

import { CalendarContext, useCalendarContext } from './calendarMachine';

export const useCalendarHandlers = () => {
  const calendarService = useCalendarContext();
  const send = calendarService.send;

  const handleLoadInitialContext = (
    newContext: CalendarContext,
    calendarType?: Values<typeof CalendarType>,
  ) => {
    send('LOAD_INITIAL_CONTEXT', { newContext, calendarType });
  };

  const handleAddDay = () => {
    send('ADD_DAY');
  };

  const handleDeleteDay = (index: number) => {
    send('REMOVE_DAY', { index });
  };

  const handleChangeStartDate = (newDate: Date) => {
    send('CHANGE_START_DATE', { newDate });
  };

  const handleChangeEndDate = (newDate: Date) => {
    send('CHANGE_END_DATE', { newDate });
  };

  const handleChangeStartDateOfDay = (index: number, newDate: Date | null) => {
    send('CHANGE_START_DATE_OF_DAY', { index, newDate });
  };

  const handleChangeEndDateOfDay = (index: number, newDate: Date | null) => {
    send('CHANGE_END_DATE_OF_DAY', { index, newDate });
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

  const handleChooseWithStartAndEndDate = () => {
    send('CHOOSE_WITH_START_AND_END_DATE');
  };

  const handleChoosePermanent = () => {
    send('CHOOSE_PERMANENT');
  };

  const handleChangeOpeningHours = (newOpeningHours: OpeningHours[]) => {
    send('CHANGE_OPENING_HOURS');
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
