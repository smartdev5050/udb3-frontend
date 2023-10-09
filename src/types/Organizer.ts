import { MediaObject } from '@/types/Offer';

import type { Address } from './Address';
import type { ContactPoint } from './ContactPoint';
import type { WorkflowStatus } from './WorkflowStatus';

type Organizer = {
  '@id': string;
  '@context': string;
  mainLanguage: string;
  name: string | { nl: string };
  creator: string;
  address: Address;
  labels: string[];
  hiddenLabels: string[];
  contactPoint: ContactPoint;
  workflowStatus: WorkflowStatus;
  languages: string[];
  completedLanguages: string[];
  modified: string;
  images: MediaObject[];
  geo: {
    latitude: number;
    longitude: number;
  };
  location?: Address;
  url?: string;
  educationalDescription?: string;
};

export type { Organizer };
