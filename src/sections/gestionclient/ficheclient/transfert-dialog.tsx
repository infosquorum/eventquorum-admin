import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
    Box
} from '@mui/material';
import { DialogProps } from '@mui/material/Dialog';
import { Iconify } from 'src/components/iconify';


// Type précis pour l'état booléen
export type OpenState = boolean;

// Interface de base pour les props de dialog
export interface BaseDialogProps extends Omit<DialogProps, 'open'> {
    open: OpenState;
    onClose: () => void;
}

// Types spécifiques aux dialogs
export interface TransfertDialogProps extends BaseDialogProps {
    initialAmount?: number;
    onTransfert?: (amount: number, method: PaymentMethod) => void;
}

export interface HistoriqueDialogProps extends BaseDialogProps {
    transfers?: Transfer[];
}

// Autres types précédemment définis restent les mêmes
export type PaymentMethod =
    | 'wave'
    | 'orange'
    | 'mtn'
    | 'moov'
    | 'card';

export interface Transfer {
    id?: string;
    date: string;
    amount: number;
    method: PaymentMethod;
    type: 'Entrée' | 'Sortie';
}

export const TransfertDialog: React.FC<TransfertDialogProps> = ({
    open,
    onClose,
    ...props
}) => {
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('');

    const paymentMethods = [
        { value: 'wave', label: 'Wave', icon: 'solar:dollar-bold' },
        { value: 'orange', label: 'Orange Money', icon: 'solar:dollar-bold' },
        { value: 'mtn', label: 'MTN Money', icon: 'solar:dollar-bold' },
        { value: 'moov', label: 'Moov Money', icon: 'solar:dollar-bold' },
        { value: 'card', label: 'Carte Bancaire', icon: 'solar:dollar-bold' }
    ];

    const handleTransfert = () => {
        // Logique de validation et de transfert
        if (amount && method) {
            console.log(`Transfert de ${amount} via ${method}`);
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Formulaire de Transfert</DialogTitle>

            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Montant"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Entrez le montant"
                    sx={{ mb: 2 }}
                />

                <FormControl fullWidth variant="outlined">
                    <InputLabel>Moyens de Paiement</InputLabel>
                    <Select
                        value={method}
                        label="Méthode de Paiement"
                        onChange={(e) => setMethod(e.target.value)}
                    >
                        {paymentMethods.map((pm) => (
                            <MenuItem key={pm.value} value={pm.value} >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Iconify icon={pm.icon} />
                                    {pm.label}
                                </Box>

                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Annuler
                </Button>
                <Button
                    onClick={handleTransfert}
                    color="primary"
                    variant="contained"
                    disabled={!amount || !method}
                >
                    Transférer
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TransfertDialog;