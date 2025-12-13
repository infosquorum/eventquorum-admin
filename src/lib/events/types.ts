// src/lib/events/types.ts

/**
 * Types pour l'entité Event
 * ✅ Mis à jour pour correspondre au contrat API backend réel
 */

/**
 * Statut d'un événement
 */
export type EventStatus = 'NotStarted' | 'InProgress' | 'Finished' | 'Suspended';

/**
 * Informations de période (dates)
 */
export interface PeriodInformation {
  start: string;
  end: string;
}

/**
 * Event tel que retourné par l'API (liste)
 */
export interface Event {
  id: string;
  registrationNumber: string;
  eventType: string;
  name: string;
  startDate: string;
  endDate: string;
  customerName: string;
  location: string;
  image: string | null;
  description: string;
  status: EventStatus;
}

/**
 * Event détaillé retourné par GET /api/events/{id}
 * Structure différente de la liste
 */
export interface EventDetails {
  id: string;
  customerId: string;
  organizerIds: string[];
  eventTypeId: string;
  status: EventStatus;
  name: string;
  location: string;
  image: string | null;
  description: string;
  periodInformation: PeriodInformation;
}

/**
 * DTO pour créer un Event
 * 
 * ✅ Correspond au contrat API POST /api/events
 */
export interface CreateEventDto {
  customerId: string;
  organizerIds: string[];
  eventTypeId: string;
  name: string;
  location: string;
  description: string;
  image: string; // ✅ DÉCOMMENTÉ - UUID du média uploadé
  periodInformation: PeriodInformation;
}

/**
 * DTO pour mettre à jour un Event
 * Tous les champs sont optionnels (sauf en mode UPDATE complet)
 */
export interface UpdateEventDto {
  customerId?: string;
  organizerIds?: string[];
  eventTypeId?: string;
  name?: string;
  location?: string;
  description?: string;
  image?: string; // ✅ DÉCOMMENTÉ - UUID du média (optionnel en UPDATE)
  periodInformation?: PeriodInformation;
}

/**
 * Réponse paginée
 */
export interface PaginatedEventsResponse {
  items: Event[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

/**
 * Type d'événement
 */
export interface EventType {
  id: string;
  label: string;
  description?: string;
}