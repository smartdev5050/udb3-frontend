import { useCallback, useRef } from 'react';

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

  const handleOnChangeState = useRef(onChangeState).current;

  const handleLoadInitialContext = useCallback(
    ({
      newContext,
      calendarType,
    }: {
      newContext?: CalendarContext;
      calendarType?: Values<typeof CalendarType>;
    }): void => {
      const newState = send('LOAD_INITIAL_CONTEXT', {
        newContext,
        calendarType,
      });
      handleOnChangeState(newState);
    },
    [handleOnChangeState, send],
  );

  const handleAddDay = useCallback(() => {
    const newState = send('ADD_DAY');
    handleOnChangeState(newState);
  }, [handleOnChangeState, send]);

  const handleDeleteDay = useCallback(
    (id: string) => {
      const newState = send('REMOVE_DAY', { id });
      handleOnChangeState(newState);
    },
    [handleOnChangeState, send],
  );

  const handleChangeStartDate = useCallback(
    (newDate: Date) => {
      const newState = send('CHANGE_START_DATE', { newDate });
      handleOnChangeState(newState);
    },
    [handleOnChangeState, send],
  );

  const handleChangeEndDate = useCallback(
    (newDate: Date) => {
      const newState = send('CHANGE_END_DATE', { newDate });
      handleOnChangeState(newState);
    },
    [handleOnChangeState, send],
  );

  const handleChangeStartDateOfDay = useCallback(
    (id: string, newDate: Date | null) => {
      const newState = send('CHANGE_START_DATE_OF_DAY', { id, newDate });
      handleOnChangeState(newState);
    },
    [handleOnChangeState, send],
  );

  const handleChangeEndDateOfDay = useCallback(
    (id: string, newDate: Date | null) => {
      const newState = send('CHANGE_END_DATE_OF_DAY', { id, newDate });
      handleOnChangeState(newState);
    },
    [handleOnChangeState, send],
  );

  const handleChangeStartTime = useCallback(
    (id: string, hours: number, minutes: number) => {
      const newState = send('CHANGE_START_HOUR', {
        id,
        newHours: hours,
        newMinutes: minutes,
      });
      handleOnChangeState(newState);
    },
    [handleOnChangeState, send],
  );

  const handleChangeEndTime = useCallback(
    (id: string, hours: number, minutes: number) => {
      const newState = send('CHANGE_END_HOUR', {
        id,
        newHours: hours,
        newMinutes: minutes,
      });
      handleOnChangeState(newState);
    },
    [handleOnChangeState, send],
  );

  const handleChooseOneOrMoreDays = useCallback(() => {
    const newState = send('CHOOSE_ONE_OR_MORE_DAYS');
    handleOnChangeState(newState);
  }, [handleOnChangeState, send]);

  const handleChooseFixedDays = useCallback(() => {
    const newState = send('CHOOSE_FIXED_DAYS');
    handleOnChangeState(newState);
  }, [handleOnChangeState, send]);

  const handleChooseWithStartAndEndDate = useCallback(() => {
    const newState = send('CHOOSE_WITH_START_AND_END_DATE');
    handleOnChangeState(newState);
  }, [handleOnChangeState, send]);

  const handleChoosePermanent = useCallback(() => {
    const newState = send('CHOOSE_PERMANENT');
    handleOnChangeState(newState);
  }, [handleOnChangeState, send]);

  const handleChangeOpeningHours = useCallback(
    (newOpeningHours: OpeningHoursWithId[]) => {
      const newState = send('CHANGE_OPENING_HOURS', { newOpeningHours });
      handleOnChangeState(newState);
    },
    [handleOnChangeState, send],
  );

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
