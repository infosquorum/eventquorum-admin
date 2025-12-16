//src/sections/planifierevent/event-new-edit-form.tsx

import type { IEvent } from 'src/types/event';
import type { Customer } from 'src/lib/customers/types';
import type { EventType } from 'src/lib/eventTypes/types';
import type { Organizer } from 'src/lib/organizers/types';
// ✅ Nouveaux imports
import LinearProgress from '@mui/material/LinearProgress';
import { mediaService } from 'src/lib/medias/service';
import { fData } from 'src/utils/format-number';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fIsAfter } from 'src/utils/format-time';

import { createEvent, updateEvent } from 'src/lib/events/actions';
import { customerService } from 'src/lib/customers/service';
import { eventTypesService } from 'src/lib/eventTypes/service';
import { organizerService } from 'src/lib/organizers/service';
import type { CreateEventDto, UpdateEventDto } from 'src/lib/events/types';
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from 'src/assets/icons/social-icons';
import { MenuItem, SvgIcon, SvgIconProps } from '@mui/material';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📋 SCHÉMA DE VALIDATION ZOD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Schéma de validation Zod pour un événement
 * 
 * Règles :
 * - ID optionnel (uniquement pour mode édition)
 * - Nom obligatoire
 * - Au moins 1 organisateur
 * - Client obligatoire avec infos complètes
 * - Type d'événement obligatoire
 * - Description entre 100 et 500 caractères
 * - Dates de début et fin obligatoires
 * - Date fin >= date début (événements d'une journée autorisés)
 * - Lieu obligatoire
 */
export const NewEventSchema = zod
  .object({
    id: zod.string().optional(), // ✅ ID optionnel pour mode édition
    name: zod.string().min(1, { message: "Le champ nom de l'évènement est requis!" }),

    // ✅ Logo événement (upload vers Azure Blob)
    logo: schemaHelper.file({ message: 'Le logo de l\'événement est requis!' }),

    organizer: zod
      .array(
        zod.object({
          id: zod.string(),
          firstName: zod.string(),
          lastName: zod.string(),
          email: zod.string(),
          phoneNumber: zod.string(),
        })
      )
      .min(1, { message: 'Doit avoir au moins un organisateur!' }),

    client: zod
      .object({
        id: zod.string(),
        name: zod.string(),
        type: zod.string(),
        email: zod.string().optional(),
        phoneNumber: zod.string().optional(),
      })
      .refine((client) => client.id && client.name, {
        message: 'Les informations du client sont manquantes!',
      }),

    description: schemaHelper
      .editor()
      .min(100, { message: 'Le contenu doit comporter au moins 100 caractères!' })
      .max(500, { message: 'Le contenu doit être inférieur à 500 caractères' }),

    type: zod.object({
      id: zod.string(),
      label: zod.string(),
    }).refine((type) => type.id && type.label, {
      message: 'Le type d\'évènement est requis!',
    }),

    available: zod.object({
      startDate: schemaHelper.date({ message: { required: 'La date de début est requise!' } }),
      endDate: schemaHelper.date({ message: { required: 'La date de fin est requise!' } }),
    }),

    location: zod.string().min(1, { message: 'Le champ lieu est requis!' }),
  })
  .refine((data) => {
    // ✅ Autoriser les dates égales (événement d'une journée)
    // Vérifie que endDate >= startDate
    const start = data.available.startDate;
    const end = data.available.endDate;

    if (!start || !end) return true;

    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    return endTime >= startTime; // >= au lieu de >
  }, {
    message: 'La date de fin ne peut pas être antérieure à la date de début!',
    path: ['available.endDate'],
  });

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


// type des items de réseaux sociaux
export type SocialMediaItem = {
  id: string
  name: string
  logo: SvgIconProps
  link: string
}

export const defaultSocialMediaItem: SocialMediaItem = {
  id: '',
  name: '',
  link: '',
  logo: {} as SvgIconProps,
};

export const socialMedia: SocialMediaItem[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    logo: <FacebookIcon />,
    link: ''
  },
  {
    id: 'instagram',
    name: 'Instagram',
    logo: <InstagramIcon />,
    link: ''
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    logo: <LinkedinIcon />,
    link: ''
  },
  {
    id: 'twitter',
    name: 'Twitter',
    logo: <TwitterIcon />,
    link: ''
  }
]

/**
 * Type inféré depuis le schéma Zod
 * 
 * L'ID est optionnel et inclus directement dans le schéma :
 * - undefined en mode création
 * - string en mode édition
 */
