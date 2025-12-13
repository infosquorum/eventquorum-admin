import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

import { fCurrency } from 'src/utils/format-number';
import { fFCFA } from 'src/utils/format-number';
import { useBoolean } from 'minimal-shared/hooks';
import { useCallback } from 'react';
import { Avatar, Dialog, DialogTitle, ListItemButton, ListItemText, MenuItem, Select, TextField } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import TransfertDialog from 'src/sections/gestionclient/ficheclient/transfert-dialog';
import HistoriqueDialog from 'src/sections/gestionclient/ficheclient/historique-dialog';

// ----------------------------------------------------------------------

type Props = CardProps & {
    title: string;
    received: number;
    refunded: number;
    currentBalance: number;
};

export function AdminCurrentBalance({
    sx,
    title,
    received,
    refunded,
    currentBalance,
    ...other
}: Props) {
    const row = (label: string, value?: number) => (
        <Box sx={{ display: 'flex', typography: 'body2', justifyContent: 'space-between' }}>
            <Box component="span" sx={{ color: 'text.secondary' }}>
                {label}
            </Box>

            <Box component="span">{fFCFA(value)}</Box>
        </Box>
    );

    const openDialog = useBoolean();
    const openHistoriqueDialog = useBoolean();

    const handleClose = useCallback(
        () => {
            openDialog.onFalse();
        },
        [openDialog]
    );

    const renderHistoriqueDialog = () => {
        return (
            <HistoriqueDialog 
              open={openHistoriqueDialog.value} 
              onClose={openHistoriqueDialog.onFalse} 
            />
        );
    }

    const renderTransfertDialog = () => {
        return (
            <TransfertDialog 
              open={openDialog.value} 
              onClose={openDialog.onFalse} 
            />
        );
    };


    return (
        <>
            <Card sx={[{ p: 3 }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
                <Box sx={{ mb: 1, typography: 'subtitle2' }}>{title}</Box>

                <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
                    {/* <Box sx={{ typography: 'h3' }}>{fCurrency(currentBalance)}</Box> */}
                    <Box sx={{ typography: 'h3' }}>{fFCFA(currentBalance)}</Box>

                    {/* {row('Evenements les plus rentables')} */}
                    {row('Montant total reçu', received)}
                    {row('Montant total retiré', refunded)}
                    {/* {row('Evenement 3', refunded)} */}


                    <Box sx={{ gap: 2, display: 'flex' }}>
                        <Button fullWidth variant="contained" color="warning" onClick={openHistoriqueDialog.onTrue}>
                            Historique
                        </Button>

                        <Button fullWidth variant="contained" color="inherit" onClick={openDialog.onTrue}>
                            Transfert
                        </Button>
                    </Box>
                </Box>
            </Card>
            {renderTransfertDialog()}
            {renderHistoriqueDialog()}
        </>

    );
}
