// src/_mock/_superviseurInvites.ts

/**
 * Données mockées pour les invités du superviseur
 * À remplacer par des appels API en production
 */

import type { SuperviseurParticipant } from 'src/sections/superviseur/participants/types';
import type { SuperviseurParticipantDetail } from 'src/sections/superviseur/participants/detail/types';

/**
 * Signature mockée (image 1x1 pixel transparent en base64)
 */
const MOCK_SIGNATURE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

/**
 * Mapping des activités (code -> label)
 */
const ACTIVITIES_MAP: Record<string, string> = {
  conference: 'Conférence principale',
  workshop: 'Atelier pratique',
  networking: 'Session networking',
  cocktail: 'Cocktail de clôture',
};

/**
 * Liste complète des invités mockés
 */
export const _superviseurInvitesList: SuperviseurParticipant[] = [
  {
    id: 1,
    nom: 'Koffi',
    prenom: 'Emmanuel',
    telephone: '0101010101',
    email: 'koffi@gmail.com',
    connecte: true,
    emargement: MOCK_SIGNATURE,
    activite: 'conference',
    typeConnexion: 'en ligne',
  },
  {
    id: 2,
    nom: 'Kouassi',
    prenom: 'Marie',
    telephone: '0202020202',
    email: 'marie@gmail.com',
    connecte: false,
    emargement: null,
    activite: 'workshop',
    typeConnexion: 'en présentiel',
  },
  {
    id: 3,
    nom: 'Ouattara',
    prenom: 'Jean',
    telephone: '0303030303',
    email: 'jean@gmail.com',
    connecte: true,
    emargement: MOCK_SIGNATURE,
    activite: 'networking',
    typeConnexion: 'en ligne',
  },
  {
    id: 4,
    nom: 'Traore',
    prenom: 'Fatou',
    telephone: '0404040404',
    email: 'fatou@gmail.com',
    connecte: false,
    emargement: null,
    activite: 'cocktail',
    typeConnexion: 'en présentiel',
  },
  {
    id: 5,
    nom: 'Bamba',
    prenom: 'Sekou',
    telephone: '0505050505',
    email: 'sekou@gmail.com',
    connecte: true,
    emargement: MOCK_SIGNATURE,
    activite: 'conference',
    typeConnexion: 'en ligne',
  },
  {
    id: 6,
    nom: 'Diallo',
    prenom: 'Aminata',
    telephone: '0606060606',
    email: 'aminata@gmail.com',
    connecte: false,
    emargement: null,
    activite: 'workshop',
    typeConnexion: 'en présentiel',
  },
  {
    id: 7,
    nom: 'Coulibaly',
    prenom: 'Ibrahim',
    telephone: '0707070707',
    email: 'ibrahim@gmail.com',
    connecte: true,
    emargement: MOCK_SIGNATURE,
    activite: 'networking',
    typeConnexion: 'en ligne',
  },
  {
    id: 8,
    nom: 'Yao',
    prenom: 'Adjoua',
    telephone: '0808080808',
    email: 'adjoua@gmail.com',
    connecte: true,
    emargement: null,
    activite: 'conference',
    typeConnexion: 'en présentiel',
  },
  {
    id: 9,
    nom: 'N\'Guessan',
    prenom: 'Patrick',
    telephone: '0909090909',
    email: 'patrick@gmail.com',
    connecte: false,
    emargement: null,
    activite: 'cocktail',
    typeConnexion: 'en ligne',
  },
  {
    id: 10,
    nom: 'Kone',
    prenom: 'Mariam',
    telephone: '1010101010',
    email: 'mariam@gmail.com',
    connecte: true,
    emargement: MOCK_SIGNATURE,
    activite: 'workshop',
    typeConnexion: 'en présentiel',
  },
  {
    id: 11,
    nom: 'Chonou',
    prenom: 'Oriane',
    telephone: '0701010101',
    email: 'oriane@gmail.com',
    connecte: true,
    emargement: MOCK_SIGNATURE,
    activite: 'cocktail',
    typeConnexion: 'en présentiel',
    checking: true,
  },
  {
    id: 12,
    nom: 'Akissi',
    prenom: 'Aya',
    telephone: '0712121212',
    email: 'aya@gmail.com',
    connecte: true,
    emargement: MOCK_SIGNATURE,
    activite: 'conference',
    typeConnexion: 'en présentiel',
    checking: true,
  },
  {
    id: 13,
    nom: 'Konan',
    prenom: 'Yves',
    telephone: '0713131313',
    email: 'yves@gmail.com',
    connecte: false,
    emargement: null,
    activite: 'workshop',
    typeConnexion: 'en ligne',
  },
  {
    id: 14,
    nom: 'Ble',
    prenom: 'Nadege',
    telephone: '0714141414',
    email: 'nadege@gmail.com',
    connecte: true,
    emargement: MOCK_SIGNATURE,
    activite: 'networking',
    typeConnexion: 'en présentiel',
    checking: false,
  },
  {
    id: 15,
    nom: 'Soro',
    prenom: 'Karim',
    telephone: '0715151515',
    email: 'karim@gmail.com',
    connecte: true,
    emargement: null,
    activite: 'cocktail',
    typeConnexion: 'en ligne',
  },
];

