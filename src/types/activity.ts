import type { IDateValue, IDateHourValue, IDatePickerControl } from './common';

export type IEventSpeaker = {
  id: string;
  name: string;
  avatarUrl: string;
  phoneNumber: string;
};

export type IActivityTableFilters = {
  title: string;
};

export type IActivityItem = {

};

export interface IActivityPhoto {
  id: string;
  imageUrl: string;
  description?: string;
  createdAt: Date;
  likes?: number;
}

export type INewActivityItem = {
    id: string;
    title: string;
    description: string;
    type: string;
    
    // Speaker information
    speaker?: IEventSpeaker[];
    
    // Date and time
    createdAt: Date | IDateValue;
    date?: {
      startDate: Date | IDateValue;
      endDate: Date | IDateValue;
    };
    hour?: {
      startDateHour: Date | IDateHourValue;
      endDateHour: Date | IDateHourValue;
    };
    status?: 'non_demarrer' | 'en_cours' | 'termine';
    
    
    // Ressources
    documents?: string;
    link?: string;
    video?: string;
};


export type IActivity = {
  id: string;
  title: string;
  description: string;
  type: string;
  
  // Speaker information
    speaker?: IEventSpeaker[];
  
  // Date and time
  createdAt: Date | IDateValue;
  date?: {
    startDate: Date | IDateValue;
    endDate: Date | IDateValue;
  };
  hour?: {
    startDateHour: Date | IDateHourValue;
    endDate: Date | IDateHourValue;
  };
  status?: 'non_demarrer' | 'en_cours' | 'termine';
  
  
  // Ressources
  documents?: string;
  link?: string;
  video?: string;
  

};