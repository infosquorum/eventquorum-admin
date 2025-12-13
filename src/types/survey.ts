// src/types/survey.ts

export interface ISurveyItem {
  id: string;
  titre_enquete: string;
  date: string;
  date_expiration: string;
  statut: 'En cours' | 'Non démarré' | 'Terminé';
  statut_participation: 'Participer' | 'Non participer';
  note: string;
}

export interface ISurveyStats {
  nombre_enquetes: number;
  nombre_enquetes_expirees: number;
  nombre_enquetes_en_cours: number;
  nombre_enquetes_non_demarrees: number;
}

export interface ISurveyTableFilters {
  name: string;
  status: string;
  participationStatus: string;
}