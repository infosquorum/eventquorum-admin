// src/lib/events/actions.ts

'use server';

import { revalidatePath } from 'next/cache';

import { apiFetch } from 'src/lib/api/fetcher';
import { API_ENDPOINTS } from 'src/lib/api/endpoints';

import type { CreateEventDto, UpdateEventDto } from './types';

/**
 * Server Actions Event - Mutations sécurisées
 * ✅ SANS redirect() pour éviter les erreurs NEXT_REDIRECT
 */

/**
 * Créer un nouvel event
 */
export async function createEvent(data: CreateEventDto) {
  try {
    console.log('➕ Création event:', data);

    const result = await apiFetch<{ id: string }>(
      API_ENDPOINTS.events.create,
      {
        method: 'POST',
        data,
      }
    );

    console.log('✅ Event créé:', result.id);

    // Invalider le cache
    revalidatePath('/admin/planifierevent');
    revalidatePath('/admin/planifier-evenement');
    
    // ✅ RETOURNER UN RÉSULTAT au lieu de redirect()
    return { 
      success: true,
      id: result.id 
    };
  } catch (error) {
    console.error('❌ Erreur création event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la création de l\'événement',
    };
  }
}

/**
 * Mettre à jour un event
 */
export async function updateEvent(id: string, data: UpdateEventDto) {
  try {
    console.log('🔄 Mise à jour event:', id, data);

    await apiFetch(
      API_ENDPOINTS.events.update(id),
      {
        method: 'PUT',
        data,
      }
    );

    console.log('✅ Event mis à jour');

    // Invalider le cache
    revalidatePath('/admin/planifierevent');
    revalidatePath('/admin/planifier-evenement');
    revalidatePath(`/admin/planifierevent/detailevenement/${id}`);
    
    // ✅ RETOURNER UN RÉSULTAT
    return { 
      success: true 
    };
  } catch (error) {
    console.error('❌ Erreur mise à jour event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'événement',
    };
  }
}

/**
 * Supprimer un event
 */
export async function deleteEvent(id: string) {
  try {
    console.log('🗑️ Suppression event:', id);

    await apiFetch(
      API_ENDPOINTS.events.delete(id),
      {
        method: 'DELETE',
      }
    );

    console.log('✅ Event supprimé');

    revalidatePath('/admin/planifierevent');
    revalidatePath('/admin/planifier-evenement');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur suppression event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'événement',
    };
  }
}

/**
 * Suspendre un event
 */
export async function suspendEvent(id: string) {
  try {
    console.log('⏸️ Suspension event:', id);

    await apiFetch(
      API_ENDPOINTS.events.suspend(id),
      {
        method: 'PUT',
      }
    );

    console.log('✅ Event suspendu');

    revalidatePath('/admin/planifierevent');
    revalidatePath('/admin/planifier-evenement');
    revalidatePath(`/admin/planifierevent/detailevenement/${id}`);
    
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur suspension event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la suspension de l\'événement',
    };
  }
}

/**
 * Réactiver un event suspendu
 */
export async function unsuspendEvent(id: string) {
  try {
    console.log('▶️ Réactivation event:', id);

    await apiFetch(
      API_ENDPOINTS.events.unsuspend(id),
      {
        method: 'PUT',
      }
    );

    console.log('✅ Event réactivé');

    revalidatePath('/admin/planifierevent');
    revalidatePath('/admin/planifier-evenement');
    revalidatePath(`/admin/planifierevent/detailevenement/${id}`);
    
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur réactivation event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la réactivation de l\'événement',
    };
  }
}