import type { ImmigrationStatus } from './Profile';

export type StepStatus = 'not_started' | 'in_progress' | 'done';

export interface ActionItem {
  id: string;
  text: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  whyNeeded: string;
  whereToGet: string;
}

export interface ResourceLink {
  label: string;
  url: string;
}

export interface PersonaNote {
  status: ImmigrationStatus;
  note: string;
}

export interface Step {
  id: string;
  stepNumber: number;
  title: string;
  timing: string;
  offlineAvailable: boolean;
  whyItMatters: string;
  actions: ActionItem[];
  documents: DocumentItem[];
  resources: ResourceLink[];
  personaNotes: PersonaNote[];
}
