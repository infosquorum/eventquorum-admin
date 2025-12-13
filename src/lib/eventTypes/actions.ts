// src/lib/eventTypes/actions.ts

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { apiFetch } from 'src/lib/api/fetcher';
import { API_ENDPOINTS } from 'src/lib/api/endpoints';
import type { CreateEventTypeDto, UpdateEventTypeDto } from './types';

/**
 * Server Actions EventType - Mutations sécurisées
 * 
 * Ces actions s'exécutent UNIQUEMENT côté serveur
 */

export async function createEventType(data: CreateEventTypeDto) {
  try {
    // Validation côté serveur
    if (!data.label || data.label.trim() === '') {
      return {
        error: 'Le label est requis'
      };
    }

    if (data.label.length < 3) {
      return {
        error: 'Le label doit contenir au moins 3 caractères'
      };
    }

    if (data.label.length > 100) {
      return {
        error: 'Le label ne peut pas dépasser 100 caractères'
      };
    }

    if (data.description && data.description.length > 500) {
      return {
        error: 'La description ne peut pas dépasser 500 caractères'
      };
    }

    // Appel API
    const result = await apiFetch<{ id: string }>(
      API_ENDPOINTS.eventTypes.create,
      {
        method: 'POST',
        data,
      }
    );

    // Invalider le cache
    revalidatePath('/admin/event-types');
    
    // ✅ Retourner succès
    return { success: true };
  } catch (error) {
    console.error('Erreur création event type:', error);
    return {
      error: error instanceof Error ? error.message : 'Erreur lors de la création du type d\'événement',
    };
  }
}

/**
 * ✍️ Mettre à jour un type d'événement
 * 
 * @example
 * const result = await updateEventType('123', {
 *   label: 'Workshop Digital - Edition 2025'
 * });
 */
// export async function updateEventType(id: string, data: UpdateEventTypeDto) {
//   try {
//     // Validation côté serveur
//     if (data.label !== undefined) {
//       if (data.label.trim() === '') {
//         return {
//           error: 'Le label ne peut pas être vide'
//         };
//       }

//       if (data.label.length < 3) {
//         return {
//           error: 'Le label doit contenir au moins 3 caractères'
//         };
//       }

//       if (data.label.length > 100) {
//         return {
//           error: 'Le label ne peut pas dépasser 100 caractères'
//         };
//       }
//     }

//     if (data.description && data.description.length > 500) {
//       return {
//         error: 'La description ne peut pas dépasser 500 caractères'
//       };
//     }

//     // Appel API
//     await apiFetch(
//       API_ENDPOINTS.eventTypes.update(id),
//       {
//         method: 'PUT',
//         data,
//       }
//     );

//     // Invalider le cache
//     revalidatePath(`/admin/event-types/${id}`);
//     revalidatePath('/admin/event-types');
    
//     // Rediriger vers la liste
//     redirect('/admin/event-types');
//   } catch (error) {
//     console.error('Erreur mise à jour event type:', error);
//     return {
//       error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du type d\'événement',
//     };
//   }
// }

/**
 * ✍️ Supprimer un type d'événement
 * 
 * @example
 * const result = await deleteEventType('123');
 * if (result?.error) {
 *   toast.error(result.error);
 * } else {
 *   toast.success('Type supprimé');
 * }
 */
// export async function deleteEventType(id: string) {
//   try {
//     await apiFetch(
//       API_ENDPOINTS.eventTypes.delete(id),
//       {
//         method: 'DELETE',
//       }
//     );

//     // Invalider le cache
//     revalidatePath('/admin/event-types');
    
//     return { success: true };
//   } catch (error) {
//     console.error('Erreur suppression event type:', error);
//     return {
//       error: error instanceof Error ? error.message : 'Erreur lors de la suppression du type d\'événement',
//     };
//   }
// }