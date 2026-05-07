export type EnvironmentType = 'google' | 'microsoft';
export type TechPlatformType = 'claude' | 'notebooklm' | 'google ai studio' | 'otros';
export type QuoteType = 'bootcamp' | 'cursos' | 'crea academy';
export type Modality = 'presencial' | 'virtual';
export type UserVolume = '<50' | '>50';
export type LocationType = 'metropolitana' | 'fuera';
export type QuoteStatus = 'pendiente' | 'enviada' | 'aceptada' | 'rechazada';
export type OpportunityStatus = 'seguimiento' | 'ganada' | 'perdida';

export interface Quote {
  id: string;
  type: QuoteType;
  modality: Modality;
  userVolume: UserVolume;
  location: LocationType;
  environment: EnvironmentType;
  techPlatform: TechPlatformType;
  clientName: string;
  clientNit: string;
  clientEmail: string;
  clientPhone: string;
  status: QuoteStatus;
  amount: number;
  ownerId: string;
  createdAt: any; // Firestore Timestamp
  updatedAt?: any;
}

export interface Opportunity {
  id: string;
  quoteId: string;
  ownerId: string;
  status: OpportunityStatus;
  lastContactAt: any;
  nextFollowUpAt?: any;
  createdAt: any;
}
