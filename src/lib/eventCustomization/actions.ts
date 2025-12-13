
//src/lib/eventCustomization/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

import { apiFetch } from 'src/lib/api/fetcher';
import { API_ENDPOINTS } from 'src/lib/api/endpoints';

import type { UpdateEventCustomizationDto, LandingPage, GraphicsChart, Resources } from './types';

/**
 * METTRE À JOUR LA CUSTOMISATION (complète ou partielle)
 */
export async function updateEventCustomization(
  eventId: string,
  data: Partial<UpdateEventCustomizationDto>
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    console.log('🔄 Mise à jour customisation event:', eventId);
    console.log('📦 Données reçues:', data);

    // ✅ Préparer le payload avec TOUS les champs explicitement définis
    const payload: UpdateEventCustomizationDto = {
      landingPage: {
        description: data.landingPage?.description ?? null,
        longDescription: data.landingPage?.longDescription ?? null,
        partners: data.landingPage?.partners ?? null,
      },
      graphicsChart: {
        eventLogo: data.graphicsChart?.eventLogo ?? null,
        sponsorLogos: data.graphicsChart?.sponsorLogos ?? null,
        loginPageImages: data.graphicsChart?.loginPageImages ?? null,
        loginLogoSize: data.graphicsChart?.loginLogoSize ?? null,
        navbarLogoSize: data.graphicsChart?.navbarLogoSize ?? null,
        pdfLogoSize: data.graphicsChart?.pdfLogoSize ?? null,
        partnerLogoSize: data.graphicsChart?.partnerLogoSize ?? null,
        navbarColor: data.graphicsChart?.navbarColor ?? null,
        textColor: data.graphicsChart?.textColor ?? null,
        uiStyle: data.graphicsChart?.uiStyle ?? null,
        backgroundColorNavbar: data.graphicsChart?.backgroundColorNavbar ?? null,
        buttonColor: data.graphicsChart?.buttonColor ?? null,
        iconColor: data.graphicsChart?.iconColor ?? null,
        primaryColorLandingPage: data.graphicsChart?.primaryColorLandingPage ?? null,
        secondaryColorLandingPage: data.graphicsChart?.secondaryColorLandingPage ?? null,
      },
      ressources: {
        eventVideo: data.ressources?.eventVideo ?? null,
        squareBackgroundImage: data.ressources?.squareBackgroundImage ?? null,
        rectangleBackgroundImage: data.ressources?.rectangleBackgroundImage ?? null,
      },
    };

    console.log('📤 Payload envoyé:', JSON.stringify(payload, null, 2));

    const response = await apiFetch<{ id: string }>(
      API_ENDPOINTS.eventCustomization.update(eventId),
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );

    // Revalider les chemins concernés
    revalidatePath(`/api/events/${eventId}/customize`);
    revalidatePath(`/admin/planifierevent/detailevenement/${eventId}`);
    revalidatePath('/admin/planifierevent');

    console.log('✅ Mise à jour réussie:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('❌ Erreur mise à jour customisation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour',
    };
  }
}

/**
 * HELPERS : Mettre à jour une section spécifique
 */

export async function updateLandingPage(eventId: string, landingPage: LandingPage) {
  return updateEventCustomization(eventId, { landingPage });
}

export async function updateGraphicsChart(eventId: string, graphicsChart: GraphicsChart) {
  return updateEventCustomization(eventId, { graphicsChart });
}

export async function updateResources(eventId: string, ressources: Resources) {
  return updateEventCustomization(eventId, { ressources });
}