export type ImmigrationStatus =
  | 'pr'
  | 'work_permit'
  | 'study_permit'
  | 'refugee'
  | 'cuaet'
  | 'refugee_claimant'
  | 'other';

export type Locale = 'en' | 'ar' | 'fil' | 'fr' | 'hi' | 'es' | 'ti' | 'uk';

export interface Profile {
  firstName: string;
  arrivalDate: string | null; // ISO date string
  immigrationStatus: ImmigrationStatus | null;
  hasChildren: boolean;
  isEmployed: boolean;
}
