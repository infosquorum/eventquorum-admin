import type { DialogProps } from '@mui/material/Dialog';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { toast } from 'src/components/snackbar';

// ✅ Import API
import { createEventType } from 'src/lib/eventTypes/actions';

// ----------------------------------------------------------------------

type Props = DialogProps & {
  open: boolean;
  onClose: () => void;
  onRefresh: () => Promise<void>;
};

export function TypeNewDialog({ open, onClose, onRefresh, ...other }: Props) {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!label.trim()) {
      toast.error('Le label est requis');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createEventType({
        label: label.trim(),
        description: description.trim() || null,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Type créé avec succès');
      await onRefresh();
      handleClose();
    } catch (error) {
      console.error('Erreur création type:', error);
      toast.error('Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setLabel('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose} {...other}>
      <DialogTitle>Ajouter un type d'événement</DialogTitle>

      <Box sx={{ px: 3, pb: 3 }}>
        <TextField
          fullWidth
          label="Label *"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ex: Conférence, Atelier, Gala..."
          sx={{ mb: 2 }}
          disabled={isSubmitting}
        />

        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description optionnelle..."
          multiline
          rows={3}
          disabled={isSubmitting}
        />
      </Box>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button variant="outlined" color="inherit" onClick={handleClose} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!label.trim() || isSubmitting}
          startIcon={isSubmitting && <CircularProgress size={20} />}
        >
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}