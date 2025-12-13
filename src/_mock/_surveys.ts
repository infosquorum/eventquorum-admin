// src/_mock/_surveys.ts

import { ISurveyItem } from 'src/types/survey';

export const _surveyList: ISurveyItem[] = [
  {
    id: '1',
    titre_enquete: 'Satisfaction',
    date: '10/09/2024 10h00',
    date_expiration: '11/09/2024 10h00',
    statut: 'En cours',
    statut_participation: 'Participer',
    note: '----'
  },
  {
    id: '2', 
    titre_enquete: 'Evaluation',
    date: '10/09/2024 11h00',
    date_expiration: '11/09/2024 11h00',
    statut: 'Non démarré',
    statut_participation: 'Non participer',
    note: '7/10'
  },
  {
    id: '3',
    titre_enquete: 'Evaluation',
    date: '12/05/2023 à 08h00',
    date_expiration: '13/05/2023 à 08h00',
    statut: 'Terminé',
    statut_participation: 'Participer',
    note: '10/10'
  },
  {
    id: '4',
    titre_enquete: 'Evaluation',
    date: '12/05/2023 à 08h00',
    date_expiration: '13/05/2023 à 08h00',
    statut: 'Non démarré',
    statut_participation: 'Non participer',
    note: '00'
  }
];

// Stats basées sur les données
export const getSurveyStats = (): {
  nombre_enquetes: number;
  nombre_enquetes_expirees: number;
  nombre_enquetes_en_cours: number;
  nombre_enquetes_non_demarrees: number;
} => {
  const total = _surveyList.length;
  const enCours = _surveyList.filter(s => s.statut === 'En cours').length;
  const nonDemarrees = _surveyList.filter(s => s.statut === 'Non démarré').length;
  const terminees = _surveyList.filter(s => s.statut === 'Terminé').length;

  return {
    nombre_enquetes: total,
    nombre_enquetes_expirees: terminees,
    nombre_enquetes_en_cours: enCours,
    nombre_enquetes_non_demarrees: nonDemarrees
  };
};