import type { Address } from './Address';
import type { ContactPoint } from './ContactPoint';
import type { WorkflowStatus } from './WorkflowStatus';

type Organizer = {
  '@id': string;
  '@context': string;
  mainLanguage: string;
  name: string | { nl: string };
  address: Address;
  labels: string[];
  contactPoint: ContactPoint;
  workflowStatus: WorkflowStatus;
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
