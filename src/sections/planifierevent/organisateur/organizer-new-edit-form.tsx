import { z as zod } from 'zod';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import { InputAdornment } from '@mui/material';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { IOrganizerItem } from 'src/types/organizer';

export const NewUserSchema = zod.object({
    avatarUrl: schemaHelper.file({ message: 'La photo de profil est requise!' }),
    name: zod.string().min(1, { message: 'Le nom est requis!' }),
    surname: zod.string().min(1, { message: 'Le prénom est requis!' }),
    password: zod.string().min(1, { message: 'Le mot de passe est requis!' }),
    email: zod
        .string()
        .min(1, { message: "L'email est requis!" })
        .email({ message: "L'email doit être une adresse valide!" }),
    phoneNumber: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
    address: zod.string().min(1, { message: "L'adresse est requise!" }),
    status: zod.string(),
    isVerified: zod.boolean(),
});

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

type Props = {
    currentUser?: IOrganizerItem;
};

export function OrganizerNewEditForm({ currentUser }: Props) {
    const router = useRouter();
    const showPassword = useBoolean();

    const defaultValues: NewUserSchemaType = {
        status: '',
        avatarUrl: null,
        isVerified: true,
        name: '',
        surname: '',
        password: '',
        email: '',
        phoneNumber: '',
        address: '',
    };

    const methods = useForm<NewUserSchemaType>({
        mode: 'onSubmit',
        resolver: zodResolver(NewUserSchema),
        defaultValues,
        values: currentUser,
    });

    const {
        reset,
        watch,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const onSubmit = handleSubmit(async (data) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            reset();
            toast.success(currentUser ? 'Mise à jour réussie!' : 'Création réussie!');
            router.push(paths.dashboard.user.list);
            console.info('DATA', data);
        } catch (error) {
            console.error(error);
        }
    });

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
                            <Field.Text name="name" label="Nom" />
                            <Field.Text name="surname" label="Prénom" />
                            <Field.Text name="email" label="Adresse email"  />
                            <Field.Text
                                name="password"
                                label="Mot de passe"
                                type={showPassword.value ? 'text' : 'password'}
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
                            <Field.Phone
                                name="phoneNumber"
                                label="Numéro de téléphone mobile"
                                country={!currentUser ? 'CI' : undefined}
                            />
                            <Field.Text name="address" label="Lieu d'habitation"  />
                            <Field.Text name="status" label="Status" value="Actif" disabled />


                        </Box>

                        <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                {!currentUser ? 'Créer organisateur' : 'Enregistrer les modifications'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </Form>
    );
}