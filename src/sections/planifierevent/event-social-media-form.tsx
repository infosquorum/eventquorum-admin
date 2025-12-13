import { useEffect, useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Iconify } from 'src/components/iconify';

import { Field } from 'src/components/hook-form';
import { defaultSocialMediaItem, socialMedia } from './event-new-edit-form';
import { MenuItem, SvgIcon, SvgIconProps } from '@mui/material';
// import { socialMedia } from 'src/_mock/social-media'; // Importez vos données de médias sociaux

// ----------------------------------------------------------------------

type SocialMediaItemProps = {
    index: number;
    onRemoveItem: () => void;
  };

export function SocialMediaForm() {
  const { control, setValue, getValues } = useFormContext();

  // Utilisez useFieldArray pour gérer une liste dynamique de médias sociaux
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialMediaItems', // Nom du champ dans le formulaire
  });

  // Ajouter un nouvel élément de média social
  const handleAddItem = () => {
    append(defaultSocialMediaItem);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Médias Sociaux:
      </Typography> */}

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => (
          <SocialMediaItem
            key={item.id}
            index={index}
            onRemoveItem={() => remove(index)}
          />
        ))}
      </Stack>

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      <Button
        size="small"
        color="primary"
        startIcon={<Iconify icon="mingcute:add-line" />}
        onClick={handleAddItem}
        sx={{ flexShrink: 0 }}
      >
        Ajouter un réseau social
      </Button>
    </Box>
  );
}

export function SocialMediaItem({ index, onRemoveItem }: SocialMediaItemProps) {
    const { setValue, getValues } = useFormContext();
  
    // Récupérer les valeurs actuelles
    const name = getValues(`socialMediaItems[${index}].name`);
    const logo = getValues(`socialMediaItems[${index}].logo`);
    const link = getValues(`socialMediaItems[${index}].link`);
  
    // Mettre à jour le logo lorsqu'un média social est sélectionné
    const handleSelectSocialMedia = useCallback(
      (selectedName: string) => {
        const selectedMedia = socialMedia.find((media) => media.name === selectedName);
        if (selectedMedia) {
          setValue(`socialMediaItems[${index}].name`, selectedMedia.name);
          setValue(`socialMediaItems[${index}].logo`, selectedMedia.logo);
        }
      },
      [index, setValue]
    );
  
    return (
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          alignItems: 'flex-end',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            gap: 2,
            width: 1,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Field.Select
            size="small"
            name={`socialMediaItems[${index}].name`}
            label="Réseau social"
            onChange={(e) => handleSelectSocialMedia(e.target.value)}
          >
            {socialMedia.map((media) => (
              <MenuItem key={media.id} value={media.name}>
                {media.name}
              </MenuItem>
            ))}
          </Field.Select>
          <Field.Text
            size="small"
            name={`socialMediaItems[${index}].link`}
            label="Lien"
            placeholder="https://example.com"
          />
        </Box>
  
        <Button
          size="small"
          color="error"
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          onClick={onRemoveItem}
        >
          Supprimer
        </Button>
      </Box>
    );
  }