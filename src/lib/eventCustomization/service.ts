// src/lib/eventCustomization/service.ts

import { apiFetch } from 'src/lib/api/fetcher';
import { API_ENDPOINTS } from 'src/lib/api/endpoints';

import type { EventCustomization } from './types';

/**
 * Service EventCustomization - Logique de LECTURE
 * 
 */
export const eventCustomizationService = {
  /**
   * 📖 Récupérer la customisation d'un événement par son ID
   * GET /api/events/{id}/customize
   * 
   * @param eventId - ID de l'événement
   * @returns Customisation complète avec tous les champs (même null)
   * 
   * @example
   * const customization = await eventCustomizationService.getByEventId('123');
   * console.log(customization.landingPage?.description);
   */
  async getByEventId(eventId: string): Promise<EventCustomization> {
    return apiFetch<EventCustomization>(
      API_ENDPOINTS.eventCustomization.getByEventId(eventId),
      {
        cache: 'no-store', // ✅ Pas de cache pour avoir les données fraîches
      }
    );
  },

  /**
   * 📖 Business Logic : Vérifier si la landing page est configurée
   * 
   * @param customization - Customisation de l'événement
   * @returns true si au moins un champ de landing page est rempli
   */
  hasLandingPage(customization: EventCustomization): boolean {
    if (!customization.landingPage) return false;

    const { description, longDescription, partners } = customization.landingPage;
    
    return !!(
      description || 
      longDescription || 
      (partners && partners.length > 0)
    );
  },

  /**
   * 📖 Business Logic : Vérifier si la charte graphique est configurée
   * 
   * @param customization - Customisation de l'événement
   * @returns true si au moins un champ de charte graphique est rempli
   */
  hasGraphicsChart(customization: EventCustomization): boolean {
    if (!customization.graphicsChart) return false;

    const chart = customization.graphicsChart;
    
    return !!(
      chart.eventLogo ||
      chart.navbarColor ||
      chart.buttonColor ||
      chart.primaryColorLandingPage ||
      (chart.sponsorLogos && chart.sponsorLogos.length > 0) ||
      (chart.loginPageImages && chart.loginPageImages.length > 0)
    );
  },

  /**
   * 📖 Business Logic : Vérifier si les ressources sont configurées
   * 
   * @param customization - Customisation de l'événement
   * @returns true si au moins une ressource est remplie
   */
  hasResources(customization: EventCustomization): boolean {
    if (!customization.ressources) return false;

    const { eventVideo, squareBackgroundImage, rectangleBackgroundImage } = customization.ressources;
    
    return !!(eventVideo || squareBackgroundImage || rectangleBackgroundImage);
  },

  /**
   * 📖 Business Logic : Calculer le pourcentage de complétion
   * 
   * @param customization - Customisation de l'événement
   * @returns Pourcentage de complétion (0-100)
   */
  getCompletionPercentage(customization: EventCustomization): number {
    let completed = 0;
    const total = 3;

    if (this.hasLandingPage(customization)) completed++;
    if (this.hasGraphicsChart(customization)) completed++;
    if (this.hasResources(customization)) completed++;

    return Math.round((completed / total) * 100);
  },
};