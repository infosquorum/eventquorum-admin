import type { IEventItem } from 'src/types/event';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { RouterLink } from 'src/routes/components';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
    row: IEventItem;
    selected: boolean;
    editHref: string;
    ficheClientHref?: string;
    detailEventHref?: string;
    onSelectRow: () => void;
    onDeleteRow: () => void;
    // ❌ RETIRÉ : onToggleStatus (changement de statut se fait ailleurs)
};

/**
 * Helper pour obtenir la couleur du statut
 * 
 * Statuts possibles (de eventService.getStatusLabel()):
 * - "Non démarré"
 * - "En cours" 
 * - "Terminé"
 * - "Suspendu"
 */
function getStatusColor(status: string): 'default' | 'primary' | 'success' | 'warning' | 'error' {
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus === 'terminé') return 'success';
    if (normalizedStatus === 'en cours') return 'primary';
    if (normalizedStatus === 'non démarré') return 'default';
    if (normalizedStatus === 'suspendu') return 'warning';
    
    return 'default';
}

export function EventTableRow({ 
    row, 
    selected, 
    editHref, 
    ficheClientHref, 
    detailEventHref, 
    onSelectRow, 
    onDeleteRow
}: Props) {
    const menuActions = usePopover();
    const confirmDialog = useBoolean();

    const renderMenuActions = () => (
        <CustomPopover
            open={menuActions.open}
            anchorEl={menuActions.anchorEl}
            onClose={menuActions.onClose}
            slotProps={{ arrow: { placement: 'right-top' } }}
        >
            <MenuList>
                <li>
                    <MenuItem component={RouterLink} href={editHref} onClick={() => menuActions.onClose()}>
                        <Iconify icon="solar:pen-bold" />
                        Modifier
                    </MenuItem>
                </li>

                {/* ❌ RETIRÉ : Option Suspendre/Réactiver */}
                {/* Le changement de statut d'un événement se fait ailleurs */}

                <MenuItem
                    onClick={() => {
                        confirmDialog.onTrue();
                        menuActions.onClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Supprimer
                </MenuItem>
            </MenuList>
        </CustomPopover>
    );

    const renderConfirmDialog = () => (
        <ConfirmDialog
            open={confirmDialog.value}
            onClose={confirmDialog.onFalse}
            title="Supprimer"
            content="Êtes vous sûr de vouloir supprimer cet événement?"
            action={
                <Button variant="contained" color="error" onClick={onDeleteRow}>
                    Supprimer
                </Button>
            }
        />
    );

    return (
        <>
            <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
                <TableCell padding="checkbox">
                    <Checkbox
                        checked={selected}
                        onClick={onSelectRow}
                        inputProps={{
                            id: `${row.id}-checkbox`,
                            'aria-label': `${row.id} checkbox`,
                        }}
                    />
                </TableCell>

                {/* Logo */}
                <TableCell>
                    <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                        <Avatar alt={row.logo} src={row.logo} />
                    </Box>
                </TableCell>

                {/* Matricule */}
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Link
                        component={RouterLink}
                        href={detailEventHref || '#'}
                        color="inherit"
                        sx={{ cursor: 'pointer' }}
                    >
                        {row.matricule}
                    </Link>
                </TableCell>

                {/* Nom de l'événement */}
                <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                    <Link
                        component={RouterLink}
                        href={detailEventHref || '#'}
                        color="inherit"
                        sx={{ cursor: 'pointer' }}
                    >
                        {row.name}
                    </Link>
                </TableCell>

                {/* ✅ Type d'événement (maintenant affiche correctement le label) */}
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.type}</TableCell>

                {/* Période */}
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.date}</TableCell>

                {/* Nom client */}
                <TableCell>
                    <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                        <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                            <Link
                                component={RouterLink}
                                href={ficheClientHref || '#'}
                                color="inherit"
                                sx={{ cursor: 'pointer' }}
                            >
                                {row.nomclient}
                            </Link>
                        </Stack>
                    </Box>
                </TableCell>

                {/* ✅ Statut avec couleurs corrigées */}
                <TableCell>
                    <Label
                        variant="soft"
                        color={getStatusColor(row.status)}
                    >
                        {row.status}
                    </Label>
                </TableCell>

                {/* Actions */}
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip title="Voir Détail" placement="top" arrow>
                            <IconButton
                                color="inherit"
                                component={RouterLink}
                                href={detailEventHref || '#'}
                            >
                                <Iconify icon="solar:eye-bold" />
                            </IconButton>
                        </Tooltip>

                        <IconButton
                            color={menuActions.open ? 'inherit' : 'default'}
                            onClick={menuActions.onOpen}
                        >
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                    </Box>
                </TableCell>
            </TableRow>

            {renderMenuActions()}
            {renderConfirmDialog()}
        </>
    );
}