import type { Organizer } from 'src/lib/organizers/types';

import { z as zod } from 'zod';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { 
    FormControl, 
    FormHelperText, 
    InputLabel, 
    MenuItem, 
    Select 
} from '@mui/material';

// ✅ IMPORTS DES ACTIONS
import { updateOrganizer, suspendOrganizer, unsuspendOrganizer } from 'src/lib/organizers/actions';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

/**
 * Schéma de validation COMPLET (avec adresse et téléphone)
 */
const OrganizerQuickEditSchema = zod.object({
    firstName: zod.string().min(1, { message: 'Le nom est requis!' }),
    lastName: zod.string().min(1, { message: 'Le prénom est requis!' }),
    email: zod
        .string()
        .min(1, { message: "L'email est requis!" })
        .email({ message: 'Email invalide!' }),
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
    status: zod.enum(['Active', 'Suspended'], { 
        message: 'Le statut est requis!' 
    }),
});

type OrganizerQuickEditSchemaType = zod.infer<typeof OrganizerQuickEditSchema>;

// ----------------------------------------------------------------------

/**
 * Options de statut
 */
const STATUS_OPTIONS = [
    {
        value: 'Active',
        label: 'Actif',
        color: 'success.main',
        icon: 'solar:check-circle-bold'
    },
    {
        value: 'Suspended',
        label: 'Suspendu',
        color: 'error.main',
        icon: 'solar:forbidden-circle-bold'
    },
];

type StatusOptionType = {
    value: string;
    label: string;
    color: string;
    icon: string;
}

const StatusOption = ({ value, label, color, icon }: StatusOptionType) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Iconify icon={icon} sx={{ color }} />
        <span>{label}</span>
    </Box>
);

const SelectedStatus = ({ value }: { value: string }) => {
    const status = STATUS_OPTIONS.find(option => option.value === value);
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {status && (
                <>
                    <Iconify icon={status.icon} sx={{ color: status.color }} />
                    <span>{status.label}</span>
                </>
            )}
        </Box>
    );
};

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    currentOrganizer?: Organizer;
    onSuccess?: () => void;  // ✅ Callback pour rafraîchir la liste
};

/**
 * Formulaire de modification rapide d'un organisateur
 * COMPLET avec adresse et téléphone
 */
