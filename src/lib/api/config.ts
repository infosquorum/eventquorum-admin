// src/lib/api/config.ts

/**
 * Configuration centrale de l'API backend .NET
 */
export const API_CONFIG = {
  /**
   * URL de base du backend .NET
   * En développement : http://localhost:5000
   * En production : URL de votre serveur Azure
   */
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',

  /** URL de base Azure Blob Storage pour les médias */
  BLOB_BASE_URL: 'https://ststagingfrceventquorum.blob.core.windows.net/medias',

  /**
   * Timeout pour les requêtes (30 secondes)
   */
  TIMEOUT: 30000, // ✅ Aussi en majuscules pour cohérence
} as const;