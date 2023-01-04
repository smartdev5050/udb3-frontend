import { Values } from '@/types/Values';

const DaysOfWeek = {
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
  SUNDAY: 'sunday',
} as const;

type DayOfWeek = Values<typeof DaysOfWeek>;

export { DaysOfWeek };
export type { DayOfWeek };
