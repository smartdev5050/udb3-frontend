import type { BookingAvailabilityType } from '@/constants/BookingAvailabilityType';
import type { CalendarType } from '@/constants/CalendarType';
import type { OfferStatus } from '@/constants/OfferStatus';

import type { SupportedLanguages } from '../i18n';
import type { ContactPoint } from './ContactPoint';
import type { Organizer } from './Organizer';
import type { Values } from './Values';
import type { WorkflowStatus } from './WorkflowStatus';

type StatusType = Values<typeof OfferStatus>;

type StatusReason = { [languages: string]: string };

type Status = {
  type: StatusType;
  reason?: StatusReason;
};

type BookingAvailability = {
  type: Values<typeof BookingAvailabilityType>;
};

type Term = {
  label: string;
  domain: string;
  id: string;
};

type MediaObject = {
  '@id': string;
  '@type': string;
  contentUrl: string;
  thumbnailUrl: string;
  description: string;
  copyrightHolder: string;
  inLanguage: string;
};

type BookingInfo = {
  availabilityStarts?: string;
  availabilityEnds?: string;
  price?: number;
  phone?: string;
  email?: string;
  description?: string;
  url?: string;
  urlLabel?: { nl: string };
};

type PriceInfo = {
  category: 'base' | 'tariff';
  name: { nl: string };
  price: number;
};

type SubEvent = {
  '@type': string;
  startDate: string;
  endDate: string;
  status?: Values<typeof OfferStatus>;
};

type OpeningHours = {
  opens: string;
  closes: string;
  dayOfWeek: string[];
};

type CalendarSummary = Record<
  Values<typeof SupportedLanguages>,
  {
    text?: { [format: string]: string };
    html?: { [format: string]: string };
  }
>;

type Offer = {
  '@id': string;
  name: Partial<Record<Values<typeof SupportedLanguages>, string>>;
  description: Partial<Record<Values<typeof SupportedLanguages>, string>>;
  status?: Status;
  availableFrom: string;
  availableTo: string;
  labels?: string[];
  hiddenLabels?: string[];
  calendarSummary?: CalendarSummary;
  organizer: Organizer;
  contactPoint?: ContactPoint;
  terms: Term[];
  creator: string;
  created: string;
  modified: string;
  publisher: string;
  calendarType: Values<typeof CalendarType>;
  startDate: string;
  endDate: string;
  openingHours: OpeningHours[];
  subEvent: SubEvent[];
  performer: [{ performer: string }];
  sameAs: string[];
  seeAlso: string[];
  workflowStatus: WorkflowStatus;
  audience: { audienceType: string };
  mainLanguage: Values<typeof SupportedLanguages>;
  languages: Array<Values<typeof SupportedLanguages>>;
  completedLanguages: Array<Values<typeof SupportedLanguages>>;
  mediaObject?: MediaObject[];
  image?: string;
  typicalAgeRange: string;
  bookingInfo?: BookingInfo;
  priceInfo?: PriceInfo[];
  regions: string[];
};

export type {
  BookingAvailability,
  MediaObject,
  Offer,
  Status,
  StatusReason,
  StatusType,
  SubEvent,
  Term,
};
