import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import { DialogProps } from '@mui/material/Dialog';
import { Iconify } from 'src/components/iconify';

interface Data {
  name: string;
  [key: string]: any;
}

interface TypeEditDialogProps extends Omit<DialogProps, 'onClose'> {
  open: boolean;
  onClose: () => void;
  onSave: (data: Data) => void;
  data: Data | null;
}

const TypeEditDialog: React.FC<TypeEditDialogProps> = ({ 
  open, 
  onClose, 
  onSave,
  data,
  ...other
}) => {
  const [typeValue, setTypeValue] = useState<string>('');

  useEffect(() => {
    if (data && open) {
      setTypeValue(data.name || '');
    }
  }, [data, open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypeValue(event.target.value);
  };

  const handleSave = () => {
    if (typeValue.trim() && data) {
      onSave({
        ...data,
        type: typeValue.trim()
      });
    }
    handleClose();
  };

  const handleClose = () => {
    setTypeValue('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      {...other}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Modifier le type
          <IconButton
            // edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Iconify icon='solar:close-bold' />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            value={typeValue}
            onChange={handleChange}
            placeholder="Type"
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!typeValue.trim()}
            sx={{ mx: -1.15, px: 2}}
          >
            Enregistrer
          </Button>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit" variant="outlined">
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TypeEditDialog;