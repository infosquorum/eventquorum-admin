// src/lib/medias/service.ts

import { apiFetch } from 'src/lib/api/fetcher';
import { API_ENDPOINTS } from 'src/lib/api/endpoints';
import { API_CONFIG } from 'src/lib/api/config'; // ✅ Import de la config

import type {
  MediaUploadResponse,
  MediaConfirmResponse,
  RequestUploadUrlDto,
  UploadResult,
  UploadImageOptions,
  MediaFolder,
  MediaType
} from './types';

/**
 * Service Media - Gestion des uploads vers Azure Blob avec confirmation
 * 
 * workflow en 3 étapes :
 * 1. POST /api/medias → Obtenir URL SAS + mediaId
 * 2. PUT vers Azure Blob → Uploader le fichier
 * 3. PUT /api/medias/{id}/confirm → Confirmer et obtenir URL permanente
 * 
 * Le mediaId est utilisé dans les DTO (remplace l'ancien blobName)
 */
export const mediaService = {

  /**
   * 📸 Uploader une image (workflow complet avec confirmation)
   * 
   * Cette fonction gère TOUT le processus :
   * - Validation du fichier
   * - Demande d'URL SAS au backend
   * - Upload vers Azure Blob
   * - Confirmation de l'upload
   * - Retour du mediaId pour les DTO
   * 
   * @example
   * const result = await mediaService.uploadImage({
   *   file: selectedFile,
   *   folder: 'Customers',
   *   onProgress: (p) => setProgress(p)
   * });
   * 
   * // Utiliser result.mediaId dans le DTO
   * createCustomer({ ..., image: result.mediaId });
   */

  async uploadImage(options: UploadImageOptions): Promise<UploadResult> {
    const { file, folder = 'Customers', onProgress } = options;

    // ✅ Validation du fichier
    this.validateImageFile(file);

    try {
      // 1️⃣ Demander URL SAS au backend
      onProgress?.(10);
      const uploadResponse = await this.requestUploadUrl({
        fileName: file instanceof File ? file.name : 'image.jpg',
        contentType: file.type || 'image/jpeg',
        folder,
        type: 'Images'
      });

      const mediaId = uploadResponse.id;
      const sasUrl = uploadResponse.url;

      console.log('✅ URL SAS obtenue, mediaId:', mediaId);

      // 2️⃣ Uploader vers Azure Blob
      onProgress?.(30);
      await this.uploadToAzure(sasUrl, file, onProgress);

      console.log('✅ Fichier uploadé sur Azure');

      // 3️⃣ Confirmer l'upload
      onProgress?.(90);
      const confirmResponse = await this.confirmUpload(mediaId);

      console.log('✅ Upload confirmé, réponse:', confirmResponse);

      onProgress?.(100);

      // ✅ CORRECTION : Utiliser resourceId du backend
      const finalMediaId = confirmResponse?.resourceId || mediaId;

      // ✅ Construire l'URL permanente (sans token SAS)
      const fileName = file instanceof File ? file.name : 'image.jpg';
      const folderPath = folder.toLowerCase(); // "customers" ou "events"
      const typePath = 'images'; // Toujours "images" pour les images
      const finalUrl = `${API_CONFIG.BLOB_BASE_URL}/${folderPath}/${typePath}/${finalMediaId}_${fileName}`;

      console.log('✅ MediaId final:', finalMediaId);
      console.log('✅ URL permanente construite:', finalUrl);

      // 4️⃣ Retourner le mediaId et l'URL permanente
      return {
        mediaId: finalMediaId,
        mediaUrl: finalUrl
      };
    } catch (error) {
      console.error('❌ Erreur upload image:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Erreur lors de l\'upload de l\'image'
      );
    }
  },


  /**
   * 📋 Demander une URL SAS au backend
   * POST /api/medias
   * @internal - Utilisé par uploadImage()
   */
  async requestUploadUrl(dto: RequestUploadUrlDto): Promise<MediaUploadResponse> {
    return apiFetch<MediaUploadResponse>(
      API_ENDPOINTS.medias.requestUpload,
      {
        method: 'POST',
        data: dto
      }
    );
  },


  /**
   * ✅ Confirmer l'upload d'un média
   * PUT /api/medias/{id}/confirm
   * 
   * @internal - Utilisé par uploadImage()
   */
  async confirmUpload(mediaId: string): Promise<MediaConfirmResponse> {
    return apiFetch<MediaConfirmResponse>(
      API_ENDPOINTS.medias.confirm(mediaId),
      {
        method: 'PUT'
      }
    );
  },



  /**
   * ☁️ Uploader vers Azure Blob Storage
   * 
   * @internal - Utilisé par uploadImage()
   */
  async uploadToAzure(
    sasUrl: string,
    file: File | Blob,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    // XMLHttpRequest pour avoir onProgress
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Suivi de progression
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const percentComplete = 30 + Math.round((event.loaded / event.total) * 60);
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Erreur Azure: ${xhr.status} ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Erreur réseau lors de l\'upload'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload annulé'));
      });

      // ⚠️ IMPORTANT : Azure Blob nécessite PUT avec Content-Type
      xhr.open('PUT', sasUrl);
      xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
      xhr.setRequestHeader('Content-Type', file.type || 'image/jpeg');

      xhr.send(file);
    });
  },

  /**
   * ✅ Valider le fichier image
   * 
   * @internal
   */
  validateImageFile(file: File | Blob): void {
    // Vérifier le type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error(
        'Format d\'image non supporté. Utilisez JPG, PNG ou WebP.'
      );
    }

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      throw new Error(
        'L\'image est trop volumineuse. Taille maximum : 5 MB.'
      );
    }
  }
};



/**
 * 📸 Récupérer l'image par défaut pour les clients Physical
 * 
 * Image située dans /public/assets/images/mock/user/user.png
 * Cette fonction charge l'image locale et la convertit en File
 * 
 * @returns File - L'image par défaut prête à être uploadée
 * 
 * @example
 * const defaultImage = await fetchDefaultUserImage();
 * const result = await mediaService.uploadImage({ file: defaultImage });
 */
export async function fetchDefaultUserImage(): Promise<File> {
  try {
    const imagePath = '/assets/images/mock/user/user.png';

    // Fetch natif pour charger une ressource locale (pas besoin d'apiFetch)
    const response = await fetch(imagePath);

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const blob = await response.blob();
    return new File([blob], 'default-user.png', { type: 'image/png' });
  } catch (error) {
    console.error('Erreur chargement image par défaut:', error);
    throw new Error('Impossible de charger l\'image par défaut');
  }
}