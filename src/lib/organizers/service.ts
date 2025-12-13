/// src/lib/organizers/service.ts

import { apiFetch } from 'src/lib/api/fetcher';
import { API_ENDPOINTS } from 'src/lib/api/endpoints';

import type { Organizer, OrganizerDetails, PaginatedOrganizersResponse } from './types';

/**
 * Service Organizer - Logique de LECTURE et business logic
 */
export const organizerService = {
    /**
     * Récupérer tous les organizers avec pagination
     */
    async getAll(params?: {
        page?: number;
        pageSize?: number;
    }): Promise<PaginatedOrganizersResponse> {
        const searchParams = new URLSearchParams();

        if (params?.page) {
            searchParams.append('page', params.page.toString());
        }
        if (params?.pageSize) {
            searchParams.append('pageSize', params.pageSize.toString());
        }

        const query = searchParams.toString();
        const endpoint = `${API_ENDPOINTS.organizers.list}${query ? `?${query}` : ''}`;

        return apiFetch<PaginatedOrganizersResponse>(endpoint);
    },

    /**
     * Récupérer un organizer par son ID (avec détails complets)
     */
    async getById(id: string): Promise<OrganizerDetails> {
        return apiFetch<OrganizerDetails>(API_ENDPOINTS.organizers.byId(id));
    },

    /**
     * Business Logic : Formater le nom complet
     */
    formatDisplayName(organizer: Organizer): string {
        return `${organizer.firstName} ${organizer.lastName}`;
    },

    /**
     * Business Logic : Obtenir les initiales
     */
    getInitials(organizer: Organizer): string {
        return `${organizer.firstName.charAt(0)}${organizer.lastName.charAt(0)}`.toUpperCase();
    },

    /**
     * Business Logic : Obtenir le statut formaté en français
     */
    getStatusLabel(organizer: Organizer): string {
        return organizer.status === 'Active' ? 'Actif' : 'Suspendu';
    },

    /**
     * Business Logic : Obtenir la couleur du statut (pour affichage)
     */
    getStatusColor(organizer: Organizer): 'success' | 'error' {
        return organizer.status === 'Active' ? 'success' : 'error';
    },

    /**
     * Business Logic : Vérifier si un organizer peut être suspendu
     */
    canSuspend(organizer: Organizer): boolean {
        return organizer.status === 'Active';
    },

    /**
     * Business Logic : Vérifier si un organizer peut être réactivé
     */
    canUnsuspend(organizer: Organizer): boolean {
        return organizer.status === 'Suspended';
    },
};