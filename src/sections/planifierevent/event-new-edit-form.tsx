import type { IEvent, IEventOrganizer, INewEventItem } from 'src/types/event';

import { z as zod } from 'zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FormControl, RadioGroup, Radio, SvgIconProps, MenuItem, Select, IconButton, Tooltip } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { fIsAfter } from 'src/utils/format-time';

import { _tags, _tourGuides } from 'src/_mock';
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from 'src/assets/icons/social-icons';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { SocialMediaForm } from './event-social-media-form';

// ----------------------------------------------------------------------

export type NewTourSchemaType = zod.infer<typeof NewTourSchema>;

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

// const getSocialsMedia = (index: number): Record<keyof typeof socialMedia, string> => ({
//   id: socialMedia[index].id,
//   name: socialMedia[index].name,
//   logo: socialMedia[index].logo,
// });

export const NewTourSchema = zod
  .object({
    name: zod.string().min(1, { message: "Le champ nom de l'évènement est requis!" }),
    logo: schemaHelper.file({ message: 'Choisissez une image!' }),
    organizer: zod
      .array(
        zod.object({
          id: zod.string(),
          name: zod.string(),
          avatarUrl: zod.string(),
          phoneNumber: zod.string(),
        })
      )
      .min(1, { message: 'Doit avoir au moins un organisateur!' }),
    client: zod
      .object({
        id: zod.string(),
        name: zod.string(),
        avatarUrl: zod.string(),
        phoneNumber: zod.string(),
      })
      .refine((client) => client.id && client.name, {
        message: 'Les informations du client sont manquantes!',
      }),
    description: schemaHelper
      .editor()
      .min(100, { message: 'Le contenu doit comporter au moins 100 caractères!' })
      .max(500, { message: 'Le contenu doit être inférieur à 500 caractères' }),
    type: zod.string().min(1, { message: 'Le type d\'évènement est requis!' }),
    available: zod.object({
      startDate: schemaHelper.date({ message: { required: 'La date de début est requise!' } }),
      endDate: schemaHelper.date({ message: { required: 'La date de fin est requise!' } }),
    }),
    barcoderegistration: zod.boolean(),
    qrcoderegistration: zod.boolean(),
    domain_type: zod.string().min(1, { message: 'Le type de domaine est requis!' }),
    domain_value: zod.string().optional(),
    location: zod.string().min(1, { message: 'Le champ lieu est requis!' }),
  })
  .refine((data) => !fIsAfter(data.available.startDate, data.available.endDate), {
    message: 'La date de fin ne peut pas etre plus tot que celle du debut!',
    path: ['available.endDate'],
  });

// ----------------------------------------------------------------------


type Props = {
  currentEvent?: IEvent;
};

const EVENT_TYPES = [
  { id: '1', name: 'Conférence' },
  { id: '2', name: 'Séminaire' },
  { id: '3', name: 'Formation' },
  { id: '4', name: 'Atelier' },
  { id: '5', name: 'Exposition' },
  { id: '6', name: 'Concert' },
  { id: '7', name: 'Gala' },
  { id: '8', name: 'Autre' },
];

export const TYPES_OF_DOMAINS = [
  { label: 'Domaine personnalisé', value: 'personalized' },
  { label: 'Domaine standard', value: 'standard' },
];


