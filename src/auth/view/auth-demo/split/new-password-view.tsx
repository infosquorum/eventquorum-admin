'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { SentIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../../../components/form-head';

// ----------------------------------------------------------------------
// SCHÉMA DE VALIDATION ZOD ROBUSTE
// Validation stricte avec vérification de force du mot de passe
// ----------------------------------------------------------------------

export type NewPasswordSchemaType = zod.infer<typeof NewPasswordSchema>;

export const NewPasswordSchema = zod
  .object({
    password: zod
      .string()
      .min(1, { message: 'Le mot de passe est requis!' })
      .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères!' })
      .regex(/[A-Z]/, { message: 'Le mot de passe doit contenir au moins une majuscule!' })
      .regex(/[a-z]/, { message: 'Le mot de passe doit contenir au moins une minuscule!' })
      .regex(/[0-9]/, { message: 'Le mot de passe doit contenir au moins un chiffre!' })
      .regex(/[@$!%*?&#]/, { 
        message: 'Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&#)!' 
      }),
    confirmPassword: zod
      .string()
      .min(1, { message: 'La confirmation du mot de passe est requise!' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas!',
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------
// INTERFACE: INDICATEUR DE FORCE DU MOT DE PASSE
// ----------------------------------------------------------------------

interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: 'error' | 'warning' | 'info' | 'success';
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

// ----------------------------------------------------------------------
// FONCTION: CALCULER LA FORCE DU MOT DE PASSE
// Évalue la robustesse du mot de passe selon plusieurs critères
// ----------------------------------------------------------------------

function calculatePasswordStrength(password: string): PasswordStrength {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&#]/.test(password),
  };

  // Calcul du score basé sur les critères remplis
  const fulfilledCriteria = Object.values(requirements).filter(Boolean).length;
  
  let score = 0;
  let label = 'Très faible';
  let color: 'error' | 'warning' | 'info' | 'success' = 'error';

  if (fulfilledCriteria === 5 && password.length >= 12) {
    score = 4;
    label = 'Très fort';
    color = 'success';
  } else if (fulfilledCriteria >= 4) {
    score = 3;
    label = 'Fort';
    color = 'success';
  } else if (fulfilledCriteria >= 3) {
    score = 2;
    label = 'Moyen';
    color = 'info';
  } else if (fulfilledCriteria >= 2) {
    score = 1;
    label = 'Faible';
    color = 'warning';
  }

  return { score, label, color, requirements };
}

// ----------------------------------------------------------------------
// COMPOSANT: ÉTAPE 3 - CRÉATION DU NOUVEAU MOT DE PASSE
// Permet de définir un nouveau mot de passe sécurisé
// Inclut un indicateur de force et des critères visuels
// ----------------------------------------------------------------------

export function NewPasswordView() {
  const router = useRouter();
  const showPassword = useBoolean();
  const [error, setError] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);

  const defaultValues: NewPasswordSchemaType = {
    password: '',
    confirmPassword: '',
  };

  const methods = useForm<NewPasswordSchemaType>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  // Surveillance du mot de passe pour l'indicateur de force
  const watchPassword = watch('password');

  // ----------------------------------------------------------------------
  // EFFET: VÉRIFICATION DE SÉCURITÉ
  // S'assure que l'utilisateur a bien complété les étapes précédentes
  // ----------------------------------------------------------------------

  useEffect(() => {
    const identifier = sessionStorage.getItem('reset_identifier');
    const otpVerified = sessionStorage.getItem('otp_verified');
    const verifiedAt = sessionStorage.getItem('otp_verified_at');

    // Vérifier que l'utilisateur vient des étapes précédentes
    if (!identifier || !otpVerified) {
      console.warn('Accès non autorisé, redirection...');
      router.push(paths.auth.jwt.forgotPassword);
      return;
    }

    // Vérifier que la vérification OTP n'est pas expirée (15 minutes max)
    if (verifiedAt) {
      const timeDiff = Date.now() - parseInt(verifiedAt, 10);
      const fifteenMinutes = 15 * 60 * 1000;

      if (timeDiff > fifteenMinutes) {
        console.warn('Session expirée, veuillez recommencer');
        sessionStorage.clear();
        router.push(paths.auth.jwt.forgotPassword);
      }
    }
  }, [router]);

  // ----------------------------------------------------------------------
  // EFFET: MISE À JOUR DE L'INDICATEUR DE FORCE
  // Calcule en temps réel la force du mot de passe
  // ----------------------------------------------------------------------

  useEffect(() => {
    if (watchPassword) {
      setPasswordStrength(calculatePasswordStrength(watchPassword));
    } else {
      setPasswordStrength(null);
    }
  }, [watchPassword]);

  // ----------------------------------------------------------------------
  // LOGIQUE DE SOUMISSION
  // Enregistre le nouveau mot de passe et nettoie la session
  // ----------------------------------------------------------------------

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError('');

      // Vérifier une dernière fois la force du mot de passe
      const strength = calculatePasswordStrength(data.password);
      if (strength.score < 2) {
        setError('Le mot de passe est trop faible. Veuillez en choisir un plus robuste.');
        return;
      }

      // Simulation d'un délai réseau
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // ----------------------------------------------------------------------
      // VALIDATION TEMPORAIRE (À REMPLACER PAR L'API)
      // En production, cette section appellera l'API backend
      // ----------------------------------------------------------------------

      const identifier = sessionStorage.getItem('reset_identifier');
      
      console.info('✅ Nouveau mot de passe enregistré pour:', identifier);
      console.info('📊 Force du mot de passe:', strength.label);

      // ----------------------------------------------------------------------
      // NETTOYAGE DE LA SESSION
      // Supprime toutes les données sensibles après succès
      // ----------------------------------------------------------------------

      sessionStorage.removeItem('reset_identifier');
      sessionStorage.removeItem('otp_verified');
      sessionStorage.removeItem('otp_verified_at');
      sessionStorage.removeItem('reset_token');
      sessionStorage.removeItem('verification_token');

      // Redirection vers la page de connexion avec message de succès
      router.push(`${paths.auth.jwt.signIn}?returnTo=%2Fparticipant%2F`);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
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

      {/* Champ nouveau mot de passe */}
      <Field.Text
        name="password"
        label="Nouveau mot de passe"
        placeholder="Entrez votre nouveau mot de passe"
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: {
            autoComplete: 'new-password'
          },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify 
                    icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} 
                  />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Indicateur de force du mot de passe */}
      {passwordStrength && (
        <Box sx={{ mt: -1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Force du mot de passe:
            </Typography>
            <Chip 
              label={passwordStrength.label} 
              size="small"
              color={passwordStrength.color}
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={(passwordStrength.score / 4) * 100}
            color={passwordStrength.color}
            sx={{ height: 6, borderRadius: 1 }}
          />

          {/* Liste des critères */}
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Critères requis:
            </Typography>
            
            {[
              { key: 'length', label: 'Au moins 8 caractères' },
              { key: 'uppercase', label: 'Une lettre majuscule' },
              { key: 'lowercase', label: 'Une lettre minuscule' },
              { key: 'number', label: 'Un chiffre' },
              { key: 'special', label: 'Un caractère spécial (@$!%*?&#)' },
            ].map((criterion) => (
              <Box 
                key={criterion.key}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: passwordStrength.requirements[criterion.key as keyof typeof passwordStrength.requirements]
                    ? 'success.main'
                    : 'text.disabled',
                }}
              >
                <Iconify 
                  icon={
                    passwordStrength.requirements[criterion.key as keyof typeof passwordStrength.requirements]
                      ? 'eva:checkmark-circle-2-fill'
                      : 'eva:close-circle-outline'
                  }
                  width={16}
                />
                <Typography variant="caption">
                  {criterion.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Champ confirmation mot de passe */}
      <Field.Text
        name="confirmPassword"
        label="Confirmer le mot de passe"
        placeholder="Confirmez votre nouveau mot de passe"
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: {
            autoComplete: 'new-password'
          },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify 
                    icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} 
                  />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Bouton de soumission */}
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Mise à jour..."
        disabled={!passwordStrength || passwordStrength.score < 2}
      >
        Réinitialiser le mot de passe
      </LoadingButton>
    </Box>
  );

  return (
    <>
      {/* En-tête du formulaire */}
      <FormHead
        icon={<SentIcon />}
        title="Créer un nouveau mot de passe"
        description="Votre nouveau mot de passe doit être différent des mots de passe précédents et respecter les critères de sécurité."
      />

      {/* Formulaire */}
      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>
    </>
  );
}

// ----------------------------------------------------------------------
// INSTRUCTIONS POUR LA CONNEXION BACKEND
// ----------------------------------------------------------------------

/*
ÉTAPE 3 : CONNEXION AVEC L'API BACKEND

1. Remplacer la section "VALIDATION TEMPORAIRE" par un appel API :

const onSubmit = handleSubmit(async (data) => {
  try {
    setError('');
    
    // Vérifier la force du mot de passe
    const strength = calculatePasswordStrength(data.password);
    if (strength.score < 2) {
      setError('Mot de passe trop faible');
      return;
    }
    
    const identifier = sessionStorage.getItem('reset_identifier');
    const verificationToken = sessionStorage.getItem('verification_token');
    
    // Appel à l'API pour réinitialiser le mot de passe
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${verificationToken}` // Token de vérification
      },
      body: JSON.stringify({
        identifier: identifier,
        newPassword: data.password,
        confirmPassword: data.confirmPassword
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la réinitialisation');
    }

    const result = await response.json();
    
    // Nettoyage complet de la session
    sessionStorage.clear();
    
    // Redirection avec message de succès
    router.push(`${paths.auth.jwt.signIn}?reset=success`);
    
  } catch (error) {
    console.error('Erreur:', error);
    setError(error.message || 'Une erreur est survenue');
  }
});

2. L'API backend doit :
   - Vérifier le token de vérification
   - Valider que le token n'est pas expiré (15 minutes max)
   - Vérifier la force du mot de passe côté serveur aussi
   - Hasher le nouveau mot de passe (bcrypt, argon2, etc.)
   - Mettre à jour le mot de passe dans la base de données
   - Invalider tous les tokens de réinitialisation pour cet utilisateur
   - Optionnel: Envoyer un email de confirmation
   - Optionnel: Déconnecter toutes les sessions actives

3. Format de réponse API :
{
  "success": true,
  "message": "Mot de passe réinitialisé avec succès"
}

4. Sécurité renforcée :
   - Hasher le mot de passe avec un algorithme moderne (bcrypt rounds >= 10)
   - Ne jamais stocker ou logger le mot de passe en clair
   - Vérifier que le nouveau mot de passe est différent de l'ancien
   - Implémenter une liste de mots de passe courants à bloquer
   - Ajouter un historique des mots de passe (éviter la réutilisation)
   - Rate limiting sur l'endpoint (ex: 5 tentatives max par heure)
   - Envoyer une notification à l'utilisateur du changement

5. Sur la page de connexion, détecter le paramètre ?reset=success :

// Dans votre composant SignIn
const searchParams = useSearchParams();
const resetSuccess = searchParams.get('reset');

{resetSuccess === 'success' && (
  <Alert severity="success">
    Votre mot de passe a été réinitialisé avec succès. 
    Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
  </Alert>
)}
*/