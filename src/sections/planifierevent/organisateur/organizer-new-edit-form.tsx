import type { Organizer, OrganizerDetails } from 'src/lib/organizers/types';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

// ✅ IMPORTS DES ACTIONS ET TYPES
import { createOrganizer, updateOrganizer } from 'src/lib/organizers/actions';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

/**
 * Schéma de validation Zod
 */
export const OrganizerFormSchema = zod.object({
    name: zod.string().min(1, { message: 'Le nom est requis!' }),
    surname: zod.string().min(1, { message: 'Le prénom est requis!' }),
    email: zod
        .string()
        .min(1, { message: "L'email est requis!" })
        .email({ message: "L'email doit être une adresse valide!" }),
    phoneNumber: zod
        .string()
        .min(1, { message: 'Le numéro de téléphone est requis!' })
        .refine(
            (value) => {
                if (!value) return false;
                try {
                    return isValidPhoneNumber(value);
                } catch {
                    return false;
                }
            },
            { message: 'Le numéro de téléphone n\'est pas valide!' }
        ),
    address: zod.string().min(1, { message: "L'adresse est requise!" }),
});

export type OrganizerFormSchemaType = zod.infer<typeof OrganizerFormSchema>;

// ----------------------------------------------------------------------

type Props = {
    currentUser?: Organizer | OrganizerDetails;
};

/**
 * Formulaire de création/édition d'organisateur
 */
export function OrganizerNewEditForm({ currentUser }: Props) {
    const router = useRouter();

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📝 CONFIGURATION DU FORMULAIRE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const defaultValues: OrganizerFormSchemaType = {
        name: currentUser?.firstName || '',
        surname: currentUser?.lastName || '',
        email: currentUser?.email || '',
        phoneNumber: currentUser?.phoneNumber || '',
        address: 'address' in (currentUser || {}) ? (currentUser as OrganizerDetails).address : '',
    };

    const methods = useForm<OrganizerFormSchemaType>({
        mode: 'onSubmit',
        resolver: zodResolver(OrganizerFormSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📤 SOUMISSION DU FORMULAIRE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const onSubmit = handleSubmit(async (data) => {
        try {
            console.log('📤 Soumission du formulaire:', data);

            // Validation du téléphone
            if (!isValidPhoneNumber(data.phoneNumber)) {
                toast.error('Le numéro de téléphone n\'est pas valide');
                return;
            }

            // ✅ EXTRACTION CORRECTE POUR LE BACKEND
            const parsedPhone = parsePhoneNumber(data.phoneNumber);
            
            if (!parsedPhone) {
                toast.error('Impossible de parser le numéro de téléphone');
                return;
            }

            const phoneInformation = {
                number: parsedPhone.nationalNumber,  // Ex: "0749668962"
                region: parsedPhone.country,          // Ex: "CI"
            };

            console.log('📞 Téléphone extrait:', {
                original: data.phoneNumber,
                ...phoneInformation
            });

            if (currentUser) {
                // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                // ✏️ MODE ÉDITION
                // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                console.log('🔄 Mise à jour de l\'organisateur:', currentUser.id);

                const result = await updateOrganizer(currentUser.id, {
                    firstName: data.name,
                    lastName: data.surname,
                    email: data.email,
                    address: data.address,
                    phoneInformation,
                });

                // Vérifier si c'est un succès
                if (result && 'success' in result && !result.success) {
                    toast.error(result.error || 'Erreur lors de la mise à jour');
                    return;
                }

                // ✅ SUCCÈS - Afficher message et rediriger
                toast.success('Organisateur mis à jour avec succès!');
                
                // Attendre un peu pour que l'utilisateur voie le toast
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Rediriger vers la liste
                router.push(paths.admin.PLANIFIER_UN_EVENEMENT.root);

            } else {
                // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                // ➕ MODE CRÉATION
                // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                console.log('➕ Création d\'un nouvel organisateur');

                const result = await createOrganizer({
                    firstName: data.name,
                    lastName: data.surname,
                    email: data.email,
                    address: data.address,
                    phoneInformation,
                });

                // Vérifier si c'est un succès
                if (result && 'success' in result && !result.success) {
                    toast.error(result.error || 'Erreur lors de la création');
                    return;
                }

                // ✅ SUCCÈS - Afficher message et réinitialiser le formulaire
                toast.success('Organisateur créé avec succès!');
                
                console.log('🔄 Réinitialisation du formulaire');
                
                // Réinitialiser le formulaire pour permettre une nouvelle création
                reset({
                    name: '',
                    surname: '',
                    email: '',
                    phoneNumber: '',
                    address: '',
                });
            }

        } catch (error) {
            console.error('❌ Erreur lors de la soumission:', error);
            toast.error('Une erreur est survenue');
        }
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎨 RENDU DU FORMULAIRE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{ p: 3 }}>
                        <Box
                            sx={{
                                rowGap: 3,
                                columnGap: 2,
                                display: 'grid',
                                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                            }}
                        >
                            {/* NOM */}
                            <Field.Text 
                                name="name" 
                                label="Nom"
                                placeholder="Entrez le nom"
                            />

                            {/* PRÉNOM */}
                            <Field.Text 
                                name="surname" 
                                label="Prénom"
                                placeholder="Entrez le prénom"
                            />

                            {/* EMAIL */}
                            <Field.Text 
                                name="email" 
                                label="Adresse email"
                                placeholder="exemple@email.com"
                            />

                            {/* TÉLÉPHONE */}
                            <Field.Phone
                                name="phoneNumber"
                                label="Numéro de téléphone mobile"
                                country={!currentUser ? 'CI' : undefined}
                            />

                            {/* ADRESSE - Sur toute la largeur */}
                            <Box sx={{ gridColumn: { sm: 'span 2' } }}>
                                <Field.Text 
                                    name="address" 
                                    label="Lieu d'habitation"
                                    placeholder="Entrez l'adresse complète"
                                />
                            </Box>

                            {/* STATUT - Affiché uniquement en mode édition */}
                            {currentUser && (
                                <Field.Text 
                                    name="status" 
                                    label="Statut" 
                                    value="Actif" 
                                    disabled 
                                />
                            )}
                        </Box>

                        {/* BOUTON DE SOUMISSION */}
                        <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
                            <LoadingButton 
                                type="submit" 
                                variant="contained" 
                                loading={isSubmitting}
                                size="large"
                            >
                                {!currentUser ? 'Créer organisateur' : 'Enregistrer les modifications'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </Form>
    );
}