import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

import { IOrganizerTableFilters } from 'src/types/organizer';

// ----------------------------------------------------------------------

type Props = {
    filters: {
        state: IOrganizerTableFilters;
        setState: (updateState: Partial<IOrganizerTableFilters>) => void;
        setField: (name: keyof IOrganizerTableFilters, updateValue: any) => void;
        resetState: VoidFunction;
    };
};

/**
 * Toolbar pour filtrer la liste des organisateurs
 */
export function OrganizerTableToolbar({ filters }: Props) {
    const { state, setField } = filters;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🔍 GESTION DU FILTRE PAR NOM
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const handleFilterName = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            // ✅ PAS BESOIN DE onResetPage ici car la recherche est locale
            setField('name', event.target.value);
        },
        [setField]
    );

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎨 RENDU DU TOOLBAR
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    return (
        <Stack
            spacing={2}
            alignItems={{ xs: 'flex-end', md: 'center' }}
            direction={{ xs: 'column', md: 'row' }}
            sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
        >
            {/* CHAMP DE RECHERCHE */}
            <TextField
                fullWidth
                value={state.name}
                onChange={handleFilterName}
                placeholder="Rechercher un organisateur..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                        </InputAdornment>
                    ),
                }}
                sx={{ maxWidth: { md: 360 } }}
            />
        </Stack>
    );
}