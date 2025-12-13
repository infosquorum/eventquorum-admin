export * from './split-verify-view';

export * from './split-sign-in-view';

export * from './split-sign-up-view';

export * from './split-reset-password-view';

export * from './split-update-password-view';

// ----------------------------------------------------------------------
// FICHIER: src/auth/view/auth-demo/split/index.ts
// Ce fichier centralise l'export de toutes les vues d'authentification
// Facilite l'importation dans les pages Next.js
// ----------------------------------------------------------------------

// 🔐 Vues de réinitialisation de mot de passe
export { ForgotPasswordView } from './forgot-password-view';
export { VerifyOtpView } from './verify-otp-view';
export { NewPasswordView } from './new-password-view';

// 📝 Types exportés (optionnel, utile pour TypeScript)
export type { ForgotPasswordSchemaType } from './forgot-password-view';
export type { VerifyOtpSchemaType } from './verify-otp-view';
export type { NewPasswordSchemaType } from './new-password-view';

// ----------------------------------------------------------------------
// UTILISATION DANS LES PAGES
// ----------------------------------------------------------------------

/*
Exemple d'import dans une page Next.js :

// ✅ Import groupé (recommandé)
import { ForgotPasswordView } from 'src/auth/view/auth-demo/split';

// ✅ Import multiple
import { 
  ForgotPasswordView, 
  VerifyOtpView, 
  NewPasswordView 
} from 'src/auth/view/auth-demo/split';

// ❌ À éviter (imports individuels redondants)
import { ForgotPasswordView } from 'src/auth/view/auth-demo/split/forgot-password-view';
import { VerifyOtpView } from 'src/auth/view/auth-demo/split/verify-otp-view';
*/

// ----------------------------------------------------------------------
// STRUCTURE COMPLÈTE DES FICHIERS
// ----------------------------------------------------------------------

/*
src/auth/view/auth-demo/split/
├── index.ts                      ← Ce fichier (exports centralisés)
├── forgot-password-view.tsx      ← Étape 1 : Demande de réinitialisation
├── verify-otp-view.tsx           ← Étape 2 : Vérification OTP
└── new-password-view.tsx         ← Étape 3 : Nouveau mot de passe

Note: Les autres vues d'authentification existantes restent inchangées :
├── split-sign-in-view.tsx        ← Connexion (existant)
├── split-sign-up-view.tsx        ← Inscription (existant)
└── ...
*/