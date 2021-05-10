import type { CalendarType } from '@/constants/CalendarType';
import type { OfferStatus } from '@/constants/OfferStatus';

import type { Address } from './Address';
import type { ContactPoint } from './ContactPoint';
import type { Organizer } from './Organizer';
import type { Values } from './Values';
import type { WorkFlowStatus } from './WorkFlowStatus';

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

type Location = {
  '@id': string;
  '@type': string;
  '@context': '/contexts/place';
  mainLanguage: string;
  name: { nl: string; fr: string };
  image?: string;
  modified?: string;
  status?: Values<typeof OfferStatus>;
  address: Address;
  contactPoint?: ContactPoint;
  labels: string[];
  geo?: {
    latitude: number;
    longitude: number;
  };
  organizer?: Organizer;
  mediaObject: MediaObject[];
  terms: Term[];
};

type CalendarSummary = {
  [language: string]: {
    text?: { [format: string]: string };
    html?: { [format: string]: string };
  };
};

type Offer = {
  '@id': string;
  name: { [language: string]: string };
  description: { [language: string]: string };
  status?: Status;
  availableFrom: string;
  availableTo: string;
  labels?: string[];
  hiddenLabels?: string[];
  calendarSummary?: CalendarSummary;
  location: Location;
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
  workflowStatus: WorkFlowStatus;
  audience: { audienceType: string };
  mainLanguage: string;
  languages: string[];
  completedLanguages: string[];
  mediaObject?: MediaObject[];
  image?: string;
  typicalAgeRange: string;
  bookingInfo?: BookingInfo;
  priceInfo?: PriceInfo[];
  regions: string[];
};

export type { Offer, Status, StatusReason, StatusType };
