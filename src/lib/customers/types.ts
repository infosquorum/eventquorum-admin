
/**
 * Type de customer
 */
export type CustomerType = 'Physical' | 'Legal';

/**
 * Informations téléphoniques (structure commune)
 */
export interface PhoneInformation {
  number: string;
  region: string;
}

/**
 * Informations de contact (uniquement pour Legal)
 */
export interface ContactInformation {
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Customer dans la liste paginée
 * Champs limités pour performance
 */
export interface Customer {
  id: string;
  type: CustomerType;
  name: string;
  email: string;
  phoneNumber: string;
  image: string | null;
  createdAt: string;
}

/**
 * Réponse paginée de la liste
 */
export interface PaginatedCustomersResponse {
  items: Customer[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

/**
 * Customer détaillé avec TOUS les champs
 * Retourne des champs différents selon le type (Physical/Legal)
 */
export interface CustomerDetails {
  id: string;
  type: CustomerType;
  createdAt: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  // Champs Legal (null si Physical)
  companyIdentificationNumber: string | null;
  // Champs Legal - contact
  contactFirstName: string | null;
  contactLastName: string | null;
  contactEmail: string | null;
  image: string | null;
  // Champs Physical (null si Legal)
  firstName: string | null;
  lastName: string | null;
  
}

/**
 * DTO pour créer une Personne Physique
 */
export interface CreatePhysicalCustomerDto {
  type: 'Physical';
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  image?: string;
  phoneInformation: PhoneInformation;
}

/**
 * DTO pour créer une Personne Morale
 */
export interface CreateLegalCustomerDto {
  type: 'Legal';
  name: string;
  address: string;
  email: string;
  companyIdentificationNumber: string;
  image: string;
  contactInformation: ContactInformation;
  phoneInformation: PhoneInformation;
}

/**
 * Union type pour création
 */
export type CreateCustomerDto = CreatePhysicalCustomerDto | CreateLegalCustomerDto;

/**
 * DTO pour mettre à jour une Personne Physique
 * TOUS les champs sont optionnels
 */
export interface UpdatePhysicalCustomerDto {
  type: 'Physical';
  firstName?: string;
  lastName?: string;
  address?: string;
  email?: string;
  image?: string;
  phoneInformation?: PhoneInformation;
}

/**
 * DTO pour mettre à jour une Personne Morale
 * TOUS les champs sont optionnels
 */
export interface UpdateLegalCustomerDto {
  type: 'Legal';
  name?: string;
  address?: string;
  email?: string;
  companyIdentificationNumber?: string;
  image?: string;
  contactInformation?: ContactInformation;
  phoneInformation?: PhoneInformation;
}

/**
 * Union type pour mise à jour
 */
export type UpdateCustomerDto = UpdatePhysicalCustomerDto | UpdateLegalCustomerDto;