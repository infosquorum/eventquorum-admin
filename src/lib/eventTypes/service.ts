/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * SERVICE EVENT TYPES - VERSION CORRIGÉE
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ⚠️ IMPORTANT : L'export s'appelle "eventTypesService" (avec "s")
 * pour correspondre aux imports de la page détail
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { apiFetch } from 'src/lib/api/fetcher';
import { API_ENDPOINTS } from 'src/lib/api/endpoints';
import type { EventType } from './types';

/**
 * Service EventType - Logique de LECTURE et business logic
 * 
 * Ce service gère :
 * - Récupération de tous les types d'événements (sans pagination)
 * - Récupération d'un type spécifique
 * - Formatage et validation
 */
export const eventTypesService = {  // ← AVEC "S" !
  /**
   * 📖 Récupérer tous les types d'événements
   * 
   * Note : Pas de pagination, retourne un array simple
   * 
   * @example
   * const types = await eventTypesService.getAll();
   * // Retourne : EventType[]
   */
  async getAll(): Promise<EventType[]> {
    return apiFetch<EventType[]>(API_ENDPOINTS.eventTypes.list);
  },

  /**
   * 📖 Récupérer un type d'événement par son ID
   * 
   * @example
   * const type = await eventTypesService.getById('123');
   */
  async getById(id: string): Promise<EventType> {
    return apiFetch<EventType>(API_ENDPOINTS.eventTypes.byId(id));
  },

  /**
   * 📖 Business Logic : Formater le label pour affichage
   * 
   * @example
   * "Gala et soirée de récompenses"
   */
  formatLabel(eventType: EventType): string {
    return eventType.label;
  },

  /**
   * 📖 Business Logic : Obtenir la description ou un texte par défaut
   * 
   * @example
   * eventTypesService.getDescription(type); // "Évènement festif..."
   * eventTypesService.getDescription(type); // "Aucune description"
   */
  getDescription(eventType: EventType): string {
    return eventType.description || 'Aucune description disponible';
  },

  /**
   * 📖 Business Logic : Vérifier si le type a une description
   */
  hasDescription(eventType: EventType): boolean {
    return eventType.description !== null && eventType.description.trim() !== '';
  },

  /**
   * 📖 Business Logic : Filtrer les types par recherche
   * Utile pour les select avec recherche
   * 
   * @example
   * const filtered = eventTypesService.filterBySearch(types, 'gala');
   * // Retourne les types contenant "gala" dans le label
   */
  filterBySearch(eventTypes: EventType[], searchTerm: string): EventType[] {
    if (!searchTerm.trim()) return eventTypes;
    
    const search = searchTerm.toLowerCase();
    return eventTypes.filter(type => 
      type.label.toLowerCase().includes(search) ||
      (type.description && type.description.toLowerCase().includes(search))
    );
  },

  /**
   * 📖 Business Logic : Trier les types par label alphabétique
   * 
   * @example
   * const sorted = eventTypesService.sortByLabel(types);
   */
  sortByLabel(eventTypes: EventType[]): EventType[] {
    return [...eventTypes].sort((a, b) => 
      a.label.localeCompare(b.label, 'fr-FR')
    );
  },

  /**
   * 📖 Business Logic : Obtenir les types pour un Select/Dropdown
   * Retourne un format optimisé pour Material-UI Select
   * 
   * @example
   * const options = eventTypesService.getSelectOptions(types);
   * // [{ value: "123", label: "Gala..." }, ...]
   */
  getSelectOptions(eventTypes: EventType[]): Array<{ value: string; label: string }> {
    return eventTypes.map(type => ({
      value: type.id,
      label: type.label
    }));
  },

  /**
   * 📖 Business Logic : Valider si un type existe dans une liste
   * 
   * @example
   * if (eventTypesService.exists(types, selectedId)) { ... }
   */
  exists(eventTypes: EventType[], id: string): boolean {
    return eventTypes.some(type => type.id === id);
  },

  /**
   * 📖 Business Logic : Trouver un type par ID dans une liste
   * 
   * @example
   * const type = eventTypesService.findById(types, '123');
   */
  findById(eventTypes: EventType[], id: string): EventType | undefined {
    return eventTypes.find(type => type.id === id);
  },
};