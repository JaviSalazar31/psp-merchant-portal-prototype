import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useApiKeysStore } from '@/stores/apiKeysStore';
import { toast } from '@/stores/toastStore';
import type { MockApiKey } from '@/mocks/apiKeys';

interface Props {
  open: boolean;
  apiKey: MockApiKey | null;
  onClose: () => void;
}

export function RenameApiKeyModal({ open, apiKey, onClose }: Props) {
  const renameKey = useApiKeysStore(s => s.renameKey);
  const saving = useApiKeysStore(s => s.saving);
  const [name, setName] = useState('');

  useEffect(() => {
    if (open && apiKey) setName(apiKey.name);
  }, [open, apiKey]);

  if (!apiKey) return null;

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('El nombre es obligatorio.');
      return;
    }
    await renameKey(apiKey.id, name.trim());
    toast.success('API Key renombrada.');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 2 } } }}>
      <DialogTitle sx={{ pr: 6 }}>
        Renombrar API Key
        <IconButton aria-label="Cerrar" onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 0.5 }}>
          <TextField
            label="Nombre"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={saving}
            required
            autoFocus
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RenameApiKeyModal;
