import type { IDateValue, IDatePickerControl } from './common';

export type IEventOrganizer = {
  id: string;
  name: string;
  avatarUrl: string;
  phoneNumber: string;
};
export type IEventTableFilters = {
  name: string;
};

export type IEventItem = {
  id: string;
  name: string;
  logo: string;
  coverUrl: string;
  logoClient: string;
  nomclient: string;
  matricule: string;
  type: string;
  startDate: string;
  endDate: string;
  date: string;
  location: string;
  status: string;
  description: string;
  createdAt: Date;
  participants: number;
  likes: number;
  avis?: number;
  revenue: number;
  photos: IEventPhoto[];
};

export interface IEventPhoto {
  id: string;
  imageUrl: string;
  description?: string;
  createdAt: Date;
  likes?: number;
}

export type INewEventItem = {
  id: string;
  name: string;
  logo: string;
  //   client_name: string;
  domain_type: 'personalized' | 'standard';
  domain_value: string;
  barcoderegistration: boolean;
  qrcoderegistration: boolean;
  location: string;
  description: string;
  createdAt: IDateValue;
  organizer: IEventOrganizer[];
  available: {
    endDate: IDateValue;
    startDate: IDateValue;
  };
  client: {
    id: string;
    name: string;
    avatarUrl: string;
    phoneNumber: string;
  };
};


export type IEvent = {
  id: string;
  name: string;
  logo: string;
  coverUrl?: string;
  description: string;
  location: string;
  matricule?: string;
  type: string;
  
  // Client information
  client: {
    id: string;
    name: string;
    avatarUrl: string;
    phoneNumber: string;
    logo?: string;  // from logoClient
  };
  
  // Date and time
  createdAt: Date | IDateValue;
  available?: {
    startDate: Date | IDateValue;
    endDate: Date | IDateValue;
  };
  date?: string;  // Consider replacing with available.startDate
  
  // Registration options
  barcoderegistration?: boolean;
  qrcoderegistration?: boolean;
  domain_type?: 'personalized' | 'standard';
  domain_value?: string;
  
  // Statistics and metadata
  status?: string;
  participants?: number;
  likes?: number;
  avis?: number;
  revenue?: number;
  
  // Related content
  photos?: IEventPhoto[];
  organizer?: IEventOrganizer[];
};