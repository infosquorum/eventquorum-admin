import { _mock } from 'src/_mock';

// To get the user from the <AuthContext/>, you can use

// Change:
// import { useMockedUser } from 'src/auth/hooks';
// const { user } = useMockedUser();

// To:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------

export function useMockedUser() {
  const user = {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    displayName: 'Jaydon Frankie',
    email: 'demo@minimals.cc',
    photoURL: _mock.image.avatar(24),
    phoneNumber: _mock.phoneNumber(1),
    country: _mock.countryNames(1),
    address: '90210 Broadway Blvd',
    state: 'California',
    city: 'San Francisco',
    zipCode: '94116',
    about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
    role: 'admin',
    isPublic: true,
  };

  return { user };
}

// Hook spécifique pour les superviseurs
export function useMockedSuperviseur() {
  const superviseur = {
    id: '8864c717-587d-472a-929a-8e5f298024da-1',
    displayName: 'Chonou Seka',
    email: 'demo@minimals.cc',
    photoURL: _mock.image.avatar(12),
    phoneNumber: _mock.phoneNumber(2),
    country: 'Côte d\'Ivoire',
    address: 'Cocody, Abidjan',
    state: 'Abidjan',
    city: 'Abidjan',
    zipCode: '00225',
    about: 'Superviseur d\'événements passionnée par l\'organisation et la gestion d\'activités.',
    role: 'superviseur',
    isPublic: true,
    // Informations spécifiques au superviseur
    eventId: 'event-2024-tech-summit',
    eventName: 'Tech Summit Abidjan 2024',
    eventDescription: 'Conférence technologique annuelle regroupant les acteurs du numérique en Côte d\'Ivoire',
    eventDates: {
      start: '2024-06-15',
      end: '2024-06-17'
    },
    // Statistiques de l'événement
    stats: {
      demandesInscription: 128,
      invites: 86,
      participants: 64,
      activitesTotales: 12,
      activitesPayantes: 6,
      montantRecu: 1850000,
      enquetesTotales: 10,
      enquetesRealisees: 5
    }
  };

  return { superviseur };
}

// Hook générique qui retourne l'utilisateur selon le contexte
export function useCurrentUser() {
  // Ici vous pourriez ajouter la logique pour déterminer
  // quel type d'utilisateur est connecté (admin, superviseur, etc.)
  const userType = 'superviseur'; // À adapter selon votre logique d'authentification
  
  if (userType === 'superviseur') {
    return useMockedSuperviseur();
  }
  
  return useMockedUser();
}