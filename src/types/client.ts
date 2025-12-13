import type { IDateValue, ISocialLink } from './common';

// ----------------------------------------------------------------------

export type IClientTableFilters = {
    company_name: string;
  };

export type IClientItem = {
    id: string;
    logo: string,
    address: string,
    personLogo: string,
    contact_name: string,
    contact_firstname: string,
    email: string,
    company_name: string,
    isMoralePerson: boolean,
    phoneNumber: string,
    eventNumber: number,
    creationDate:string,
    num_identification: string,
  };
  