export function EventNewEditForm({ currentEvent }: Props) {
  const router = useRouter();

  const defaultValues: NewTourSchemaType = {
    name: '',
    logo: '',
    organizer: [],
    domain_type: 'standard',
    domain_value: '',
    client: {
      id: '',
      name: '',
      avatarUrl: '',
      phoneNumber: '',
    },
    type: '',
    description: '',
    available: {
      startDate: null,
      endDate: null,
    },
    barcoderegistration: false,
    qrcoderegistration: false,
    location: '',
  };

  const methods = useForm<NewTourSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewTourSchema),
    defaultValues,
    values: currentEvent as NewTourSchemaType,
  });

  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const domainType = watch('domain_type');

  const values = watch();

  const onSubmit = handleSubmit(async (data: NewTourSchemaType) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentEvent ? 'Mise à jour réussie!' : 'Création réussie!');
      router.push(paths.dashboard.tour.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      toast.error('Une erreur est survenue');
    }
  });

  const renderProperties = () => (
    <Card>
      <CardHeader
        title="Formulaire"
        subheader={`Remplissez le formulaire ${currentEvent ? 'de modification' : 'de création'}`}
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Nom de l&apos;évènement</Typography>
          <Field.Text name="name" placeholder="Ex: Adventure Seekers Expedition..." />
        </Stack>
        <div>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Client
          </Typography>

          <Field.Autocomplete
            name="client"
            placeholder="Sélectionnez le client"
            disableCloseOnSelect
            options={_tourGuides}
            // _tourGuides est le jeu de données fourni par le template
            getOptionLabel={(option) => (option as IEventOrganizer).name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, organizer) => (
              <li {...props} key={organizer.id}>
                <Avatar
                  key={organizer.id}
                  alt={organizer.avatarUrl}
                  src={organizer.avatarUrl}
                  sx={{
                    mr: 1,
                    width: 24,
                    height: 24,
                    flexShrink: 0,
                  }}
                />

                {organizer.name}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((organizer, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={organizer.id}
                  size="small"
                  variant="soft"
                  label={organizer.name}
                  avatar={<Avatar alt={organizer.name} src={organizer.avatarUrl} />}
                />
              ))
            }
          />
        </div>
        <div>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Organisateur(s) en charge
          </Typography>

          <Field.Autocomplete
            multiple
            name="organizer"
            placeholder="+ Organisateur"
            disableCloseOnSelect
            options={_tourGuides}
            getOptionLabel={(option) => (option as IEventOrganizer).name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, organizer) => (
              <li {...props} key={organizer.id}>
                <Avatar
                  key={organizer.id}
                  alt={organizer.avatarUrl}
                  src={organizer.avatarUrl}
                  sx={{
                    mr: 1,
                    width: 24,
                    height: 24,
                    flexShrink: 0,
                  }}
                />

                {organizer.name}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((organizer, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={organizer.id}
                  size="small"
                  variant="soft"
                  label={organizer.name}
                  avatar={<Avatar alt={organizer.name} src={organizer.avatarUrl} />}
                />
              ))
            }
          />
        </div>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Periode</Typography>
          <Box sx={{ gap: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            <Field.DatePicker name="available.startDate" label="Date de début" />
            <Field.DatePicker name="available.endDate" label="Date de fin" />
          </Box>
        </Stack>

        <Stack spacing={1.5}>

          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
            <Field.Autocomplete
              name="type"
              placeholder="Sélectionnez un type d'évènement" 
              options={EVENT_TYPES}
              getOptionLabel={(option) => {
                if (typeof option === 'string') return option;
                return option?.name || '';
              }}
              isOptionEqualToValue={(option, value) => {
                if (typeof value === 'string') return option.name === value;
                return option.name === value?.name;
              }}
              onChange={(_, newValue) => {
                methods.setValue('type', newValue?.name || '');
              }}
              sx={{ flex: 1 }}
            />

            <Tooltip title="Ajouter un nouveau type">
              <IconButton
                component={RouterLink}
                href={paths.admin.PLANIFIER_UN_EVENEMENT.type}
                sx={{ mb: 1 }}
              >
                <Iconify icon="mingcute:add-fill" />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>

        

        
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Types de domaines</Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={domainType}
              onChange={(e) => {
                methods.setValue('domain_type', e.target.value);
                if (e.target.value === 'standard') {
                  methods.setValue('domain_value', 'xxxxxxx.eventquorum.com');
                } else {
                  methods.setValue('domain_value', '');
                }
              }}
            >
              <Stack spacing={2}>
                <div>
                  <FormControlLabel
                    value="personalized"
                    control={<Radio />}
                    label="Domaine personnalisé"
                  />
                  {domainType === 'personalized' && (
                    <Field.Text
                      name="domain_value"
                      placeholder="domaineclient.com"
                      sx={{ ml: 4, width: '300px' }}
                    />
                  )}
                </div>

                <div>
                  <FormControlLabel value="standard" control={<Radio />} label="Domaine standard" />
                  {domainType === 'standard' && (
                    <Field.Text
                      name="domain_value"
                      placeholder="xxxxxxx.eventquorum.com"
                      disabled
                      sx={{ ml: 4, width: '300px' }}
                    />
                  )}
                </div>
              </Stack>
            </RadioGroup>
          </FormControl>
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Lieu</Typography>
          <Field.Text name="location" placeholder="Ex: Parc des expositions..." />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Gestion des participants</Typography>
          <div className=" grid p-1">
            <FormControlLabel
              control={
                <Field.Checkbox name="qrcoderegistration" label="Enregistrement par QR code" />
              }
              label=""
            />
            <FormControlLabel
              control={
                <Field.Checkbox name="barcoderegistration" label="Enregistrement par code barre" />
              }
              label=""
            />
          </div>
        </Stack>

      </Stack>
    </Card>
  );

  const renderSocialMedia = () => (
    <Card>
      <CardHeader
        title="Réseaux sociaux"
        // subheader="Remplissez le formulaire de création"
        sx={{ mb: 3 }}
      />
      <Stack spacing={1.5}>
        {/* <Typography variant="subtitle2">Réseaux sociaux</Typography> */}
        <SocialMediaForm />
      </Stack>
    </Card>
  )

  const renderActions = () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      {/* <FormControlLabel
                label="Publish"
                control={<Switch defaultChecked inputProps={{ id: 'publish-switch' }} />}
                sx={{ flexGrow: 1, pl: 3 }}
            /> */}

      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
        sx={{ ml: 2 }}
      >
        {!currentEvent ? 'Créer évènement' : 'Sauvegarder les changements'}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderProperties()}
        {renderSocialMedia()}
        {renderActions()}
      </Stack>
    </Form>
  );
}
