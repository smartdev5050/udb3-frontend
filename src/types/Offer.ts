import type { CalendarType } from '@/constants/CalendarType';
import type { OfferStatus } from '@/constants/OfferStatus';

import type { SupportedLanguage } from '../i18n';
import type { Address } from './Address';
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

type CalendarSummary = {
  [key in SupportedLanguage]: {
    text?: { [format: string]: string };
    html?: { [format: string]: string };
  };
};

type Offer = {
  '@id': string;
  name: { [key in SupportedLanguage]?: string };
  description: { [key in SupportedLanguage]: string };
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
  mainLanguage: SupportedLanguage;
  languages: SupportedLanguage[];
  completedLanguages: SupportedLanguage[];
  mediaObject?: MediaObject[];
  image?: string;
  typicalAgeRange: string;
  bookingInfo?: BookingInfo;
  priceInfo?: PriceInfo[];
  regions: string[];
};

export type { MediaObject, Offer, Status, StatusReason, StatusType, Term };
