// src/lib/api/endpoints.ts
/**
 * Centralisation de TOUTES les URLs des endpoints API
 * 
 * Utilisation :
 * - API_ENDPOINTS.customers.list → '/api/customers'
 * - API_ENDPOINTS.customers.byId('123') → '/api/customers/123'
 */
export const API_ENDPOINTS = {
  /**
   * Endpoints Customers (Clients)
   */
  customers: {

    list: '/api/customers',

    byId: (id: string) => `/api/customers/${id}`,

    create: '/api/customers',

    update: (id: string) => `/api/customers/${id}`,

    delete: (id: string) => `/api/customers/${id}`,
  },

  /**
   * Endpoints Organizers (Organisateurs)
   */
  organizers: {

    list: '/api/organizers',

    byId: (id: string) => `/api/organizers/${id}`,

    create: '/api/organizers',

    update: (id: string) => `/api/organizers/${id}`,

    delete: (id: string) => `/api/organizers/${id}`,

    suspend: (id: string) => `/api/organizers/${id}/suspend`,

    unsuspend: (id: string) => `/api/organizers/${id}/unsuspend`,
  },

  /**
   * Endpoints Events (Événements)
   */
  events: {

    list: '/api/events',

    byId: (id: string) => `/api/events/${id}`,

    create: '/api/events',

    update: (id: string) => `/api/events/${id}`,

    delete: (id: string) => `/api/events/${id}`,
    suspend: (id: string) => `/api/events/${id}/suspend`,
    unsuspend: (id: string) => `/api/events/${id}/unsuspend`, // Si existe
  },


  // ✨ EventTypes endpoints
  eventTypes: {
    list: '/api/event-types',
    byId: (id: string) => `/api/event-types/${id}`,
    create: '/api/event-types',
    update: (id: string) => `/api/event-types/${id}`,
    delete: (id: string) => `/api/event-types/${id}`,
  },

  /**
  * ✨Endpoints Event Customization
  */
  eventCustomization: {
    getByEventId: (eventId: string) => `/api/events/${eventId}/customize`,
    update: (eventId: string) => `/api/events/${eventId}/customize`,
  },

  /**
   * Endpoints Landing Pages (dans Events)
   */
  landingPages: {

    byEventId: (eventId: string) => `/api/events/${eventId}/landing-page`,

    create: (eventId: string) => `/api/events/${eventId}/landing-page`,

    update: (eventId: string) => `/api/events/${eventId}/landing-page`,
  },

  /**
 * 📸 Endpoints Medias (Images)
 */
  medias: {

    requestUpload: '/api/medias',
    confirm: (id: string) => `/api/medias/${id}/confirm`,
  },
} as const;