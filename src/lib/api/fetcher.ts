// src/lib/api/fetcher.ts

import { API_CONFIG } from './config';

/**
 * Erreur personnalisée pour les appels API
 * Contient le code HTTP et le message d'erreur
 */
export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public code?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}


/**
 * Options pour les appels API
 */
interface FetchOptions extends RequestInit {
    data?: any;
    cache?: RequestCache; // ✅ AJOUTÉ
}

/**
 * Fonction fetch réutilisable avec gestion d'erreurs
 * 
 * C'est juste fetch() natif + gestion d'erreurs automatique
 * 
 * @param endpoint - URL relative (ex: '/api/customers')
 * @param options - Options de fetch + data pour le body
 * @returns Réponse parsée en JSON
 * 
 * @example
 * // GET request
 * const customers = await apiFetch('/api/customers');
 * 
 * @example
 * // POST request
 * const newCustomer = await apiFetch('/api/customers', {
 *   method: 'POST',
 *   data: { name: 'John', email: 'john@example.com' }
 * });
 * 
 * @example
 * // Avec endpoints centralisés
 * import { API_ENDPOINTS } from './endpoints';
 * const customer = await apiFetch(API_ENDPOINTS.customers.byId('123'));
 */
export async function apiFetch<T = any>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { data, headers, cache, ...restOptions } = options;

    // Construire l'URL complète
    const url = `${API_CONFIG.baseUrl}${endpoint}`;

    // Préparer les headers
    const finalHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...headers,
        // TODO: Ajouter Authorization header quand JWT sera implémenté
        // 'Authorization': `Bearer ${token}`,
    };

    // Préparer les options de fetch
    const fetchOptions: RequestInit = {
        ...restOptions,
        headers: finalHeaders,
        cache, // ✅ AJOUTÉ,
        // Si data existe, l'ajouter au body (pour POST/PUT)
        ...(data && { body: JSON.stringify(data) }),
    };

    try {
        // Appel fetch natif
        const response = await fetch(url, fetchOptions);

        // Gérer les erreurs HTTP (4xx, 5xx)
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = response.statusText;
            let errorCode: string | undefined;

            // Essayer de parser l'erreur JSON du backend
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorData.title || errorMessage;
                errorCode = errorData.code;
            } catch {
                // Si pas JSON, utiliser le texte brut
                errorMessage = errorText || errorMessage;
            }

            throw new ApiError(response.status, errorMessage, errorCode);
        }

        // Si 204 No Content (DELETE success), retourner null
        if (response.status === 204) {
            return null as T;
        }

        // ✨ NOUVEAU : Vérifier si la réponse a du contenu
        const contentLength = response.headers.get('content-length');
        const contentType = response.headers.get('content-type');

        // Si pas de contenu ou pas de JSON, retourner null
        if (contentLength === '0' || !contentType?.includes('application/json')) {
            return null as T;
        }

        // ✨ NOUVEAU : Parser JSON avec gestion d'erreur
        try {
            return await response.json();
        } catch (error) {
            // Body vide ou JSON invalide, retourner null
            console.warn('Réponse sans JSON valide, retour null');
            return null as T;
        }
    } catch (error) {
        // Si c'est déjà une ApiError, la relancer telle quelle
        if (error instanceof ApiError) {
            throw error;
        }

        // Erreur réseau ou autre (timeout, pas de connexion, etc.)
        throw new ApiError(
            0,
            error instanceof Error ? error.message : 'Erreur réseau inconnue'
        );
    }
}