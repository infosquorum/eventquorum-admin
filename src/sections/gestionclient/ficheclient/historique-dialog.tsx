import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';
import { DialogProps } from '@mui/material/Dialog';
import { HistoriqueDialogProps } from './transfert-dialog';
import { fFCFA } from 'src/utils/format-number';


export const HistoriqueDialog: React.FC<HistoriqueDialogProps> = ({ 
    open, 
    onClose, 
    ...props 
  }) => {
  // Exemple de données, à remplacer par vos vraies données
  const mockTransfers = [
    { date: '2024-01-15', amount: 5000, method: 'Wave' },
    { date: '2024-01-10', amount: 10000, method: 'Orange Money' },
    { date: '2024-01-05', amount: 7500, method: 'MTN Money' }
  ];




  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Historique des transactions</DialogTitle>
      
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Moyen de paiement</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockTransfers.map((transfer, index) => (
                <TableRow key={index}>
                  <TableCell>{transfer.date}</TableCell>
                  <TableCell>{fFCFA(transfer.amount)}</TableCell>
                  <TableCell>{transfer.method}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default HistoriqueDialog;