export type NewEventSchemaType = zod.infer<typeof NewEventSchema>;

/**
 * Extension du type formulaire avec l'image preview
 */
type EventFormDataWithImage = NewEventSchemaType & {
  logo?: File | null;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎯 PROPS DU COMPOSANT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type Props = {
  /**
   * Événement courant en mode édition
   * 
   * - undefined = Mode création
   * - Objet fourni = Mode édition (formulaire pré-rempli)
   */
  currentEvent?: NewEventSchemaType;
};

// Fichier continue dans la partie 2...
// Suite de la partie 1...

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎯 COMPOSANT PRINCIPAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function EventNewEditForm({ currentEvent }: Props) {
  const router = useRouter();

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📊 DÉTECTION DU MODE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Déterminer si on est en mode création ou édition
   * 
   * - true = Mode édition (currentEvent existe)
   * - false = Mode création (currentEvent undefined)
   */
  const isEdit = !!currentEvent;

  console.log(isEdit ? '📝 Mode ÉDITION' : '➕ Mode CRÉATION');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📦 ÉTATS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // ✅ États pour l'upload d'image
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadedMediaId, setUploadedMediaId] = useState<string>('');
  const [hasUploadedNewImage, setHasUploadedNewImage] = useState(false);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📋 VALEURS PAR DÉFAUT DU FORMULAIRE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Valeurs par défaut pour mode création
   * Ces valeurs sont remplacées par currentEvent en mode édition
   */
  const defaultValues: NewEventSchemaType = {
    name: '',
    logo: '',
    organizer: [],
    client: {
      id: '',
      name: '',
      type: '',
      email: '',
      phoneNumber: '',
    },
    type: {
      id: '',
      label: '',
    },
    description: '',
    available: {
      startDate: null,
      endDate: null,
    },
    location: '',
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎮 INITIALISATION REACT HOOK FORM
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const methods = useForm<NewEventSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewEventSchema),
    defaultValues,
    values: currentEvent, // ✅ Pré-remplit le formulaire en mode édition
  });

  const {
    reset,
    handleSubmit,
    setValue, // ✅ AJOUTER setValue
    formState: { isSubmitting },
  } = methods;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📖 CHARGEMENT DES DONNÉES DU BACKEND
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Charge les données nécessaires au formulaire
   * - Types d'événements (Salon, Gala, etc.)
   * - Clients (pour sélection autocomplete)
   * - Organisateurs (pour sélection autocomplete)
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);

        console.log('🔵 Chargement des données du formulaire...');

        const [typesData, customersData, organizersData] = await Promise.all([
          eventTypesService.getAll(),
          customerService.getAll({ pageSize: 1000 }),
          organizerService.getAll({ pageSize: 1000 }),
        ]);

        console.log('✅ Données chargées:', {
          types: typesData.length,
          customers: customersData.totalItems,
          organizers: organizersData.totalItems,
        });

        setEventTypes(typesData);
        setCustomers(customersData.items);
        setOrganizers(organizersData.items);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des données:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔧 HELPER : FORMATAGE DES DATES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Convertit tout type de date en ISO string pour l'API
   * 
   * Gère :
   * - Date objects natifs
   * - dayjs objects
   * - moment.js objects
   * - Strings ISO
   */
  const formatDate = (date: any): string => {
    if (!date) return '';
    if (date instanceof Date) return date.toISOString();
    if (typeof date.toISOString === 'function') return date.toISOString();
    if (typeof date === 'string') return new Date(date).toISOString();
    return new Date(date).toISOString();
  };


  /**
  * Handler pour l'upload du logo de l'événement
  */
  const handleLogoUpload = useCallback(async (file: File) => {
    try {
      setIsUploadingImage(true);

      const result = await mediaService.uploadImage({
        file,
        folder: 'Events',
        onProgress: setUploadProgress,
      });

      setUploadedMediaId(result.mediaId);
      setHasUploadedNewImage(true); // ✅ AJOUTER : Marquer qu'une nouvelle image a été uploadée
      setValue('logo', file);
      toast.success('Logo uploadé avec succès');
    } catch (error) {
      console.error('❌ Erreur upload logo:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur upload logo');
    } finally {
      setIsUploadingImage(false);
    }
  }, [setValue]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📤 SOUMISSION DU FORMULAIRE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Gestionnaire de soumission du formulaire
   * 
   * Workflow :
   * 1. Préparer le DTO (Data Transfer Object) pour l'API
   * 2. Détecter le mode (création vs édition)
   * 3. Appeler createEvent() ou updateEvent()
   * 4. Gérer le succès/erreur
   * 5. Rediriger vers la liste
   */
  const onSubmit = handleSubmit(async (data: NewEventSchemaType) => {
    try {

      // 1️⃣ VALIDATION DE L'IMAGE SELON LE MODE

      if (!isEdit) {
        // MODE CRÉATION : Image obligatoire
        if (!uploadedMediaId || uploadedMediaId.trim() === '') {
          toast.error('Veuillez uploader le logo de l\'événement');
          return;
        }
      } else {
        // MODE ÉDITION : Vérifier seulement si nouvelle image uploadée
        if (hasUploadedNewImage && (!uploadedMediaId || uploadedMediaId.trim() === '')) {
          toast.error('Erreur lors de l\'upload de la nouvelle image');
          return;
        }
      }

      // 2️⃣ PRÉPARER LE DTO SELON LE MODE

      let eventDto: CreateEventDto | UpdateEventDto;

      if (!isEdit) {
        // ✅ MODE CRÉATION : Image obligatoire
        const createDto: CreateEventDto = {
          customerId: data.client.id,
          organizerIds: data.organizer.map(org => org.id),
          eventTypeId: data.type.id,
          name: data.name,
          description: data.description,
          location: data.location,
          image: uploadedMediaId, // ✅ Toujours présent en mode création
          periodInformation: {
            start: formatDate(data.available.startDate),
            end: formatDate(data.available.endDate),
          },
        };
        eventDto = createDto;
      } else {
        // ✅ MODE ÉDITION : Image optionnelle
        const updateDto: UpdateEventDto = {
          customerId: data.client.id,
          organizerIds: data.organizer.map(org => org.id),
          eventTypeId: data.type.id,
          name: data.name,
          description: data.description,
          location: data.location,
          // ✅ Inclure image seulement si nouvelle uploadée
          ...(hasUploadedNewImage && { image: uploadedMediaId }),
          periodInformation: {
            start: formatDate(data.available.startDate),
            end: formatDate(data.available.endDate),
          },
        };
        eventDto = updateDto;
      }

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 2️⃣ APPELER L'API SELON LE MODE
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      let result;

      if (isEdit) {
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // MODE ÉDITION : Mettre à jour l'événement existant
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        if (!data.id) {
          toast.error('ID de l\'événement manquant');
          return;
        }

        console.log('🔄 Mise à jour event:', data.id, eventDto);
        result = await updateEvent(data.id, eventDto as UpdateEventDto);

      } else {
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // MODE CRÉATION : Créer un nouvel événement
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        console.log('➕ Création event:', eventDto);
        result = await createEvent(eventDto as CreateEventDto);
      }

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 3️⃣ GÉRER LA RÉPONSE
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      if (result?.error) {
        toast.error(result.error);
      } else {
        // Réinitialiser le formulaire (seulement en mode création)
        if (!isEdit) {
          reset();
        }

        // Message de succès adapté
        toast.success(
          isEdit
            ? 'Événement modifié avec succès!'
            : 'Événement créé avec succès!'
        );

        // Redirection vers la liste (avec setTimeout pour éviter NEXT_REDIRECT)
        setTimeout(() => {
          router.push(paths.admin.PLANIFIER_UN_EVENEMENT.root);
        }, 100);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la soumission:', error);

      // Détecter si c'est une erreur de navigation (à ignorer)
      const isNavigationError = error instanceof Error &&
        (error.message.includes('NEXT_REDIRECT') ||
          error.message.includes('navigation'));

      if (!isNavigationError) {
        toast.error(
          `Une erreur est survenue lors de la ${isEdit ? 'modification' : 'création'} de l'événement`
        );
      }
    }
  });



  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎨 RENDU : LOADER PENDANT CHARGEMENT DES DONNÉES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  if (isLoadingData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎨 RENDU : FORMULAIRE PRINCIPAL
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Affiche les champs du formulaire
   */
  const renderProperties = () => (
    <Card>
      <CardHeader
        title="Formulaire"
        subheader={`Remplissez le formulaire ${isEdit ? 'de modification' : 'de création'}`}
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* NOM DE L'ÉVÉNEMENT                                            */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Nom de l&apos;évènement</Typography>
          <Field.Text
            name="name"
            placeholder="Ex: SARA 2025, Forum Économique, Salon du Numérique..."
          />
        </Stack>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* CLIENT                                                         */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Client
          </Typography>

          <Field.Autocomplete
            name="client"
            placeholder="Sélectionnez le client"
            options={customers}
            getOptionLabel={(option) => {
              if (typeof option === 'string') return option;
              return (option as Customer).name || '';
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, customer) => (
              <li {...props} key={customer.id}>
                <Avatar
                  sx={{
                    mr: 1,
                    width: 32,
                    height: 32,
                    flexShrink: 0,
                    bgcolor: 'primary.main',
                  }}
                >
                  {customer.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body2">{customer.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {customerService.getTypeLabel(customer)}
                  </Typography>
                </Box>
              </li>
            )}
          />
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* ORGANISATEURS                                                  */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Organisateur(s) en charge
          </Typography>

          <Field.Autocomplete
            multiple
            name="organizer"
            placeholder="+ Organisateur"
            disableCloseOnSelect
            options={organizers}
            getOptionLabel={(option) => {
              if (typeof option === 'string') return option;
              return organizerService.formatDisplayName(option as Organizer);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, organizer) => (
              <li {...props} key={organizer.id}>
                <Avatar
                  sx={{
                    mr: 1,
                    width: 32,
                    height: 32,
                    flexShrink: 0,
                    bgcolor: 'success.main',
                  }}
                >
                  {organizerService.getInitials(organizer)}
                </Avatar>
                <Box>
                  <Typography variant="body2">
                    {organizerService.formatDisplayName(organizer)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {organizer.email}
                  </Typography>
                </Box>
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((organizer, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={organizer.id}
                  size="small"
                  variant="soft"
                  label={organizerService.formatDisplayName(organizer)}
                  avatar={
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      {organizerService.getInitials(organizer)}
                    </Avatar>
                  }
                />
              ))
            }
          />
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* TYPE D'ÉVÉNEMENT                                               */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Type d&apos;évènement</Typography>
          <Field.Autocomplete
            name="type"
            placeholder="Sélectionnez un type d'évènement"
            options={eventTypes}
            getOptionLabel={(option) => {
              if (typeof option === 'string') return option;
              return (option as EventType).label || '';
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, eventType) => (
              <li {...props} key={eventType.id}>
                <Box>
                  <Typography variant="body2">{eventType.label}</Typography>
                  {eventType.description && (
                    <Typography variant="caption" color="text.secondary">
                      {eventType.description}
                    </Typography>
                  )}
                </Box>
              </li>
            )}
          />
        </Stack>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* PÉRIODE                                                        */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Période</Typography>
          <Box sx={{ gap: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            <Field.DatePicker name="available.startDate" label="Date de début" />
            <Field.DatePicker name="available.endDate" label="Date de fin" />
          </Box>
        </Stack>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* LIEU                                                           */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Lieu</Typography>
          <Field.Text
            name="location"
            placeholder="Ex: Parc des expositions, Hôtel Ivoire, Palais de la Culture..."
          />
        </Stack>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* DESCRIPTION                                                    */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Description</Typography>
          <Field.Editor
            name="description"
            placeholder="Décrivez votre événement (minimum 100 caractères, maximum 500)..."
          />
        </Stack>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* LOGO DE L'ÉVÉNEMENT                                            */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Logo de l&apos;événement</Typography>

          <Field.Upload
            name="logo"
            maxSize={5242880} // 5 MB
            disabled={isUploadingImage}
            onDrop={(acceptedFiles) => {
              const file = acceptedFiles[0];
              if (file) {
                handleLogoUpload(file);
              }
            }}
            helperText={
              <>
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
                  Formats autorisés *.jpeg, *.jpg, *.png, *.webp
                  <br /> Taille maximale de {fData(5242880)}
                </Typography>
              </>
            }
          />
        </Stack>
      </Stack>
    </Card>
  );

  /**
   * Bouton de soumission adapté au mode
   */
  const renderActions = () => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting || isUploadingImage} // ✅ Désactivé pendant upload
        disabled={isUploadingImage} // ✅ Désactivé si upload en cours
      >
        {isEdit ? 'Sauvegarder les modifications' : 'Créer évènement'}
      </LoadingButton>
    </Box>
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎯 RENDU FINAL
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderProperties()}
        {renderActions()}
      </Stack>
    </Form>
  );
}