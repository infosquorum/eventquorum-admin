
/**
 * Types pour l'entité EventType (Types d'Événements)
 */

/**
 * Type d'événement
 */
export interface EventType {
  id: string;
  label: string;
  description: string | null;
}

/**
 * DTO pour créer un EventType
 */
export interface CreateEventTypeDto {
  label: string;
  description?: string | null;
}

/**
 * DTO pour mettre à jour un EventType
 * Tous les champs sont optionnels
 */
export interface UpdateEventTypeDto {
  label?: string;
  description?: string | null;
}