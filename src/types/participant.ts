// src/types/participant.ts


export interface IParticipantItem {
  id: string;
  nom_prenom: string;
  email: string;
  telephone: string;
  date: string;
  statut: 'acceptée' | 'rejetée' | 'en attente' | 'en présentiel' | 'en ligne';
  
  // Propriétés additionnelles pour les invités et participants
  connecte?: 'connecté' | 'non connecté';
  premiere_connexion?: 'oui' | 'non';
  activite_selectionnee?: 'activité 1' | 'activité 2' | '';
  achat_effectue?: 'oui' | 'non';
  emargement?: 'signé' | 'non signé';
  
  // Propriétés séparées pour les participants (si nécessaire)
  nom?: string;
  prenom?: string;
}

export interface IParticipantTableFilters {
  name: string;
  status: string;
  
  // Filtres additionnels pour les différents onglets
  activity?: string;
  connectionStatus?: string;
  purchaseStatus?: string;
  
  // Autres filtres possibles
  emargementStatus?: string;
}