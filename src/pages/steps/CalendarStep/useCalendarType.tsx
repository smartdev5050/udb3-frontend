import { useMemo } from 'react';

import { CalendarType } from '@/constants/CalendarType';
import { Values } from '@/types/Values';

import {
  useIsIdle,
  useIsMultiple,
  useIsPeriodic,
  useIsSingle,
} from '../machines/calendarMachine';

export const useCalendarType = () => {
  const isIdle = useIsIdle();
  const isMultiple = useIsMultiple();
  const isSingle = useIsSingle();
  const isPeriodic = useIsPeriodic();

  return useMemo(() => {
    if (isIdle) return undefined;
    if (isSingle) return CalendarType.SINGLE;
    if (isMultiple) return CalendarType.MULTIPLE;
    if (isPeriodic) return CalendarType.PERIODIC;
    return CalendarType.PERMANENT;
  }, [isIdle, isMultiple, isPeriodic, isSingle]);
};
