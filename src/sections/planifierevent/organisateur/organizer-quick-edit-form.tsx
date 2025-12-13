import { z as zod } from 'zod';
import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, MenuItem, Select } from '@mui/material';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

// Schema de validation
const OrganizerQuickEditSchema = zod.object({
    name: zod.string().min(1, { message: 'Le nom est requis!' }),
    email: zod
        .string()
        .min(1, { message: "L'email est requis!" })
        .email({ message: 'Email invalide!' }),
    password: zod.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères!' }),
    status: zod.string().min(1, { message: 'Le statut est requis!' }),
});


// Options de statut avec couleurs et icônes
const STATUS_OPTIONS = [
    {
        value: 'active',
        label: 'Actif',
        color: 'success.main',
        icon: 'solar:check-circle-bold'
    },
    {
        value: 'inactive',
        label: 'Suspendu',
        color: 'error.main',
        icon: 'solar:forbidden-circle-bold'
    },
];

type STATUS_OPTIONS_TYPE = {
    value: string;
    label: string;
    color: string;
    icon: string;
}

// Composant personnalisé pour l'option de statut
const StatusOption = ({ value, label, color, icon }: STATUS_OPTIONS_TYPE) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Iconify icon={icon} sx={{ color }} />
        <span>{label}</span>
    </Box>
);

// Composant personnalisé pour la valeur sélectionnée
const SelectedStatus = ({ value }: STATUS_OPTIONS_TYPE) => {
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

type OrganizerQuickEditSchemaType = zod.infer<typeof OrganizerQuickEditSchema>;

type Props = {
    open: boolean;
    onClose: () => void;
    currentOrganizer?: {
        name: string;
        email: string;
        password: string;
        status: string;
    };
};

export function OrganizerQuickEditForm({ currentOrganizer, open, onClose }: Props) {
    const showPassword = useBoolean();

    const defaultValues: OrganizerQuickEditSchemaType = {
        name: '',
        email: '',
        password: '',
        status: 'active',
    };

    const methods = useForm<OrganizerQuickEditSchemaType>({
        mode: 'all',
        resolver: zodResolver(OrganizerQuickEditSchema),
        defaultValues,
        values: currentOrganizer,
    });

    const {
        reset,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = methods;

    const onSubmit = async (data: OrganizerQuickEditSchemaType) => {
        const promise = new Promise((resolve) => setTimeout(resolve, 1000));

        try {
            reset();
            onClose();

            toast.promise(promise, {
                loading: 'Chargement...',
                success: 'Mise à jour réussie!',
                error: 'Erreur lors de la mise à jour!',
            });

            await promise;
            console.info('DATA', data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={onClose}
        >
            <DialogTitle>Modifier l'organisateur</DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 3 }}>
                        Veuillez remplir tous les champs obligatoires
                    </Alert>

                    <Box
                        sx={{
                            gap: 3,
                            display: 'grid',
                            gridTemplateColumns: { xs: 'repeat(1, 1fr)' },
                        }}
                    >
                        <FormControl error={!!errors.status} fullWidth>
                            <InputLabel>Statut</InputLabel>
                            <Controller
                                name="status"
                                control={methods.control}
                                defaultValue={currentOrganizer?.status || 'active'}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Statut"
                                        renderValue={(value) => <SelectedStatus value={value} label={''} color={''} icon={''} />}
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
                        <TextField
                            fullWidth
                            label="Nom complet"
                            {...register('name')}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />

                        <TextField
                            fullWidth
                            label="Email"
                            {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />

                        <TextField
                            fullWidth
                            type={showPassword.value ? 'text' : 'password'}
                            label="Mot de passe"
                            {...register('password')}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            slotProps={{
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
        </Dialog>
    );
}

export default OrganizerQuickEditForm;