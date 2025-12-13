import { z as zod } from 'zod';
import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useMockedUser } from 'src/auth/hooks';

// import { IClientItem } from 'src/types/client';
// // import Divider from '@mui/material/Divider/Divider';

// Nouvelles imports
// Nouvelles imports
import { _mock } from 'src/_mock';
import { createCustomer, updateCustomer } from 'src/lib/customers/actions';
import type { CreateCustomerDto, CustomerDetails } from 'src/lib/customers/types';
import LinearProgress from '@mui/material/LinearProgress';
import { mediaService, fetchDefaultUserImage } from 'src/lib/medias/service';


const { user } = useMockedUser();

// const CLIENT_OPTIONS = [
//     { label: 'Personne physique' },
//     { label: 'Personne morale' },
// ];

const CLIENT_OPTIONS = [
    { label: 'Personne physique', value: 'Physical' },
    { label: 'Personne morale', value: 'Legal' },
];

// export type IClientItem = {
//     id: string;
//     name: string;
//     surname: string;
//     client_type: 'Personne physique' | 'Personne morale';
//     city: string;
//     role: string;
//     email: string;
//     state: string;
//     status: string;
//     address: string;
//     country: string;
//     zipCode: string;
//     company: string;
//     avatarUrl: string;
//     phoneNumber: string;
//     isVerified: boolean;
// };

// Common fields schema
// const CommonSchema = {
//     id: zod.string().optional(),
//     email: zod
//         .string()
//         .min(1, { message: 'L\'email est requis !' })
//         .email({ message: 'L\'adresse email doit être valide !' }),
//     phoneNumber: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
//     country: schemaHelper.nullableInput(zod.string().min(1, { message: 'Pays est requis !' }), {
//         message: 'Pays est requis !',
//     }),
//     city: zod.string().min(1, { message: 'La ville est requise !' }),
//     state: zod.string().min(1, { message: 'La région est requise !' }),
//     address: zod.string().min(1, { message: 'L\'adresse est requise !' }),
//     zipCode: zod.string().min(1, { message: 'Le code postal est requis !' }),
//     status: zod.string().optional(),
//     isVerified: zod.boolean().optional(),
//     role: zod.string().optional(),
//     client_type: zod.enum(['Personne physique', 'Personne morale']),
//     avatarUrl: schemaHelper.file({ message: 'L\'image est requise !' })
// };

// const PhysiqueSchema = zod.object({
//     ...CommonSchema,
//     name: zod.string().min(1, { message: 'Le nom est requis !' }),
//     surname: zod.string().min(1, { message: 'Le prénom est requis !' }),
//     company: zod.string().optional(),
// });

// const MoraleSchema = zod.object({
//     ...CommonSchema,
//     company: zod.string().min(1, { message: 'Le nom de l\'entreprise est requis !' }),
//     name: zod.string().optional(),
//     surname: zod.string().optional(),
// });

// ✅ AJOUTER ces nouveaux schemas
/**
 * Schema pour Personne Physique
 */
const PhysicalCustomerSchema = zod.object({
    type: zod.literal('Physical'),
    firstName: zod.string().min(1, { message: 'Le prénom est requis !' }),
    lastName: zod.string().min(1, { message: 'Le nom est requis !' }),
    address: zod.string().min(1, { message: 'L\'adresse est requise !' }),
    email: zod
        .string()
        .min(1, { message: 'L\'email est requis !' })
        .email({ message: 'L\'adresse email doit être valide !' }),
    phoneNumber: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
});

/**
 * Schema pour Personne Morale
 */
const LegalCustomerSchema = zod.object({
    type: zod.literal('Legal'),
    name: zod.string().min(1, { message: 'Le nom de l\'entreprise est requis !' }),
    address: zod.string().min(1, { message: 'L\'adresse est requise !' }),
    email: zod
        .string()
        .min(1, { message: 'L\'email de l\'entreprise est requis !' })
        .email({ message: 'L\'adresse email doit être valide !' }),
    companyIdentificationNumber: zod.string().min(1, { message: 'Le numéro d\'identification est requis !' }),
    contactFirstName: zod.string().min(1, { message: 'Le prénom du contact est requis !' }),
    contactLastName: zod.string().min(1, { message: 'Le nom du contact est requis !' }),
    contactEmail: zod
        .string()
        .min(1, { message: 'L\'email du contact est requis !' })
        .email({ message: 'L\'adresse email doit être valide !' }),
    phoneNumber: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
});

