// src/lib/organizers/actions.ts

'use server';

import { revalidatePath } from 'next/cache';

import { apiFetch } from 'src/lib/api/fetcher';
import { API_ENDPOINTS } from 'src/lib/api/endpoints';

import type { CreateOrganizerDto, UpdateOrganizerDto } from './types';

/**
 * Server Actions Organizer - Mutations sécurisées
 */

/**
 * Créer un nouveau organizer
 * 
 * ✅ RETOURNE UN RÉSULTAT au lieu de redirect()
 */
export async function createOrganizer(data: CreateOrganizerDto) {
  try {
    console.log('➕ Création organizer:', data);

    const result = await apiFetch<{ id: string }>(
      API_ENDPOINTS.organizers.create,
      {
        method: 'POST',
        data,
      }
    );

    console.log('✅ Organizer créé:', result.id);

    // Invalider le cache de la liste
    revalidatePath('/admin/planifier-evenement');
    revalidatePath('/admin/planifierevent');
    
    // ✅ RETOURNER UN SUCCÈS au lieu de redirect()
    return { 
      success: true,
      id: result.id 
    };
  } catch (error) {
    console.error('❌ Erreur création organizer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la création de l\'organisateur',
    };
  }
}

/**
 * Mettre à jour un organizer
 * 
 * ✅ RETOURNE UN RÉSULTAT au lieu de redirect()
 */
export async function updateOrganizer(id: string, data: UpdateOrganizerDto) {
  try {
    console.log('🔄 Mise à jour organizer:', id, data);

    await apiFetch(
      API_ENDPOINTS.organizers.update(id),
      {
        method: 'PUT',
        data,
      }
    );

    console.log('✅ Organizer mis à jour');

    // Invalider le cache
    revalidatePath('/admin/planifier-evenement');
    revalidatePath('/admin/planifierevent');
    
    // ✅ RETOURNER UN SUCCÈS au lieu de redirect()
    return { 
      success: true 
    };
  } catch (error) {
    console.error('❌ Erreur mise à jour organizer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'organisateur',
    };
  }
}

/**
 * Supprimer un organizer
 */
export async function deleteOrganizer(id: string) {
  try {
    console.log('🗑️ Suppression organizer:', id);

    await apiFetch(
      API_ENDPOINTS.organizers.delete(id),
      {
        method: 'DELETE',
      }
    );

    console.log('✅ Organizer supprimé');

    revalidatePath('/admin/planifier-evenement');
    revalidatePath('/admin/planifierevent');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur suppression organizer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'organisateur',
    };
  }
}

/**
 * Suspendre un organizer
 */
export async function suspendOrganizer(id: string) {
  try {
    console.log('⏸️ Suspension organizer:', id);

    await apiFetch(
      API_ENDPOINTS.organizers.suspend(id),
      {
        method: 'PUT', 
      }
    );

    console.log('✅ Organizer suspendu');

    revalidatePath('/admin/planifier-evenement');
    revalidatePath('/admin/planifierevent');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur suspension organizer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la suspension de l\'organisateur',
    };
  }
}

/**
 * Réactiver un organizer suspendu
 */
export async function unsuspendOrganizer(id: string) {
  try {
    console.log('▶️ Réactivation organizer:', id);

    await apiFetch(
      API_ENDPOINTS.organizers.unsuspend(id),
      {
        method: 'PUT',
      }
    );

    console.log('✅ Organizer réactivé');

    revalidatePath('/admin/planifier-evenement');
    revalidatePath('/admin/planifierevent');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur réactivation organizer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la réactivation de l\'organisateur',
    };
  }
}