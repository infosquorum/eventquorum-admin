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

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import { IOrganizerItem } from 'src/types/organizer';

import OrganizerQuickEditForm from './organizer-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
    row: IOrganizerItem;
    selected: boolean;
    editHref: string;
    onSelectRow: () => void;
    onDeleteRow: () => void;
    onToggleStatus?: () => void;
    onSuccess?: () => void;  // ✅ Callback pour rafraîchir la liste
};

export function OrganizerTableRow({ 
    row, 
    selected, 
    editHref, 
    onSelectRow, 
    onDeleteRow,
    onToggleStatus,
    onSuccess  // ✅ Nouveau prop
}: Props) {
    const menuActions = usePopover();
    const confirmDialog = useBoolean();
    const quickEditForm = useBoolean();

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🔗 LIEN VERS LA PAGE DE DÉTAILS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const detailsHref = paths.admin.PLANIFIER_UN_EVENEMENT.detailorganisateur
        ? paths.admin.PLANIFIER_UN_EVENEMENT.detailorganisateur(row.id)
        : `/admin/planifier-evenement/organisateur/${row.id}`;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎨 RENDU DU FORMULAIRE D'ÉDITION RAPIDE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const renderQuickEditForm = () => (
        <OrganizerQuickEditForm
            open={quickEditForm.value}
            onClose={quickEditForm.onFalse}
            // ✅ PASSER LES DONNÉES BRUTES (_raw) POUR AVOIR TOUS LES CHAMPS
            currentOrganizer={row._raw}
            // ✅ Callback pour rafraîchir la liste après modification
            onSuccess={onSuccess}
        />
    );

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎨 RENDU DU MENU D'ACTIONS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const renderMenuActions = () => (
        <CustomPopover
            open={menuActions.open}
            anchorEl={menuActions.anchorEl}
            onClose={menuActions.onClose}
            slotProps={{ arrow: { placement: 'right-top' } }}
        >
            <MenuList>
                {/* ACTION : VOIR DÉTAILS */}
                <MenuItem
                    component={RouterLink}
                    href={detailsHref}
                    onClick={menuActions.onClose}
                >
                    <Iconify icon="solar:eye-bold" />
                    Voir détails
                </MenuItem>

                {/* ACTION : SUSPENDRE / ACTIVER (si disponible) */}
                {onToggleStatus && (
                    <li>
                        <MenuItem
                            onClick={() => {
                                onToggleStatus();
                                menuActions.onClose();
                            }}
                            sx={{
                                color: row.status === 'active' ? 'warning.main' : 'success.main',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <Iconify
                                icon={row.status === 'active'
                                    ? "solar:forbidden-circle-bold"
                                    : "solar:check-circle-bold"
                                }
                            />
                            {row.status === 'active' ? 'Suspendre' : 'Activer'}
                        </MenuItem>
                    </li>
                )}

                {/* ACTION : SUPPRIMER */}
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

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎨 RENDU DU DIALOG DE CONFIRMATION
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const renderConfirmDialog = () => (
        <ConfirmDialog
            open={confirmDialog.value}
            onClose={confirmDialog.onFalse}
            title="Supprimer"
            content={`Êtes-vous sûr de vouloir supprimer ${row.name} ?`}
            action={
                <Button variant="contained" color="error" onClick={onDeleteRow}>
                    Supprimer
                </Button>
            }
        />
    );

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎨 RENDU DE LA LIGNE DU TABLEAU
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    return (
        <>
            <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
                {/* CHECKBOX */}
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

                {/* AVATAR */}
                <TableCell>
                    <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                        <Avatar alt={row.name}>
                            {row.name
                                .split(' ')
                                .map(word => word.charAt(0))
                                .join('')
                                .toUpperCase()
                            }
                        </Avatar>
                    </Box>
                </TableCell>

                {/* NOM COMPLET - LIEN VERS DÉTAILS */}
                <TableCell>
                    <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                        <Link
                            component={RouterLink}
                            href={detailsHref}
                            color="inherit"
                            sx={{ 
                                cursor: 'pointer',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            {row.name}
                        </Link>
                    </Stack>
                </TableCell>

                {/* EMAIL */}
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.email}</TableCell>

                {/* TÉLÉPHONE */}
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.phoneNumber}</TableCell>

                {/* STATUT */}
                <TableCell>
                    <Label
                        variant="soft"
                        color={row.status === 'active' ? 'info' : 'error'}
                    >
                        {row.status === 'active' ? 'Actif' : 'Suspendu'}
                    </Label>
                </TableCell>

                {/* ACTIONS */}
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip title="Modifier rapidement" placement="top" arrow>
                            <IconButton
                                color={quickEditForm.value ? 'inherit' : 'default'}
                                onClick={quickEditForm.onTrue}
                            >
                                <Iconify icon="solar:pen-bold" />
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

            {renderQuickEditForm()}
            {renderMenuActions()}
            {renderConfirmDialog()}
        </>
    );
}