/**
 * Union type pour le formulaire
 */
type CustomerFormData =
    | zod.infer<typeof PhysicalCustomerSchema>
    | zod.infer<typeof LegalCustomerSchema>;

/**
 * Extension avec image pour preview
 */
type CustomerFormDataWithImage = CustomerFormData & {
    image?: File | null;
};

// type Props = {
//     item?: IClientItem;
// };

type Props = {
    customer?: CustomerDetails | null;
};


/**
 * Obtenir les valeurs par défaut selon le type
 */
function getDefaultValues(type: 'Physical' | 'Legal'): CustomerFormData {
    if (type === 'Physical') {
        return {
            type: 'Physical',
            firstName: '',
            lastName: '',
            address: '',
            email: '',
            phoneNumber: '',
        };
    }

    return {
        type: 'Legal',
        name: '',
        address: '',
        email: '', // ✅ Email entreprise
        companyIdentificationNumber: '',
        contactFirstName: '',
        contactLastName: '',
        contactEmail: '',
        phoneNumber: '',
    };
}

/**
 * Convertir CustomerDetails API → CustomerFormData
 * Permet de pré-remplir le formulaire en mode édition
 */
function convertCustomerToFormData(customer: CustomerDetails): CustomerFormDataWithImage {
    if (customer.type === 'Physical') {
        return {
            type: 'Physical',
            firstName: customer.firstName || '',
            lastName: customer.lastName || '',
            address: customer.address,
            email: customer.email,
            phoneNumber: customer.phoneNumber,
            image: null, // L'image existe déjà sur Azure
        };
    }

    // Legal
    return {
        type: 'Legal',
        name: customer.name,
        address: customer.address,
        email: customer.email,
        companyIdentificationNumber: customer.companyIdentificationNumber || '',
        contactFirstName: customer.contactFirstName || '',
        contactLastName: customer.contactLastName || '',
        contactEmail: customer.contactEmail || '',
        phoneNumber: customer.phoneNumber,
        image: null, // L'image existe déjà sur Azur
    };
}

/**
 * Convertir une image du dossier public en File
 */
// async function fetchDefaultImage(): Promise<File> {
//     const imagePath = '/assets/images/mock/user/user.png';

//     const response = await fetch(imagePath);
//     const blob = await response.blob();

//     return new File([blob], 'default-user.png', { type: 'image/png' });
// }

