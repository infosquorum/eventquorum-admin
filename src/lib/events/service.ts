// src/lib/events/service.ts

import { apiFetch } from 'src/lib/api/fetcher';
import { API_ENDPOINTS } from 'src/lib/api/endpoints';

import type { Event, EventDetails, PaginatedEventsResponse, EventType } from './types';

/**
 * Service Event - Logique de LECTURE et business logic
 * 
 * Ce service gère :
 * - Récupération des events (liste, détail)
 * - Formatage des dates
 * - Calcul de durée
 * - Statuts formatés
 */
export const eventService = {
    /**
     * Récupérer tous les events avec pagination
     * 
     * @example
     * const events = await eventService.getAll({ page: 1, pageSize: 10 });
     */
    async getAll(params?: {
        page?: number;
        pageSize?: number;
        sortBy?: string;
        sortOrder?: 'Asc' | 'Desc';
    }): Promise<PaginatedEventsResponse> {
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
        const endpoint = `${API_ENDPOINTS.events.list}${query ? `?${query}` : ''}`;

        return apiFetch<PaginatedEventsResponse>(endpoint);
    },

    /**
     *Récupérer un event par son ID (détails complets)
     * 
     * @example
     * const event = await eventService.getById('123');
     */
    async getById(id: string): Promise<EventDetails> {
        return apiFetch<EventDetails>(API_ENDPOINTS.events.byId(id));
    },

    /**
     * 📖 Récupérer tous les types d'événements
     * 
     * @example
     * const types = await eventService.getEventTypes();
     */
    async getEventTypes(): Promise<EventType[]> {
        return apiFetch<EventType[]>(API_ENDPOINTS.eventTypes.list);
    },

    /**
     * Business Logic : Formater la période de l'événement
     * 
     * @example
     * "27 novembre 2025 - 27 décembre 2025"
     */
    formatEventPeriod(event: Event): string {
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);

        const startFormatted = start.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const endFormatted = end.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        return `${startFormatted} - ${endFormatted}`;
    },

    /**
     * 📖 Business Logic : Formater une date unique
     */
    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * 📖 Business Logic : Calculer la durée en jours
     */
    calculateDuration(event: Event): number {
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + 1; // +1 pour inclure le jour de début
    },

    /**
     * 📖 Business Logic : Vérifier si l'événement est à venir
     */
    isUpcoming(event: Event): boolean {
        const start = new Date(event.startDate);
        return start > new Date() && event.status !== 'Suspended';
    },

    /**
     * 📖 Business Logic : Vérifier si l'événement est en cours
     */
    isOngoing(event: Event): boolean {
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);
        const now = new Date();
        return now >= start && now <= end && event.status === 'InProgress';
    },

    /**
     * 📖 Business Logic : Vérifier si l'événement est terminé
     */
    isFinished(event: Event): boolean {
        return event.status === 'Finished';
    },

    /**
     * 📖 Business Logic : Obtenir le statut formaté en français
     */
    getStatusLabel(event: Event): string {
        const statusMap: Record<string, string> = {
            'NotStarted': 'Non démarré',
            'InProgress': 'En cours',
            'Finished': 'Terminé',
            'Suspended': 'Suspendu'
        };
        return statusMap[event.status] || event.status;
    },

    /**
     * 📖 Business Logic : Obtenir la couleur du statut (pour badges)
     */
    getStatusColor(event: Event): 'default' | 'primary' | 'success' | 'warning' | 'error' {
        const colorMap: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
            'NotStarted': 'default',
            'InProgress': 'primary',
            'Finished': 'success',
            'Suspended': 'warning'
        };
        return colorMap[event.status] || 'default';
    },

    /**
     * 📖 Business Logic : Vérifier si peut être suspendu
     */
    canSuspend(event: Event): boolean {
        return event.status !== 'Suspended' && event.status !== 'Finished';
    },

    /**
     * 📖 Business Logic : Vérifier si peut être réactivé
     */
    canUnsuspend(event: Event): boolean {
        return event.status === 'Suspended';
    },
};