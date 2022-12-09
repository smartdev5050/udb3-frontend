import { CalendarType } from '@/constants/CalendarType';

import { Values } from './Values';

type TimeSpan = {
  start: string;
  end: string;
};

type Calendar = {
  calendarType: Values<typeof CalendarType>;
  timeSpans: TimeSpan[];
};

export type { Calendar };
