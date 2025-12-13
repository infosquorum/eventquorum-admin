
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

import { primary } from 'src/theme';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import { IOrganizerItem } from 'src/types/organizer';

import OrganizerQuickEditForm from './organizer-quick-edit-form';

// import { UserQuickEditForm } from './user-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
    row: IOrganizerItem;
    selected: boolean;
    editHref: string;
    onSelectRow: () => void;
    onDeleteRow: () => void;
};

export function OrganizerTableRow({ row, selected, editHref, onSelectRow, onDeleteRow }: Props) {
    const menuActions = usePopover();
    const confirmDialog = useBoolean();
    const quickEditForm = useBoolean();
    const isForbidden = useBoolean();

    const avatarColors = [
        '#1976d2', // blue
        '#2e7d32', // green
        '#d32f2f', // red
        '#ed6c02', // orange
        '#9c27b0', // purple
        '#0288d1', // light blue
    ];

    const renderQuickEditForm = () => (
        <OrganizerQuickEditForm
            open={quickEditForm.value}
            onClose={quickEditForm.onFalse}
            currentOrganizer={row}
        />
    );



    const renderMenuActions = () => (
        <CustomPopover
            open={menuActions.open}
            anchorEl={menuActions.anchorEl}
            onClose={menuActions.onClose}
            slotProps={{ arrow: { placement: 'right-top' } }}
        >
            <MenuList>
                <li>
                    <MenuItem
                        component={RouterLink}
                        href={editHref}
                        onClick={() => menuActions.onClose()}
                        sx={{
                            color: row.status === 'active' ? 'warning.main' : 'info.main',
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
            content="Êtes vous sûr de vouloir supprimer?"
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

                <TableCell>
                    <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                        <Avatar alt={`${row.name}`}>
                            {row.name
                                .split(' ') // Divise le nom complet en un tableau de mots
                                .map(word => word.charAt(0)) // Récupère la première lettre de chaque mot
                                .join('') // Combine les initiales
                                .toUpperCase()} {/* Met les lettres en majuscules */}
                        </Avatar>
                    </Box>
                </TableCell>

                <TableCell >
                    <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                        <Link
                            component={RouterLink}
                            href={editHref}
                            color="inherit"
                            sx={{ cursor: 'pointer' }}
                        >
                            {row.name}
                        </Link>
                    </Stack></TableCell>

                {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.surname}</TableCell> */}

                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.email}</TableCell>

                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.phoneNumber}</TableCell>
                {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.password}</TableCell> */}

                <TableCell>
                    <Label
                        variant="soft"
                        color={
                            (row.status === 'active' && 'info') ||
                            'error'
                        }
                    >
                        {row.status === 'active' ? 'Actif' : 'Suspendu'}
                    </Label>
                </TableCell>

                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* <Tooltip title="Interdire" placement="top" arrow>
                            <IconButton
                                color={isForbidden.value == true ? 'error' : 'default'}
                                onClick={isForbidden.onFalse}
                            >
                                <Iconify icon="solar:forbidden-circle-line-duotone" />
                            </IconButton>
                        </Tooltip> */}
                        <Tooltip title="Modifier" placement="top" arrow>
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
