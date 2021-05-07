import type { Address } from './Address';
import type { ContactPoint } from './ContactPoint';
import type { WorkFlowStatus } from './WorkFlowStatus';

type Organizer = {
  '@id': string;
  '@context': string;
  mainLanguage: string;
  name: string | { nl: string };
  address: Address;
  labels: string[];
  contactPoint: ContactPoint;
  workflowStatus: WorkFlowStatus;
  languages: string[];
  completedLanguages: string[];
  modified: string;
  geo: {
    latitude: number;
    longitude: number;
  };
  url?: string;
};

export type { Organizer };
