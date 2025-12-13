// src/lib/customers/service.ts

import { apiFetch } from 'src/lib/api/fetcher';
import { API_ENDPOINTS } from 'src/lib/api/endpoints';

import type { Customer, CustomerDetails, PaginatedCustomersResponse } from './types';

/**
 * Service Customer - Logique de LECTURE et business logic
 */
export const customerService = {
  /**
   * 📖 Récupérer tous les customers avec pagination
   * 
   * @param params - Paramètres de pagination et tri
   * @returns Liste paginée de customers
   */
  async getAll(params?: {
    page?: number;              // ← Changé de "cursor" à "page"
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'Asc' | 'Desc';
  }): Promise<PaginatedCustomersResponse> {
    // Construire les query parameters
    const searchParams = new URLSearchParams();
    
    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }
    if (params?.pageSize) {
      searchParams.append('pageSize', params.pageSize.toString());
    }
    if (params?.sortBy) {
      searchParams.append('sortBy', params.sortBy);
    }
    if (params?.sortOrder) {
      searchParams.append('sortOrder', params.sortOrder);
    }

    const query = searchParams.toString();
    const endpoint = `${API_ENDPOINTS.customers.list}${query ? `?${query}` : ''}`;

    return apiFetch<PaginatedCustomersResponse>(endpoint);
  },

  /**
   * 📖 Récupérer un customer par son ID
   */
  async getById(id: string): Promise<CustomerDetails> {
    return apiFetch<CustomerDetails>(API_ENDPOINTS.customers.byId(id), {
      cache: 'no-store', // ✅ AJOUTER : Pas de cache pour cette requête
    });
  },

  /**
   * 📖 Business Logic : Formater le nom d'affichage
   * Maintenant simplifié car le backend retourne déjà "name" formaté
   */
  formatDisplayName(customer: Customer): string {
    return customer.name;
  },

  /**
   * 📖 Business Logic : Obtenir le type formaté en français
   */
  getTypeLabel(customer: Customer): string {
    return customer.type === 'Physical' ? 'Personne Physique' : 'Personne Morale';
  },

  /**
   * 📖 Business Logic : Formater la date de création
   */
  formatCreatedDate(customer: Customer): string {
    const date = new Date(customer.createdAt);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },
};