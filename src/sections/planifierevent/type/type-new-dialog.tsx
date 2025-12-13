import type { IFileShared } from 'src/types/file';
import type { DialogProps } from '@mui/material/Dialog';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useState } from 'react';



// ----------------------------------------------------------------------
type Props = DialogProps & {
    open: boolean;
    onClose: () => void;
    onSave?: (type: string) => void;  
    initialType?: string; 
  };
  
  export function TypeNewDialog({
    open,
    onClose,
    onSave,
    initialType = '',  
    ...other
  }: Props) {
    const [typeValue, setTypeValue] = useState(initialType);
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTypeValue(event.target.value);
    };
  
    const handleSave = () => {
      if (typeValue.trim() && onSave) {
        onSave(typeValue);
    }
    setTypeValue('');  
    onClose();
};
  
    
    const handleClose = () => {
      setTypeValue('');
      onClose();
    };
  
    return (
      <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose} {...other}>
        <DialogTitle>Ajouter un type</DialogTitle>
  
        <Box sx={{ px: 3 }}>
          <TextField
            fullWidth
            value={typeValue}
            onChange={handleChange}
            placeholder="nouveau type"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      color="inherit"
                      variant="contained"
                      disabled={!typeValue.trim()} 
                      onClick={handleSave}
                      sx={{ mr: -0.75 }}
                    >
                      Enregistrer
                    </Button>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 2 }}
          />
        </Box>
  
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    );
  }