export function OrganizerQuickEditForm({ 
    currentOrganizer, 
    open, 
    onClose,
    onSuccess 
}: Props) {
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📝 CONFIGURATION DU FORMULAIRE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const defaultValues: OrganizerQuickEditSchemaType = {
        firstName: currentOrganizer?.firstName || '',
        lastName: currentOrganizer?.lastName || '',
        email: currentOrganizer?.email || '',
        phoneNumber: currentOrganizer?.phoneNumber || '',
        address: currentOrganizer?.address || '',
        status: (currentOrganizer?.status as 'Active' | 'Suspended') || 'Active',
    };

    const methods = useForm<OrganizerQuickEditSchemaType>({
        mode: 'all',
        resolver: zodResolver(OrganizerQuickEditSchema),
        defaultValues,
        values: currentOrganizer ? {
            firstName: currentOrganizer.firstName,
            lastName: currentOrganizer.lastName,
            email: currentOrganizer.email,
            phoneNumber: currentOrganizer.phoneNumber,
            address: currentOrganizer.address || '',
            status: currentOrganizer.status as 'Active' | 'Suspended',
        } : undefined,
    });

    const {
        reset,
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = methods;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 📤 SOUMISSION DU FORMULAIRE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const onSubmit = handleSubmit(async (data) => {
        if (!currentOrganizer?.id) {
            toast.error('Impossible de mettre à jour : ID manquant');
            return;
        }

        try {
            console.log('📤 Mise à jour rapide:', {
                id: currentOrganizer.id,
                data
            });

            // ✅ VALIDATION DU TÉLÉPHONE
            if (!isValidPhoneNumber(data.phoneNumber)) {
                toast.error('Le numéro de téléphone n\'est pas valide');
                return;
            }

            // ✅ EXTRACTION DES INFORMATIONS TÉLÉPHONE
            const parsedPhone = parsePhoneNumber(data.phoneNumber);
            
            if (!parsedPhone) {
                toast.error('Impossible de parser le numéro de téléphone');
                return;
            }

            const phoneInformation = {
                number: parsedPhone.nationalNumber,  // Ex: "0749668962"
                region: parsedPhone.country ?? 'CI',          // Ex: "CI"
            };

            console.log('📞 Téléphone extrait:', {
                original: data.phoneNumber,
                ...phoneInformation
            });

            // ✅ MISE À JOUR DES DONNÉES COMPLÈTES
            const updateResult = await updateOrganizer(currentOrganizer.id, {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                address: data.address,
                phoneInformation,  // ✅ Téléphone inclus
            });

            if (updateResult && 'success' in updateResult && !updateResult.success) {
                toast.error(updateResult.error || 'Erreur lors de la mise à jour');
                return;
            }

            // ✅ GESTION DU CHANGEMENT DE STATUT
            const statusChanged = data.status !== currentOrganizer.status;
            
            if (statusChanged) {
                console.log('🔄 Changement de statut:', currentOrganizer.status, '→', data.status);

                const statusResult = data.status === 'Suspended'
                    ? await suspendOrganizer(currentOrganizer.id)
                    : await unsuspendOrganizer(currentOrganizer.id);

                if (statusResult && 'success' in statusResult && !statusResult.success) {
                    toast.error(statusResult.error || 'Erreur lors du changement de statut');
                    return;
                }
            }

            // ✅ SUCCÈS
            toast.success('Organisateur mis à jour avec succès!');
            reset();
            onClose();

            // Appeler le callback pour rafraîchir la liste
            if (onSuccess) {
                console.log('🔄 Rafraîchissement de la liste...');
                onSuccess();
            }

        } catch (error) {
            console.error('❌ Erreur lors de la mise à jour:', error);
            toast.error('Une erreur est survenue');
        }
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎨 RENDU DU DIALOG
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={onClose}
        >
            <DialogTitle>Modifier l'organisateur</DialogTitle>

            {/* ✅ FormProvider pour que Field.Phone puisse accéder au contexte */}
            <FormProvider {...methods}>
                <form onSubmit={onSubmit}>
                    <DialogContent>
                        <Alert severity="info" sx={{ mb: 3 }}>
                            Modifiez les informations de l'organisateur
                        </Alert>

                        <Box
                            sx={{
                                gap: 3,
                                display: 'grid',
                                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                            }}
                        >
                            {/* STATUT - Sur toute la largeur */}
                            <Box sx={{ gridColumn: { sm: 'span 2' } }}>
                                <FormControl error={!!errors.status} fullWidth>
                                    <InputLabel>Statut</InputLabel>
                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                label="Statut"
                                                renderValue={(value) => <SelectedStatus value={value} />}
                                            >
                                                {STATUS_OPTIONS.map((status) => (
                                                    <MenuItem key={status.value} value={status.value}>
                                                        <StatusOption {...status} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    {errors.status && (
                                        <FormHelperText>{errors.status.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </Box>

                            {/* NOM */}
                            <TextField
                                fullWidth
                                label="Nom"
                                {...register('firstName')}
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />

                            {/* PRÉNOM */}
                            <TextField
                                fullWidth
                                label="Prénom"
                                {...register('lastName')}
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />

                            {/* EMAIL */}
                            <TextField
                                fullWidth
                                label="Email"
                                {...register('email')}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />

                            {/* TÉLÉPHONE - ✅ Utilisation de Field.Phone avec FormProvider */}
                            <Field.Phone
                                name="phoneNumber"
                                label="Numéro de téléphone mobile"
                            />

                            {/* ADRESSE - Sur toute la largeur */}
                            <Box sx={{ gridColumn: { sm: 'span 2' } }}>
                                <TextField
                                    fullWidth
                                    label="Lieu d'habitation"
                                    {...register('address')}
                                    error={!!errors.address}
                                    helperText={errors.address?.message}
                                />
                            </Box>
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button variant="outlined" onClick={onClose}>
                            Annuler
                        </Button>

                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            Mettre à jour
                        </LoadingButton>
                    </DialogActions>
                </form>
            </FormProvider>
        </Dialog>
    );
}

export default OrganizerQuickEditForm;