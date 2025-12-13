// import type { IUserItem } from 'src/types/user';
import { IClientItem } from 'src/types/client';

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
import { IEventType } from './view/type-list-view';
import TypeEditDialog from './type-edit-dialog';


// import { UserQuickEditForm } from './user-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
    row: IEventType;
    selected: boolean;
    editHref: string;
    onSelectRow: () => void;
    onDeleteRow: () => void;
};

export function TypeTableRow({ row, selected, editHref, onSelectRow, onDeleteRow }: Props) {
    const menuActions = usePopover();
    const confirmDialog = useBoolean();
    const quickEditForm = useBoolean();


    const renderQuickEditForm = () => (
    <TypeEditDialog
      data={row}
      open={quickEditForm.value}
      onSave={quickEditForm.onFalse}
      onClose={quickEditForm.onFalse}
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
                    <MenuItem component={RouterLink} href={editHref} onClick={() => menuActions.onClose()}>
                        <Iconify icon="solar:pen-bold" />
                        Modifier
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
                    <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                            {row.name}
                    </Stack>
                </TableCell>

                
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip title="Modifier" placement="top" arrow>
                            <IconButton
                                color={quickEditForm.value ? 'inherit' : 'default'}
                                onClick={quickEditForm.onTrue}
                            >
                                <Iconify icon="solar:pen-bold" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Modifier" placement="top" arrow>
                            <IconButton
                                color={'error'}
                                onClick={() => {
                                    confirmDialog.onTrue();
                                    menuActions.onClose();
                                }}
                                sx={{ color: 'error.main' }}
                            >
                                <Iconify icon="solar:trash-bin-trash-bold" />
                            </IconButton>
                        </Tooltip>

                        {/* <IconButton
                            color={menuActions.open ? 'inherit' : 'default'}
                            onClick={menuActions.onOpen}
                        >
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton> */}
                    </Box>
                </TableCell>
            </TableRow>

            {renderQuickEditForm()}
            {renderMenuActions()}
            {renderConfirmDialog()}
        </>
    );
}
