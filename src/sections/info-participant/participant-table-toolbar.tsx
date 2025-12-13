import type { IParticipantTableFilters } from 'src/types/participant';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseSetStateReturn } from 'minimal-shared/hooks';

import { useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type StatusOption = {
  value: string;
  label: string;
  color?: string;
};

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<IParticipantTableFilters>;
  statusOptions: StatusOption[];
  activeTab: string;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
};

export function ParticipantTableToolbar({ 
  filters, 
  statusOptions, 
  onResetPage, 
  activeTab,
}: Props) {

  const { state: currentFilters, setState: updateFilters } = filters;

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      updateFilters({ name: event.target.value });
    },
    [onResetPage, updateFilters]
  );

  const handleFilterStatus = useCallback(
    (event: SelectChangeEvent<string>) => {
      onResetPage();
      updateFilters({ status: event.target.value });
    },
    [onResetPage, updateFilters]
  );

  // Fonction pour obtenir le placeholder selon l'onglet actif
  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'demandes':
        return 'Rechercher une demande (nom, email)...';
      case 'invites':
        return 'Rechercher un invité (nom, email)...';
      case 'participants':
        return 'Rechercher un participant (nom, email)...';
      default:
        return 'Rechercher...';
    }
  };

  // Fonction pour obtenir le label du select selon l'onglet actif
  const getStatusLabel = () => {
    switch (activeTab) {
      case 'demandes':
        return 'Statut des demandes';
      case 'invites':
        return 'Statut des invités';
      case 'participants':
        return 'Statut des participants';
      default:
        return 'Statut';
    }
  };

  return (
    <>
      <Box
        sx={{
          p: 2.5,
          gap: 2,
          display: 'flex',
          pr: { xs: 2.5, md: 1 },
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-end', md: 'center' },
        }}
      >
        {/* Filtre par statut */}
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
          <InputLabel htmlFor="filter-status-select">{getStatusLabel()}</InputLabel>
          <Select
            value={currentFilters.status || 'all'}
            onChange={handleFilterStatus}
            input={<OutlinedInput label={getStatusLabel()} />}
            inputProps={{ id: 'filter-status-select' }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box
          sx={{
            gap: 2,
            width: 1,
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Champ de recherche */}
          <TextField
            fullWidth
            value={currentFilters.name || ''}
            onChange={handleFilterName}
            placeholder={getSearchPlaceholder()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </>
  );
}