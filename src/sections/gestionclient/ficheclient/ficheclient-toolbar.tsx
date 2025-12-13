import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  backHref: string;
  editHref: string;
};

export function FicheClientToolbar({
  sx,
  backHref,
  editHref,
  ...other
}: Props) {

  return (
    <>
      <Box
        sx={[{ mb: 3, gap: 1.5, display: 'flex' }, ...(Array.isArray(sx) ? sx : [sx])]}
        {...other}
      >
        <Button
          component={RouterLink}
          // variant='contained'
          href={backHref}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        >
          Retour
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="Partager la fiche client">
            <IconButton component={RouterLink} href={editHref}>
              <Iconify icon="solar:multiple-forward-right-bold" />
            </IconButton>
          </Tooltip>

        <Tooltip title="Modifier">
          <IconButton component={RouterLink} href={editHref}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>

        
      </Box>
      <Box sx={{ mb: 3, gap: 1.5, display: 'flex', ml: 8 }}>
        <Typography variant='h4'>Fiche Client</Typography>
      </Box>
    </>
  );
}
