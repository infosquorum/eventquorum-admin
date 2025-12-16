//src/lib/organizers/types.ts
/**
 * Types pour l'entité Organizer (Organisateur)
 */

/**
 * Statut d'un organisateur
 */
export type OrganizerStatus = 'Active' | 'Inactive';

/**
 * Informations téléphoniques
 */
export interface PhoneInformation {
  number: string;
  region: string;
}

/**
 * Organizer tel que retourné par GET /api/organizers (liste)
 */
export interface Organizer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address : string;
  status: OrganizerStatus;
}

/**
 * Organizer détaillé tel que retourné par GET /api/organizers/{id}
 */
export interface OrganizerDetails extends Organizer {
  address: string;
}

/**
 * DTO pour créer un Organizer
 * Envoyé via POST /api/organizers
 */
export interface CreateOrganizerDto {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phoneInformation: PhoneInformation;
}

/**
 * DTO pour mettre à jour un Organizer
 * Envoyé via PUT /api/organizers/{id}
 */
export interface UpdateOrganizerDto {
  firstName?: string;
  lastName?: string;
  address?: string;
  email?: string;
  phoneInformation?: PhoneInformation;
  status?: OrganizerStatus;
}

/**
 * Réponse paginée du backend
 */
export interface PaginatedOrganizersResponse {
  items: Organizer[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}