/**
 * Fonction pour obtenir les détails complets d'un invité par ID
 */
export const getSuperviseurInviteById = (id: number): SuperviseurParticipantDetail | undefined => {
  const invite = _superviseurInvitesList.find((i) => i.id === id);

  if (!invite) return undefined;

  // Générer des dates aléatoires pour la demo
  const datePremiereConnexion = invite.connecte
    ? new Date(2024, 0, 15 + id, 9, 30, 0).toISOString()
    : undefined;

  const dateDerniereConnexion = invite.connecte
    ? new Date(2024, 0, 20 + id, 14, 45, 0).toISOString()
    : undefined;

  // Générer une liste d'activités pour chaque invité
  const activites: string[] = [ACTIVITIES_MAP[invite.activite]];

  // Ajouter aléatoirement d'autres activités
  if (id % 3 === 0) activites.push(ACTIVITIES_MAP.workshop);
  if (id % 4 === 0) activites.push(ACTIVITIES_MAP.networking);
  if (id % 5 === 0) activites.push(ACTIVITIES_MAP.cocktail);

  return {
    ...invite,
    activites,
    datePremiereConnexion,
    dateDerniereConnexion,
  };
};

/**
 * Fonction utilitaire pour obtenir des invités filtrés
 */
export const getFilteredInvites = (filters?: {
  activite?: string;
  connecte?: boolean;
  typeConnexion?: 'en ligne' | 'en présentiel';
  emarge?: boolean;
  checking?: boolean;
}): SuperviseurParticipant[] => {
  let filtered = [..._superviseurInvitesList];

  if (filters?.activite) {
    filtered = filtered.filter(invite => invite.activite === filters.activite);
  }

  if (filters?.connecte !== undefined) {
    filtered = filtered.filter(invite => invite.connecte === filters.connecte);
  }

  if (filters?.typeConnexion) {
    filtered = filtered.filter(invite => invite.typeConnexion === filters.typeConnexion);
  }

  if (filters?.emarge !== undefined) {
    filtered = filtered.filter(invite =>
      filters.emarge ? invite.emargement !== null : invite.emargement === null
    );
  }

  if (filters?.checking !== undefined) {
    filtered = filtered.filter(invite => invite.checking === filters.checking);
  }

  return filtered;
};

/**
 * Fonction utilitaire pour obtenir les statistiques
 */
export const getInvitesStatistics = () => {
  const total = _superviseurInvitesList.length;
  const connectes = _superviseurInvitesList.filter(i => i.connecte).length;
  const emarges = _superviseurInvitesList.filter(i => i.emargement !== null).length;
  const checked = _superviseurInvitesList.filter(i => i.checking === true).length;
  const enLigne = _superviseurInvitesList.filter(i => i.typeConnexion === 'en ligne').length;
  const enPresentiel = _superviseurInvitesList.filter(i => i.typeConnexion === 'en présentiel').length;

  return {
    total,
    connectes,
    nonConnectes: total - connectes,
    emarges,
    nonEmarges: total - emarges,
    checked,
    nonChecked: enPresentiel - checked,
    enLigne,
    enPresentiel,
  };
};

/**
 * Fonction utilitaire pour rechercher des invités
 */
export const searchInvites = (searchTerm: string): SuperviseurParticipant[] => {
  const term = searchTerm.toLowerCase();
  return _superviseurInvitesList.filter(
    invite =>
      invite.nom.toLowerCase().includes(term) ||
      invite.prenom.toLowerCase().includes(term) ||
      invite.email.toLowerCase().includes(term) ||
      invite.telephone.includes(term)
  );
};