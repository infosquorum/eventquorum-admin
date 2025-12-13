// src/lib/medias/types.ts

/**
 * Types pour la gestion des médias (images, vidéos, documents)
 * Stockage sur Azure Blob Storage avec confirmation
 */

/**
 * Type de média
 */
export type MediaType = 'Images' | 'Videos' | 'Documents';

/**
 * Dossier de stockage
 */
export type MediaFolder = 'Customers' | 'Events';

/**
 * Réponse du backend après POST /api/medias
 * Fournit l'URL SAS pour uploader
 */
export interface MediaUploadResponse {
  /**
   * ID du média (UUID)
   * À utiliser pour confirmer l'upload ET dans les DTO Create/Update
   */
  id: string;
  
  /**
   * URL SAS Azure Blob pour uploader le fichier
   * Valide temporairement (quelques heures)
   */
  url: string;
  
  /**
   * Date d'expiration de l'URL SAS (ISO 8601)
   */
  expiresAt: string;
}

/**
 * Paramètres pour demander une URL d'upload
 * POST /api/medias
 */
export interface RequestUploadUrlDto {
  /**
   * Nom du fichier (ex: "photo.jpg")
   */
  fileName: string;
  
  /**
   * Type MIME (ex: "image/jpeg", "image/png")
   */
  contentType: string;
  
  /**
   * Dossier de destination
   */
  folder: MediaFolder;
  
  /**
   * Type de média
   */
  type: MediaType;
}

/**
 * Réponse après confirmation d'upload
 * PUT /api/medias/{id}/confirm
 */
export interface MediaConfirmResponse {
  /**
   * ID du média confirmé
   */
  resourceId: string; // ✅ Le backend retourne resourceId, pas id
  
}

/**
 * Résultat d'un upload complet (avec confirmation)
 */
export interface UploadResult {
  /**
   * ID du média à envoyer au backend dans les DTO
   * (remplace l'ancien blobName)
   */
  mediaId: string;
  
  /**
   * URL permanente du média (pour affichage)
   */
  mediaUrl: string;
}

/**
 * Options pour l'upload d'image
 */
export interface UploadImageOptions {
  /**
   * Fichier à uploader (File ou Blob)
   */
  file: File | Blob;
  
  /**
   * Dossier de destination
   * @default 'Customer'
   */
  folder?: MediaFolder;
  
  /**
   * Callback de progression (0-100)
   */
  onProgress?: (progress: number) => void;
}