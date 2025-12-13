// src/_mock/_participants.ts
import type { IParticipantItem } from 'src/types/participant';

export const _participantList: IParticipantItem[] = [
  // ========== DEMANDES D'INSCRIPTION ==========
  // Statut: acceptée
  {
    id: '1',
    nom_prenom: 'Boudou Kouacou',
    email: 'boudou.kouacou@gmail.com',
    telephone: '0703815841',
    date: '10/06/2024 10:00',
    statut: 'acceptée'
  },
  {
    id: '2',
    nom_prenom: 'Marie Dupont',
    email: 'marie.dupont@gmail.com',
    telephone: '0712345678',
    date: '11/06/2024 14:30',
    statut: 'acceptée'
  },
  
  // Statut: rejetée
  {
    id: '3',
    nom_prenom: 'Jean Martin',
    email: 'jean.martin@outlook.com',
    telephone: '0698765432',
    date: '09/06/2024 09:15',
    statut: 'rejetée'
  },
  {
    id: '4',
    nom_prenom: 'Sophie Legrand',
    email: 'sophie.legrand@yahoo.fr',
    telephone: '0687654321',
    date: '08/06/2024 16:45',
    statut: 'rejetée'
  },
  
  // Statut: en attente
  {
    id: '5',
    nom_prenom: 'Pierre Dubois',
    email: 'pierre.dubois@hotmail.com',
    telephone: '0776543210',
    date: '12/06/2024 11:20',
    statut: 'en attente'
  },
  {
    id: '6',
    nom_prenom: 'Lucie Bernard',
    email: 'lucie.bernard@gmail.com',
    telephone: '0765432109',
    date: '13/06/2024 08:30',
    statut: 'en attente'
  },

  // ========== INVITÉS (demandes acceptées avec infos supplémentaires) ==========
  {
    id: '7',
    nom_prenom: 'Claude Moreau',
    email: 'claude.moreau@gmail.com',
    telephone: '0754321098',
    date: '05/06/2024 13:45',
    statut: 'acceptée',
    connecte: 'connecté',
    premiere_connexion: 'oui',
    activite_selectionnee: 'activité 1',
    achat_effectue: 'oui'
  },
  {
    id: '8',
    nom_prenom: 'Amélie Rousseau',
    email: 'amelie.rousseau@gmail.com',
    telephone: '0743210987',
    date: '04/06/2024 15:20',
    statut: 'acceptée',
    connecte: 'connecté',
    premiere_connexion: 'oui',
    activite_selectionnee: 'activité 2',
    achat_effectue: 'non'
  },
  {
    id: '9',
    nom_prenom: 'Thomas Leroy',
    email: 'thomas.leroy@outlook.com',
    telephone: '0732109876',
    date: '03/06/2024 10:15',
    statut: 'acceptée',
    connecte: 'non connecté',
    premiere_connexion: 'non',
    activite_selectionnee: '',
    achat_effectue: 'non'
  },
  {
    id: '10',
    nom_prenom: 'Isabelle Petit',
    email: 'isabelle.petit@gmail.com',
    telephone: '0721098765',
    date: '02/06/2024 12:30',
    statut: 'acceptée',
    connecte: 'connecté',
    premiere_connexion: 'non',
    activite_selectionnee: 'activité 1',
    achat_effectue: 'oui'
  },
  {
    id: '11',
    nom_prenom: 'Nicolas Roux',
    email: 'nicolas.roux@yahoo.fr',
    telephone: '0710987654',
    date: '01/06/2024 09:45',
    statut: 'acceptée',
    connecte: 'non connecté',
    premiere_connexion: 'non',
    activite_selectionnee: 'activité 2',
    achat_effectue: 'non'
  },

  // ========== PARTICIPANTS (personnes qui participent effectivement) ==========
  // Statut: en présentiel
  {
    id: '12',
    nom: 'Boudou',
    prenom: 'EVARIST',
    nom_prenom: 'Boudou EVARIST',
    email: 'pp@gmail.com',
    telephone: '0702205752',
    date: '28/05/2024 08:00',
    statut: 'en présentiel',
    connecte: 'connecté',
    premiere_connexion: 'oui',
    activite_selectionnee: 'activité 1',
    achat_effectue: 'oui',
    emargement: 'signé'
  },
  {
    id: '13',
    nom: 'Kouassi',
    prenom: 'EVARIST',
    nom_prenom: 'Kouassi EVARIST',
    email: 'kouassi.evarist@gmail.com',
    telephone: '0702205752',
    date: '27/05/2024 08:15',
    statut: 'en présentiel',
    connecte: 'connecté',
    premiere_connexion: 'oui',
    activite_selectionnee: 'activité 1',
    achat_effectue: 'oui',
    emargement: 'signé'
  },
  {
    id: '14',
    nom: 'Ouédraogo',
    prenom: 'PTT',
    nom_prenom: 'Ouédraogo PTT',
    email: 'ouedraogo.ptt@gmail.com',
    telephone: '0702205752',
    date: '26/05/2024 08:30',
    statut: 'en présentiel',
    connecte: 'connecté',
    premiere_connexion: 'oui',
    activite_selectionnee: 'activité 2',
    achat_effectue: 'oui',
    emargement: 'non signé'
  },

  // Statut: en ligne
  {
    id: '15',
    nom: 'Koffi',
    prenom: 'EVARIST',
    nom_prenom: 'Koffi EVARIST',
    email: 'koffi.evarist@gmail.com',
    telephone: '0102205752',
    date: '25/05/2024 09:00',
    statut: 'en ligne',
    connecte: 'connecté',
    premiere_connexion: 'oui',
    activite_selectionnee: 'activité 1',
    achat_effectue: 'oui',
    emargement: 'non signé'
  },
  {
    id: '16',
    nom: 'Kouassi',
    prenom: 'EVARIST',
    nom_prenom: 'Kouassi EVARIST',
    email: 'kouassi2@gmail.com',
    telephone: '0102205752',
    date: '24/05/2024 09:15',
    statut: 'en ligne',
    connecte: 'connecté',
    premiere_connexion: 'oui',
    activite_selectionnee: 'activité 2',
    achat_effectue: 'non',
    emargement: 'non signé'
  },
  {
    id: '17',
    nom: 'Ouédraogo',
    prenom: 'PTT',
    nom_prenom: 'Ouédraogo PTT',
    email: 'ouedraogo2@gmail.com',
    telephone: '0102205752',
    date: '23/05/2024 09:30',
    statut: 'en ligne',
    connecte: 'connecté',
    premiere_connexion: 'oui',
    activite_selectionnee: 'activité 1',
    achat_effectue: 'oui',
    emargement: 'signé'
  },

  // ========== DONNÉES SUPPLÉMENTAIRES POUR TESTS ==========
  {
    id: '18',
    nom_prenom: 'Alice Moreau',
    email: 'alice.moreau@gmail.com',
    telephone: '0623456789',
    date: '20/06/2024 14:00',
    statut: 'en attente'
  },
  {
    id: '19',
    nom_prenom: 'Robert Durand',
    email: 'robert.durand@gmail.com',
    telephone: '0634567890',
    date: '19/06/2024 11:30',
    statut: 'rejetée'
  },
  {
    id: '20',
    nom_prenom: 'Emma Lefebvre',
    email: 'emma.lefebvre@gmail.com',
    telephone: '0645678901',
    date: '18/06/2024 16:15',
    statut: 'acceptée',
    connecte: 'connecté',
    premiere_connexion: 'oui',
    activite_selectionnee: 'activité 2',
    achat_effectue: 'oui'
  }
];