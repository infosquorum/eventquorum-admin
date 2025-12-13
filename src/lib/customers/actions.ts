/// src/lib/customers/actions.ts

'use server';

 // ✨ IMPORTANT : Ces fonctions s'exécutent UNIQUEMENT côté serveur

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { apiFetch } from 'src/lib/api/fetcher';
import { API_ENDPOINTS } from 'src/lib/api/endpoints';

import type { CreateCustomerDto, UpdateCustomerDto } from './types';


/**
 *Créer un nouveau customer
 * 
 * Utilisé dans les formulaires de création
 * 
 * @param data - Données du customer à créer
 * @returns { error } si erreur, sinon redirection automatique
 * 
 * @example
 * // Dans un formulaire
 * import { createCustomer } from '@/lib/customers/actions';
 * 
 * async function handleSubmit(formData: FormData) {
 *   const result = await createCustomer({
 *     type: 'Physical',
 *     firstName: formData.get('firstName') as string,
 *     // ...
 *   });
 * 
 *   if (result?.error) {
 *     alert(result.error);
 *   }
 * }
 */

export async function createCustomer(data: CreateCustomerDto) {
  try {
    const result = await apiFetch<{ id: string }>(
      API_ENDPOINTS.customers.create,
      {
        method: 'POST',
        data,
      }
    );

    // Invalider le cache Next.js de la page liste
    revalidatePath('/admin/gestionclient');

    // ✅ Retourner succès (pas de redirect dans le formulaire)
    return { success: true, id: result.id };

  } catch (error) {
    // Retourner l'erreur pour affichage dans le formulaire
    console.error('Erreur création customer:', error);
    return {
      error: error instanceof Error ? error.message : 'Erreur lors de la création du client',
    };
  }
}

/**
 * Mettre à jour un customer existant
 * 
 * Utilisé dans les formulaires d'édition
 * 
 * @param id - ID du customer à modifier
 * @param data - Données à mettre à jour (partielles)
 * @returns { error } si erreur, sinon redirection automatique
 * 
 * @example
 * const result = await updateCustomer('123', {
 *   email: 'newemail@example.com',
 *   phoneNumber: '+225 07 00 00 00 00'
 * });
 */
export async function updateCustomer(id: string, data: UpdateCustomerDto) {
  try {
    await apiFetch(
      API_ENDPOINTS.customers.update(id),
      {
        method: 'PUT',
        data,
      }
    );

    // Invalider le cache de la liste ET de la page détail
    revalidatePath('/admin/gestionclient'); // Cache de la liste
    revalidatePath(`/admin/gestionclient/ficheclient/${id}`); // Cache de la fiche détail

    // ✅ Retourner succès (pas de redirect dans le formulaire)
    return { success: true };
    
  } catch (error) {
    console.error('Erreur mise à jour customer:', error);
    return {
      error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du client',
    };
  }
}

/**
 * Archiver (supprimer) un customer
 * 
 * Utilisé dans les boutons "Archiver" / "Supprimer"
 * 
 * @param id - ID du customer à archiver
 * @returns { success: true } ou { error }
 * 
 * @example
 * const result = await archiveCustomer('123');
 * if (result.error) {
 *   alert(result.error);
 * } else {
 *   alert('Customer archivé !');
 * }
 */
export async function archiveCustomer(id: string) {
  try {
    // Appel API backend pour archiver
    await apiFetch(
      API_ENDPOINTS.customers.delete(id),
      {
        method: 'DELETE',
      }
    );

    // Invalider le cache de la liste
    revalidatePath('/admin/gestionclient');

    return { success: true };
  } catch (error) {
    console.error('Erreur archivage customer:', error);
    return {
      error: error instanceof Error ? error.message : 'Erreur lors de l\'archivage du client',
    };
  }
}