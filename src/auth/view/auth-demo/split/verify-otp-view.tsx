'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { EmailInboxIcon } from 'src/assets/icons';

import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../../../components/form-head';
import { FormReturnLink } from '../../../components/form-return-link';
import { FormResendCode } from '../../../components/form-resend-code';

// ----------------------------------------------------------------------
// SCHÉMA DE VALIDATION ZOD
// Valide que le code OTP a exactement 6 chiffres
// ----------------------------------------------------------------------

export type VerifyOtpSchemaType = zod.infer<typeof VerifyOtpSchema>;

export const VerifyOtpSchema = zod.object({
    code: zod
        .string()
        .min(1, { message: 'Le code est requis!' })
        .length(6, { message: 'Le code doit contenir exactement 6 chiffres!' })
        .regex(/^[0-9]+$/, { message: 'Le code doit contenir uniquement des chiffres!' }),
});

// ----------------------------------------------------------------------
// COMPOSANT: ÉTAPE 2 - VÉRIFICATION DU CODE OTP
// Permet à l'utilisateur d'entrer le code reçu par email/SMS
// Inclut un timer de compte à rebours et la possibilité de renvoyer le code
// ----------------------------------------------------------------------

export function VerifyOtpView() {
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const [identifier, setIdentifier] = useState<string>('');

    // ----------------------------------------------------------------------
    // GESTION DU TIMER DE RENVOI
    // Compte à rebours de 60 secondes avant de pouvoir renvoyer le code
    // ----------------------------------------------------------------------
    const [countdown, setCountdown] = useState<number>(60);
    const [canResend, setCanResend] = useState<boolean>(false);

    // Valeurs par défaut
    const defaultValues: VerifyOtpSchemaType = {
        code: '',
    };

    const methods = useForm<VerifyOtpSchemaType>({
        resolver: zodResolver(VerifyOtpSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    // ----------------------------------------------------------------------
    // EFFET: VÉRIFICATION ET TIMER
    // Vérifie que l'utilisateur vient bien de l'étape 1
    // Lance le compte à rebours pour le renvoi du code
    // ----------------------------------------------------------------------

    useEffect(() => {
        // Récupère l'identifiant de l'étape précédente
        const storedIdentifier = sessionStorage.getItem('reset_identifier');

        if (!storedIdentifier) {
            // Si pas d'identifiant, rediriger vers l'étape 1
            console.warn('Aucun identifiant trouvé, redirection...');
            router.push(paths.auth.jwt.forgotPassword);
            return;
        }

        setIdentifier(storedIdentifier);

        // Gestion du compte à rebours
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Nettoyage à la destruction du composant
        return () => clearInterval(timer);
    }, [router]);

    // ----------------------------------------------------------------------
    // LOGIQUE DE SOUMISSION
    // Vérifie le code OTP entré par l'utilisateur
    // ----------------------------------------------------------------------

    const onSubmit = handleSubmit(async (data) => {
        try {
            setError('');

            // Simulation d'un délai réseau
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // ----------------------------------------------------------------------
            // VALIDATION TEMPORAIRE (À REMPLACER PAR L'API)
            // Vérifie si le code correspond à celui de test
            // ----------------------------------------------------------------------

            const validOtp = '012345';

            if (data.code !== validOtp) {
                setError('Code incorrect. Veuillez vérifier et réessayer.');
                return;
            }

            // ----------------------------------------------------------------------
            // STOCKAGE DE LA VÉRIFICATION
            // Marque que le code a été vérifié avec succès
            // ----------------------------------------------------------------------

            sessionStorage.setItem('otp_verified', 'true');
            sessionStorage.setItem('otp_verified_at', Date.now().toString());

            console.info('Code OTP vérifié avec succès');

            // Redirection vers l'étape 3 (nouveau mot de passe)
            router.push(paths.auth.jwt.newPassword);
        } catch (error) {
            console.error('Erreur lors de la vérification:', error);
            setError('Une erreur est survenue. Veuillez réessayer.');
        }
    });

    // ----------------------------------------------------------------------
    // FONCTION: RENVOYER LE CODE
    // Permet de demander un nouveau code OTP
    // ----------------------------------------------------------------------

    const handleResendCode = async () => {
        try {
            setError('');
            setCanResend(false);
            setCountdown(60);

            // Simulation d'un délai réseau
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // ----------------------------------------------------------------------
            // APPEL À L'API (À IMPLÉMENTER)
            // Devrait appeler le même endpoint que l'étape 1
            // ----------------------------------------------------------------------

            console.info('Nouveau code OTP envoyé à:', identifier);

            // Relancer le compte à rebours
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        setCanResend(true);
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            console.error('Erreur lors du renvoi:', error);
            setError('Impossible de renvoyer le code. Veuillez réessayer.');
            setCanResend(true);
        }
    };

    // ----------------------------------------------------------------------
    // FONCTION: MASQUER L'IDENTIFIANT
    // Masque partiellement l'email ou le numéro pour la sécurité
    // ----------------------------------------------------------------------

    const maskIdentifier = (id: string): string => {
        if (id.includes('@')) {
            // Masquer l'email: d***@qurumevent.com
            const [username, domain] = id.split('@');
            return `${username[0]}${'*'.repeat(username.length - 1)}@${domain}`;
        } else {
            // Masquer le numéro: 0789***751
            return `${id.substring(0, 4)}${'*'.repeat(3)}${id.substring(7)}`;
        }
    };

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

            {/* Information sur l'envoi du code */}
            {identifier && (
                <Alert severity="info" sx={{ mb: 1 }}>
                    Entrez le code à 6 chiffres envoyé par <strong>{maskIdentifier(identifier)}</strong>
                </Alert>
            )}

            {/* Champ de saisie du code OTP */}
            <Field.Code
                name="code"
                placeholder="0"
                helperText=""
            />

            {/* Bouton de soumission */}
            <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                loadingIndicator="Vérification..."
            >
                Vérifier le code
            </LoadingButton>
        </Box>
    );

    return (
        <>
            {/* En-tête du formulaire */}
            <FormHead
                icon={<EmailInboxIcon />}
                title="Vérifiez votre code"
                description="Nous avons envoyé un code de vérification à 6 chiffres. Veuillez entrer le code ci-dessous."
            />

            {/* Formulaire */}
            <Form methods={methods} onSubmit={onSubmit}>
                {renderForm()}
            </Form>

            {/* Composant de renvoi du code avec compte à rebours */}
            <FormResendCode
                value={countdown}
                disabled={!canResend}
                onResendCode={handleResendCode}
            />

            {/* Lien de retour */}
            <FormReturnLink
                href={paths.auth.jwt.forgotPassword}
                label="Changer de mode de récupération"
            />
        </>
    );
}

// ----------------------------------------------------------------------
// INSTRUCTIONS POUR LA CONNEXION BACKEND
// ----------------------------------------------------------------------

/*
ÉTAPE 2 : CONNEXION AVEC L'API BACKEND

1. Remplacer la section "VALIDATION TEMPORAIRE" par un appel API :

const onSubmit = handleSubmit(async (data) => {
  try {
    setError('');
    
    const identifier = sessionStorage.getItem('reset_identifier');
    const resetToken = sessionStorage.getItem('reset_token'); // Si utilisé
    
    // Appel à l'API pour vérifier le code OTP
    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Si token requis: 'Authorization': `Bearer ${resetToken}`
      },
      body: JSON.stringify({
        identifier: identifier,
        code: data.code
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Code incorrect');
    }

    const result = await response.json();
    
    // Sauvegarder le token de vérification pour l'étape 3
    if (result.verificationToken) {
      sessionStorage.setItem('verification_token', result.verificationToken);
    }
    
    sessionStorage.setItem('otp_verified', 'true');
    sessionStorage.setItem('otp_verified_at', Date.now().toString());

    router.push(paths.auth.jwt.newPassword);
    
  } catch (error) {
    console.error('Erreur:', error);
    setError(error.message || 'Code incorrect');
  }
});

2. Pour le renvoi du code :

const handleResendCode = async () => {
  try {
    setError('');
    setCanResend(false);
    setCountdown(60);
    
    const identifier = sessionStorage.getItem('reset_identifier');
    
    const response = await fetch('/api/auth/resend-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: identifier
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors du renvoi');
    }

    // Relancer le timer...
    
  } catch (error) {
    setError('Impossible de renvoyer le code');
    setCanResend(true);
  }
};

3. L'API backend doit :
   - Vérifier que le code OTP correspond et n'est pas expiré
   - Marquer le code comme utilisé (pour éviter la réutilisation)
   - Générer un token de vérification valide pour 10-15 minutes
   - Retourner le token pour l'étape suivante

4. Format de réponse API :
{
  "success": true,
  "message": "Code vérifié avec succès",
  "verificationToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

5. Sécurité :
   - Limiter le nombre de tentatives (ex: 5 max)
   - Expirer le code après 10 minutes
   - Bloquer après trop de tentatives échouées
   - Invalider le code après utilisation
*/