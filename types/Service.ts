export type ServiceCategory =
  | 'settlement'
  | 'health'
  | 'legal'
  | 'housing'
  | 'food'
  | 'employment'
  | 'language'
  | 'other';

export interface ServiceHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  address: string;
  phone: string;
  website?: string;
  hours: ServiceHours;
  languagesServed: string[];
  description: string;
  latitude?: number;
  longitude?: number;
}