export function ClientNewEditForm({ customer }: Props) {
    // const router = useRouter();
    // const [clientType, setClientType] = useState<'Personne physique' | 'Personne morale'>(
    //     item?.isMoralePerson ? 'Personne morale' : 'Personne physique'
    // );

    // const router = useRouter();
    // const [clientType, setClientType] = useState<'Physical' | 'Legal'>('Physical');

    const router = useRouter();
    const isEditMode = !!customer;
    const initialClientType = customer?.type || 'Physical';

    const [clientType, setClientType] = useState<'Physical' | 'Legal'>(initialClientType);

    // ✅ AJOUTER ces 3 nouveaux états
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [uploadedMediaId, setUploadedMediaId] = useState<string>('');
    const [hasUploadedNewImage, setHasUploadedNewImage] = useState(false);

    // const defaultValues: IClientItem = {
    //     id: '',
    //     logo: '',
    //     address: '',
    //     personLogo: '',
    //     company_name: '',
    //     contact_name: '',
    //     contact_firstname: '',
    //     isMoralePerson: false,
    //     email: '',
    //     eventNumber: 0,
    //     creationDate: '',
    //     phoneNumber: '',
    //     num_identification: '',
    // };

    // const methods = useForm({
    //     mode: 'onSubmit',
    //     resolver: zodResolver(clientType === 'Personne physique' ? PhysiqueSchema : MoraleSchema),
    //     defaultValues,
    //     values: item
    // });


    const methods = useForm<CustomerFormDataWithImage>({
        mode: 'onSubmit',
        resolver: zodResolver(
            clientType === 'Physical' ? PhysicalCustomerSchema : LegalCustomerSchema
        ),
        defaultValues: customer
            ? convertCustomerToFormData(customer) // ✅ Mode édition : pré-remplir
            : getDefaultValues(clientType),
    });

    // const {
    //     reset,
    //     watch,
    //     handleSubmit,
    //     formState: { isSubmitting },
    // } = methods;

    const {
        reset,
        handleSubmit,
        setValue,
        formState: { isSubmitting },
    } = methods;

    // const values = watch();

    // useEffect(() => {
    //     reset(item || defaultValues);
    // }, [clientType, item, reset]);


    /**
     * Handler pour l'upload d'image (Personne Morale uniquement)
     */
    const handleImageUpload = useCallback(async (file: File) => {
        try {
            setIsUploadingImage(true);

            const result = await mediaService.uploadImage({
                file,
                folder: 'Customers', // ✅ Spécifier le dossier
                onProgress: setUploadProgress,
            });

            setUploadedMediaId(result.mediaId); // ✅ Stocker mediaId au lieu de blobName
            setHasUploadedNewImage(true);
            setValue('image', file);
            toast.success('Logo uploadé avec succès');
        } catch (error) {
            console.error('Erreur upload:', error);
            toast.error(error instanceof Error ? error.message : 'Erreur upload logo');
        } finally {
            setIsUploadingImage(false);
        }
    }, [setValue]);

    /**
     * Handler pour le changement de type de client
     */
    const handleClientTypeChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            // ✅ Bloquer le changement en mode édition
            if (isEditMode) {
                return;
            }

            const newType = event.target.value as 'Physical' | 'Legal';
            setClientType(newType);
            reset(getDefaultValues(newType));
            setUploadedMediaId('');
            setUploadProgress(0);
            setHasUploadedNewImage(false); // ✅ AJOUTER : Reset aussi cet état
        },
        [reset, isEditMode] // ✅ AJOUTER isEditMode dans les deps
    );


    // const onSubmit = handleSubmit(async (data) => {
    //     try {
    //         await new Promise((resolve) => setTimeout(resolve, 500));
    //         reset();
    //         toast.success(item ? 'Mise à jour réussie!' : 'Création réussie!');
    //         router.push(paths.dashboard.user.list);
    //         console.info('DATA', data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // });



    /**
     * AJOUTER LE CALLBACK D'ERREUR
     */
    const onSubmit = handleSubmit(
        async (data) => {
            console.log('=== FORM SUBMIT TRIGGERED ===');
            console.log('📝 Mode:', isEditMode ? 'UPDATE' : 'CREATE');
            console.log('📝 Form Data:', data);
            console.log('📸 Uploaded MediaId:', uploadedMediaId);
            console.log('🖼️ Has New Image:', hasUploadedNewImage);

            try {
                // ==========================================
                // MODE CRÉATION
                // ==========================================
                if (!isEditMode) {
                    let dto: CreateCustomerDto;

                    if (data.type === 'Physical') {
                        // Physical : Upload image par défaut
                        let defaultImageBlobName = '';

                        try {
                            const defaultImageFile = await fetchDefaultUserImage();
                            const uploadResult = await mediaService.uploadImage({
                                file: defaultImageFile,
                                folder: 'Customers', // ✅ AJOUTER
                                onProgress: (progress) => {
                                    console.log(`📤 Upload image par défaut: ${progress}%`);
                                },
                            });

                            defaultImageBlobName = uploadResult.mediaId; // ✅ Utiliser mediaId
                            console.log('✅ Image par défaut uploadée, mediaId:', defaultImageBlobName);
                        } catch (uploadError) {
                            console.error('❌ Erreur upload image par défaut:', uploadError);
                            toast.error('Impossible d\'uploader la photo par défaut');
                            return;
                        }

                        dto = {
                            type: 'Physical',
                            firstName: data.firstName,
                            lastName: data.lastName,
                            address: data.address,
                            email: data.email,
                            image: defaultImageBlobName,
                            phoneInformation: {
                                number: data.phoneNumber,
                                region: 'CI',
                            },
                        };
                    } else {
                        // Legal : Vérifier upload
                        if (!uploadedMediaId || uploadedMediaId.trim() === '') {
                            toast.error('Veuillez uploader le logo de l\'entreprise');
                            return;
                        }

                        dto = {
                            type: 'Legal',
                            name: data.name,
                            address: data.address,
                            email: data.email,
                            companyIdentificationNumber: data.companyIdentificationNumber,
                            image: uploadedMediaId,
                            contactInformation: {
                                firstName: data.contactFirstName,
                                lastName: data.contactLastName,
                                email: data.contactEmail,
                            },
                            phoneInformation: {
                                number: data.phoneNumber,
                                region: 'CI',
                            },
                        };
                    }

                    console.log('📤 CREATE DTO:', dto);
                    const result = await createCustomer(dto);

                    if (result?.error) {
                        toast.error(result.error);
                        return;
                    }

                    toast.success('Client créé avec succès !');
                    router.push(paths.admin.GESTION_CLIENT.root);
                }
                // ==========================================
                // MODE ÉDITION
                // ==========================================
                else {
                    // Vérifier que customer existe (TypeScript)
                    if (!customer) {
                        toast.error('Erreur : données client manquantes');
                        return;
                    }

                    // Construire le DTO UPDATE (ne contient que les champs modifiés)
                    if (data.type === 'Physical') {
                        // Physical UPDATE
                        const updateDto = {
                            type: 'Physical' as const,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            address: data.address,
                            email: data.email,
                            // Image : seulement si nouvelle uploadée
                            ...(hasUploadedNewImage && { image: uploadedMediaId }),
                            phoneInformation: {
                                number: data.phoneNumber,
                                region: 'CI',
                            },
                        };

                        console.log('📤 UPDATE Physical DTO:', updateDto);
                        const result = await updateCustomer(customer.id, updateDto);

                        if (result?.error) {
                            toast.error(result.error);
                            return;
                        }

                        toast.success('Client modifié avec succès !');
                        router.refresh(); // ✅ Force le rechargement des Server Components
                        router.push(paths.admin.GESTION_CLIENT.root);
                    } else {
                        // Legal UPDATE
                        // Vérifier si nouvelle image uploadée
                        if (hasUploadedNewImage && (!uploadedMediaId || uploadedMediaId.trim() === '')) {
                            toast.error('Erreur : image uploadée manquante');
                            return;
                        }

                        const updateDto = {
                            type: 'Legal' as const,
                            name: data.name,
                            address: data.address,
                            email: data.email,
                            companyIdentificationNumber: data.companyIdentificationNumber,
                            // Image : seulement si nouvelle uploadée
                            ...(hasUploadedNewImage && { image: uploadedMediaId }),
                            contactInformation: {
                                firstName: data.contactFirstName,
                                lastName: data.contactLastName,
                                email: data.contactEmail,
                            },
                            phoneInformation: {
                                number: data.phoneNumber,
                                region: 'CI',
                            },
                        };

                        console.log('📤 UPDATE Legal DTO:', updateDto);
                        console.log('📤 UPDATE Legal DTO:', updateDto);
                        console.log('📤 IMAGE dans DTO ?', 'image' in updateDto); // ✅ Vérifie si le champ existe
                        console.log('📤 Valeur IMAGE:', updateDto.image); // ✅ Affiche la valeur
                        const result = await updateCustomer(customer.id, updateDto);

                        if (result?.error) {
                            toast.error(result.error);
                            return;
                        }

                        toast.success('Client modifié avec succès !');
                        router.refresh(); // ✅ Force le rechargement des Server Components
                        router.push(paths.admin.GESTION_CLIENT.root);
                    }
                }
            } catch (error) {
                console.error('❌ Erreur:', error);
                toast.error(isEditMode ? 'Erreur lors de la modification' : 'Erreur lors de la création');
            }
        },
        (errors) => {
            console.log('❌ FORM VALIDATION ERRORS:', errors);
            toast.error('Veuillez corriger les erreurs dans le formulaire');
        }
    );

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card >

                        {/* {clientType === 'Personne physique' ? (
                            <ProfilePictureCard />
                        ) : (
                            <Box sx={{ mb: 5, pt: 10, pb: 5, px: 3, height: 375 }}>
                                <Field.UploadLogo
                                    name="logo"
                                    maxSize={3145728}
                                    helperText={
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                mt: 3,
                                                mx: 'auto',
                                                display: 'block',
                                                textAlign: 'center',
                                                color: 'text.disabled',
                                            }}
                                        >
                                            Formats autorisés *.jpeg, *.jpg, *.png, *.gif
                                            <br /> La taille maximale est de {fData(5242880)}
                                        </Typography>
                                    }
                                />
                            </Box>
                        )} */}

                        {clientType === 'Physical' ? (
                            <ProfilePictureCard imageSrc={customer?.image || img} />
                        ) : (
                            <Box sx={{ mb: 5, pt: 10, pb: 5, px: 3, height: 375 }}>
                                <Field.UploadLogo
                                    name="image"
                                    maxSize={3145728}
                                    disabled={isUploadingImage}
                                    // ✅ AJOUTER : Afficher l'image existante en mode édition
                                    thumbnail={isEditMode && !!customer?.image}
                                    onDrop={(acceptedFiles) => {
                                        const file = acceptedFiles[0];
                                        if (file) {
                                            handleImageUpload(file);
                                        }
                                    }}
                                    helperText={
                                        <>
                                            {/* ✅ AJOUTER : Message en mode édition */}
                                            {isEditMode && customer?.image && !hasUploadedNewImage && (
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        mt: 2,
                                                        mx: 'auto',
                                                        display: 'block',
                                                        textAlign: 'center',
                                                        color: 'success.main',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    ✓ Logo actuel. Glissez une nouvelle image pour le remplacer.
                                                </Typography>
                                            )}

                                            {isUploadingImage && (
                                                <Box sx={{ mt: 2, mb: 2 }}>
                                                    <LinearProgress variant="determinate" value={uploadProgress} />
                                                    <Typography
                                                        variant="caption"
                                                        sx={{ textAlign: 'center', display: 'block', mt: 1 }}
                                                    >
                                                        Upload en cours... {uploadProgress}%
                                                    </Typography>
                                                </Box>
                                            )}
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    mt: 3,
                                                    mx: 'auto',
                                                    display: 'block',
                                                    textAlign: 'center',
                                                    color: 'text.disabled',
                                                }}
                                            >
                                                Formats autorisés *.jpeg, *.jpg, *.png, *.gif
                                                <br /> La taille maximale est de {fData(3145728)}
                                            </Typography>
                                        </>
                                    }
                                />
                            </Box>
                        )}
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{ p: 3 }}>
                        {/* <Field.Select
                            fullWidth
                            label="Type de client"
                            name="isMoralePerson"
                            onChange={(e) => setClientType(e.target.value as 'Personne physique' | 'Personne morale')}
                            value={clientType}
                            slotProps={{
                                select: { native: true },
                                inputLabel: { shrink: true },
                            }}
                            sx={{ marginBottom: 3, borderBottom: 'dashed 1px #cccdcf', pb: 2 }}
                        >
                            {CLIENT_OPTIONS.map((i) => (
                                <option key={i.label} value={i.label}>
                                    {i.label}
                                </option>
                            ))}
                        </Field.Select> */}

                        <Field.Select
                            fullWidth
                            label="Type de client"
                            name="type"
                            onChange={handleClientTypeChange}
                            value={clientType}
                            disabled={isEditMode} // ✅ AJOUTER : Désactiver en mode édition
                            slotProps={{
                                select: { native: true },
                                inputLabel: { shrink: true },
                            }}
                            sx={{ marginBottom: 3, borderBottom: 'dashed 1px #cccdcf', pb: 2 }}
                        >
                            {CLIENT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Field.Select>

                        <Box
                            sx={{
                                rowGap: 3,
                                columnGap: 2,
                                display: 'grid',
                                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                            }}
                        >
                            {/* Client type specific fields */}
                            {/* {clientType === 'Personne physique' ? (
                                <>
                                    <Field.Text
                                        name="company_name"
                                        label="Nom"
                                        // sx={{ gridColumn: { xs: 'span 2' } }}
                                    />
                                    <Field.Text
                                        name="company_name"
                                        label="Prénoms"
                                        // sx={{ gridColumn: { xs: 'span 2' } }}
                                    />
                                    <Field.Text
                                        name="address"
                                        label="Lieu d'habitation"
                                        // sx={{ gridColumn: { xs: 'span 2' } }}
                                    />
                                    <Field.Text
                                        name="email"
                                        label="Adresse email"
                                        // sx={{ gridColumn: { xs: 'span 2' } }}
                                    />
                                    <Field.Phone
                                        name="phoneNumber"
                                        label="Numéro de téléphone mobile"
                                        // sx={{ gridColumn: { xs: 'span 2' } }}
                                        country="CI"
                                    />
                                </>
                            ) : ( */}
                            {clientType === 'Physical' ? (
                                <>
                                    <Field.Text
                                        name="lastName"
                                        label="Nom"
                                    />
                                    <Field.Text
                                        name="firstName"
                                        label="Prénoms"
                                    />
                                    <Field.Text
                                        name="address"
                                        label="Lieu d'habitation"
                                        sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}
                                    />
                                    <Field.Text
                                        name="email"
                                        label="Adresse email"
                                    />
                                    <Field.Phone
                                        name="phoneNumber"
                                        label="Numéro de téléphone mobile"
                                        country="CI"
                                    />
                                </>
                            ) : (
                                // <>
                                //     <Field.Text name="company_name" label="Nom de l'entreprise" />
                                //     <Field.Text
                                //         name="address"
                                //         label="Adresse de l'entreprise"

                                //     />
                                //     <Field.Text name="contact_name" label="Nom du correspondant" />
                                //     <Field.Text name="contact_firstname" label="Prénoms du correspondant" />
                                //     <Field.Text name="email" label="Email du correspondant" />
                                //     <Field.Text name="num_identification" label="Numéro d'identification de l'entreprise" />
                                //     <Field.Phone
                                //         name="phoneNumber"
                                //         label="Numéro de téléphone mobile du correspondant"
                                //         country="CI"
                                //     />
                                // </>

                                <>
                                    <Field.Text
                                        name="name"
                                        label="Nom de l'entreprise"
                                        sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}
                                    />
                                    <Field.Text
                                        name="address"
                                        label="Adresse de l'entreprise"
                                        sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}
                                    />
                                    <Field.Text
                                        name="email"
                                        label="Email de l'entreprise"
                                        sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}
                                    />
                                    <Field.Text name="contactLastName" label="Nom du correspondant" />
                                    <Field.Text name="contactFirstName" label="Prénoms du correspondant" />
                                    <Field.Text name="contactEmail" label="Email du correspondant" />
                                    <Field.Text
                                        name="companyIdentificationNumber"
                                        label="Numéro d'identification de l'entreprise"
                                    />
                                    <Field.Phone
                                        name="phoneNumber"
                                        label="Numéro de téléphone mobile du correspondant"
                                        country="CI"
                                        sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}
                                    />
                                </>
                            )}
                        </Box>

                        <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
                            {/* <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                {!item ? 'Créer client' : 'Sauvegarder les modifications'}
                            </LoadingButton> */}
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={isSubmitting || isUploadingImage}
                            >
                                {isEditMode ? 'Sauvegarder les modifications' : 'Créer client'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </Form>
    );
}
// const img = '/assets/images/mock/user/utilisateur.png'
const img = '/assets/images/mock/user/user.png'
// const img = user?.photoURL;
const ProfilePictureCard = ({ imageSrc = img, alt = "Profile Picture", size = 144 }) => (
    <Card className="flex flex-col items-center pt-20  pb-5 px-3 shadow-none border-none h-[415px]">

        <div
            className="relative overflow-hidden rounded-full "
            style={{
                width: size,
                height: size
            }}
        >
            {imageSrc ? (
                <img
                    src={imageSrc}
                    alt={alt}
                    className="w-full h-full object-cover mx-auto"
                />
            ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg
                        className="h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>

                </div>
            )}
        </div>
        <p className=" flex mt-8 mx-auto text-center text-xs text-gray-400">
            Cette image ne peut être modifiée.
        </p>
    </Card>
);



