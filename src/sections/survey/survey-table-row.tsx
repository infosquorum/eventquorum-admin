// src/sections/survey/survey-table-row.tsx

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ISurveyItem } from 'src/types/survey';

// ----------------------------------------------------------------------

type Props = {
  row: ISurveyItem;
  onViewDetails: () => void;
};

export function SurveyTableRow({ row, onViewDetails }: Props) {
  
  // Couleurs corrigées selon vos spécifications
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'En cours':
        return 'warning'; // Jaune
      case 'Terminé':
        return 'success'; // Vert
      case 'Non démarré':
        return 'error'; // Rouge
      default:
        return 'default';
    }
  };

  const getParticipationColor = (statut: string) => {
    switch (statut) {
      case 'Participer':
        return 'success'; // Vert
      case 'Non participer':
        return 'error'; // Rouge
      default:
        return 'default';
    }
  };

  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {row.titre_enquete}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {row.date}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {row.date_expiration}
        </Typography>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={getStatusColor(row.statut)}
        >
          {row.statut}
        </Label>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={getParticipationColor(row.statut_participation)}
        >
          {row.statut_participation}
        </Label>
      </TableCell>

      <TableCell align="center">
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {row.note}
        </Typography>
      </TableCell>

      <TableCell align="center">
        <Tooltip title="Voir détails" placement="top" arrow>
          <IconButton
            onClick={onViewDetails}
            color="info"
            size="small"
          >
            <Iconify icon="solar:eye-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}