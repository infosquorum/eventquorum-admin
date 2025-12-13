'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { PasswordIcon } from 'src/assets/icons';

import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../../../components/form-head';
import { FormReturnLink } from '../../../components/form-return-link';

// ----------------------------------------------------------------------
// SCHÉMA DE VALIDATION ZOD
// Valide que l'utilisateur entre soit un email valide, soit un numéro de téléphone
// ----------------------------------------------------------------------

export type ForgotPasswordSchemaType = zod.infer<typeof ForgotPasswordSchema>;

export const ForgotPasswordSchema = zod.object({
  emailOrPhone: zod
    .string()
    .min(1, { message: 'Email ou numéro de téléphone requis!' })
    .refine(
      (value) => {
        // Valide si c'est un email valide OU un numéro de téléphone (10 chiffres)
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const isPhone = /^[0-9]{10}$/.test(value);
        return isEmail || isPhone;
      },
      {
        message: 'Veuillez entrer un email valide ou un numéro de téléphone à 10 chiffres',
      }
    ),
});

// ----------------------------------------------------------------------
// COMPOSANT: ÉTAPE 1 - DEMANDE DE RÉINITIALISATION
// Permet à l'utilisateur d'entrer son email ou numéro pour recevoir un code OTP
// ----------------------------------------------------------------------

export function ForgotPasswordView() {
  const router = useRouter();
  const [error, setError] = useState<string>('');

  // Valeurs par défaut pour le formulaire
  const defaultValues: ForgotPasswordSchemaType = {
    emailOrPhone: '',
  };

  // Configuration de react-hook-form avec validation Zod
  const methods = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // ----------------------------------------------------------------------
  // LOGIQUE DE SOUMISSION
  // En production, cette fonction appellera l'API backend
  // Pour le moment, elle simule l'envoi avec les données de test
  // ----------------------------------------------------------------------

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError('');

      // Simulation d'un délai réseau
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // ----------------------------------------------------------------------
      // VALIDATION TEMPORAIRE (À REMPLACER PAR L'API)
      // Vérifie si l'email/numéro correspond aux données de test
      // ----------------------------------------------------------------------

      const validEmail = 'demo@qurumevent.com';
      const validPhone = '0789560751';

      if (data.emailOrPhone !== validEmail && data.emailOrPhone !== validPhone) {
        setError('Aucun compte trouvé avec cet email ou numéro de téléphone.');
        return;
      }

      // ----------------------------------------------------------------------
      // STOCKAGE TEMPORAIRE
      // Sauvegarde l'email/numéro dans sessionStorage pour les étapes suivantes
      // Utilise sessionStorage (et non localStorage) pour plus de sécurité
      // ----------------------------------------------------------------------

      sessionStorage.setItem('reset_identifier', data.emailOrPhone);

      console.info('Code OTP envoyé à:', data.emailOrPhone);

      // Redirection vers l'étape 2 (vérification OTP)
      router.push(paths.auth.jwt.verifyOtp);
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  });

  // ----------------------------------------------------------------------
  // RENDU DU FORMULAIRE
  // ----------------------------------------------------------------------

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      {/* Affichage des erreurs */}
      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Champ de saisie email ou numéro */}
      <Field.Text
        autoFocus
        name="emailOrPhone"
        label="Email ou numéro de téléphone"
        placeholder="demo@qurumevent.com ou 0789560751"
        slotProps={{ 
          inputLabel: { shrink: true },
          htmlInput: {
            autoComplete: 'username' // Améliore l'expérience utilisateur
          }
        }}
        // helperText="Entrez l'email ou le numéro associé à votre compte"
      />

      {/* Bouton de soumission */}
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Envoi en cours..."
      >
        Envoyer le code de vérification
      </LoadingButton>
    </Box>
  );

  return (
    <>
      {/* En-tête du formulaire */}
      <FormHead
        icon={<PasswordIcon />}
        title="Mot de passe oublié ?"
        description="Entrez l'email ou le numéro de téléphone associé à votre compte. Nous vous enverrons un code de vérification pour réinitialiser votre mot de passe."
      />

      {/* Formulaire */}
      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      {/* Lien de retour vers la connexion */}
      <FormReturnLink href={paths.auth.jwt.signIn} />
    </>
  );
}

// ----------------------------------------------------------------------
// INSTRUCTIONS POUR LA CONNEXION BACKEND
// ----------------------------------------------------------------------

/*
ÉTAPE 1 : CONNEXION AVEC L'API BACKEND

1. Remplacer la section "VALIDATION TEMPORAIRE" par un appel API :

const onSubmit = handleSubmit(async (data) => {
  try {
    setError('');
    
    // Appel à l'API backend pour demander un code OTP
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: data.emailOrPhone // Email ou numéro
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de l\'envoi');
    }

    const result = await response.json();
    
    // Sauvegarder l'identifiant pour les étapes suivantes
    sessionStorage.setItem('reset_identifier', data.emailOrPhone);
    
    // Optionnel: sauvegarder un token temporaire si le backend en fournit un
    if (result.resetToken) {
      sessionStorage.setItem('reset_token', result.resetToken);
    }

    // Redirection vers l'étape de vérification OTP
    router.push(paths.auth.jwt.verifyOtp);
    
  } catch (error) {
    console.error('Erreur:', error);
    setError(error.message || 'Une erreur est survenue');
  }
});

2. L'API backend doit :
   - Vérifier si l'email/numéro existe dans la base de données
   - Générer un code OTP aléatoire (6 chiffres)
   - Stocker le code avec une expiration (5-10 minutes)
   - Envoyer le code par email ou SMS
   - Retourner un succès (et optionnellement un token temporaire)

3. Format de réponse API attendu :
{
  "success": true,
  "message": "Code envoyé avec succès",
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Optionnel
}

4. Gestion des erreurs API :
{
  "success": false,
  "message": "Aucun compte trouvé avec cet identifiant"
}
*/