//src/routes/paths.ts

import { tr } from 'date-fns/locale';
import { kebabCase } from 'es-toolkit';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

export const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  ORGANISATEUR: '/organisateur',
  SUPERVISEUR: '/superviseur',
  INTERVENANT: '/intervenant',
  GUICHET: '/guichet',
  OPERATEUR: '/operateur',
  PARTICIPANT: '/participant',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneStore: 'https://mui.com/store/items/zone-landing-page/',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figmaUrl: 'https://www.figma.com/design/cAPz4pYPtQEXivqe11EcDE/%5BPreview%5D-Minimal-Web.v6.0.0',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id: string) => `/product/${id}`,
    demo: { details: `/product/${MOCK_ID}` },
  },
  post: {
    root: `/post`,
    details: (title: string) => `/post/${kebabCase(title)}`,
    demo: { details: `/post/${kebabCase(MOCK_TITLE)}` },
  },
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
      // Routes de réinitialisation
      forgotPassword: '/auth-demo/split/forgot-password',
      verifyOtp: '/auth-demo/split/verify-otp',
      newPassword: '/auth-demo/split/new-password',
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: { signIn: `${ROOTS.AUTH}/auth0/sign-in` },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  authDemo: {
    split: {
      signIn: `${ROOTS.AUTH_DEMO}/split/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/split/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/split/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/split/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/split/verify`,
    },
    centered: {
      signIn: `${ROOTS.AUTH_DEMO}/centered/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/centered/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/centered/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/centered/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/centered/verify`,
    },
  },
  // ADMIN
  admin: {
    root: ROOTS.ADMIN,
    GESTION_CLIENT: {
      root: `${ROOTS.ADMIN}/gestionclient`,
      new: `${ROOTS.ADMIN}/gestionclient/new`,
      ficheclient: (id: string) => `${ROOTS.ADMIN}/gestionclient/ficheclient/${id}`,
      cards: `${ROOTS.ADMIN}/user/cards`,
      profile: `${ROOTS.ADMIN}/user/profile`,
      account: `${ROOTS.ADMIN}/user/account`,
      edit: (id: string) => `${ROOTS.ADMIN}/gestionclient/${id}/edit`,
      demo: { edit: `${ROOTS.ADMIN}/user/${MOCK_ID}/edit` },
    },
    PLANIFIER_UN_EVENEMENT: {
      root: `${ROOTS.ADMIN}/planifierevent`,
      newevent: `${ROOTS.ADMIN}/planifierevent/newevent`,
      neworganisateur: `${ROOTS.ADMIN}/planifierevent/neworganisateur`,
      type: `${ROOTS.ADMIN}/planifierevent/type`,
      detailevenement: (id: string) => `${ROOTS.ADMIN}/planifierevent/detailevenement/${id}`,
      edit: (id: string) => `${ROOTS.ADMIN}/planifierevent/${id}/edit`,
      detailorganisateur: (id: string) => `${ROOTS.ADMIN}/planifierevent/organisateur/${id}`,
    },
    PHOTOTHEQUE: {
      root: `${ROOTS.ADMIN}/phototheque`,
      detailevent: (name: string) => `${ROOTS.ADMIN}/phototheque/detailevent/${kebabCase(name)}`,
    }
  },

    // ESPACE PARTICIPANT
  participant: {
    root: ROOTS.PARTICIPANT,
    PROFILE: {
      root: `${ROOTS.PARTICIPANT}/profile`,
      accountSettings: `${ROOTS.PARTICIPANT}/profil/account-settings`,
      editProfile: `${ROOTS.PARTICIPANT}/profil/edit`,
    },
  },



  // ESPACE SUPERVISEUR
  superviseur: {
    root: ROOTS.SUPERVISEUR,
    accueil: `${ROOTS.SUPERVISEUR}/accueil`,
    PARTICIPANTS: {
      root: `${ROOTS.SUPERVISEUR}/participants`,
      demandes: `${ROOTS.SUPERVISEUR}/participants/demandes`,
      invites: `${ROOTS.SUPERVISEUR}/participants/invites`,
      listes: `${ROOTS.SUPERVISEUR}/participants/listes`,
    },
    ACTIVITES: {
      root: `${ROOTS.SUPERVISEUR}/activites`
    },
    ENQUETES: {
      root: `${ROOTS.SUPERVISEUR}/enquetes`,
    },
  },

  // ESPACE INTERVENANT
  intervenant: {
    root: ROOTS.INTERVENANT,
    ACTIVITES: {
      root: `${ROOTS.INTERVENANT}/activites`,
      detail: (id: string) => `${ROOTS.INTERVENANT}/activites/${id}`,
      edit: (id: string) => `${ROOTS.INTERVENANT}/activites/${id}/edit`,
    },
    ENQUETES: {
      root: `${ROOTS.INTERVENANT}/enquetes`,
      detail: (id: string) => `${ROOTS.INTERVENANT}/enquetes/${id}`,
      resultats: (id: string) => `${ROOTS.INTERVENANT}/enquetes/${id}/resultats`,
    },
  },
  // ESPACE ORGANISATEUR
  organisateur: {
    root: ROOTS.ORGANISATEUR,
    gestionevent: {
      root: `${ROOTS.ORGANISATEUR}/gestionevent`,
      newactivity: `${ROOTS.ORGANISATEUR}/gestionevent/newactivity`,
      eventfinancialsituation: {
        root: `${ROOTS.ORGANISATEUR}/gestionevent/eventfinancialsituation`,
        perboxoffice: (id: string) => `${ROOTS.ORGANISATEUR}/gestionevent/eventfinancialsituation/boxoffice/${id}`
      },
      edit: (id: string) => `${ROOTS.ORGANISATEUR}/gestionevent/${id}/editactivity`,

      // Nouvelles routes à ajouter
      
      financialSituationByCounter: `${ROOTS.ORGANISATEUR}/gestionevent/eventfinancialsituation/guichets`,
      activityPayments: `${ROOTS.ORGANISATEUR}/gestionevent/eventfinancialsituation/activite`,
      financialSituation : {
        root: `${ROOTS.ORGANISATEUR}/gestionevent/eventfinancialsituation`,
        participantTransactions: (id: number) => `${ROOTS.ORGANISATEUR}/gestionevent/eventfinancialsituation/guichets/participant-transactions/${id}`,
      },
      
      // Si vous voulez une fonction pour générer le chemin avec l'ID de l'activité
      activityPaymentDetail: (activityId: string) => 
        `${ROOTS.ORGANISATEUR}/gestionevent/eventfinancialsituation/activite/${activityId}`,
    },
    gestionparticipant: {
      root: `${ROOTS.ORGANISATEUR}/gestionparticipant`,
      add: `${ROOTS.ORGANISATEUR}/gestionparticipant/add-new`,
      edit: (id: string) => `${ROOTS.ORGANISATEUR}/gestionparticipant/edit/${id}`,
      consultation: `${ROOTS.ORGANISATEUR}/gestionparticipant/consultation`,
    },
    gestionhabilitations: {
      root: `${ROOTS.ORGANISATEUR}/gestionhabilitations`,
    },
    gestionenquete: {
      root: `${ROOTS.ORGANISATEUR}/gestionenquete`,
    },
  },

  // GUICHET
  guichet: {
    root: ROOTS.GUICHET,
    transactions: {
      root: `${ROOTS.GUICHET}/transactions`,
      new: `${ROOTS.GUICHET}/transactions/new`,
      detail: (id: string) => `${ROOTS.GUICHET}/transactions/${id}`,
    },
  },

  // OPERATEUR
  operateur: {
    root: ROOTS.OPERATEUR,
    ADMISSION_ENTREE: {
      root: `${ROOTS.OPERATEUR}/admission-entree`,
      scan: `${ROOTS.OPERATEUR}/admission-entree/scan`,
      liste: `${ROOTS.OPERATEUR}/admission-entree/liste`,
      participant: (id: string) => `${ROOTS.OPERATEUR}/admission-entree/participant/${id}`,
      recherche: `${ROOTS.OPERATEUR}/admission-entree/recherche`,
    },
    ADMISSION_ACTIVITE: {
      root: `${ROOTS.OPERATEUR}/admission-activite`,
      scan: `${ROOTS.OPERATEUR}/admission-activite/scan`,
      liste: `${ROOTS.OPERATEUR}/admission-activite/liste`,
      activite: (id: string) => `${ROOTS.OPERATEUR}/admission-activite/activite/${id}`,
      participant: (activityId: string, participantId: string) => `${ROOTS.OPERATEUR}/admission-activite/activite/${activityId}/participant/${participantId}`,
      recherche: `${ROOTS.OPERATEUR}/admission-activite/recherche`,
    }
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
      course: `${ROOTS.DASHBOARD}/course`,
    },

    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: { edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit` },
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title: string) => `${ROOTS.DASHBOARD}/post/${kebabCase(title)}`,
      edit: (title: string) => `${ROOTS.DASHBOARD}/post/${kebabCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${kebabCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${kebabCase(MOCK_TITLE)}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id: string) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: { details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}` },
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    },
  },


};
