import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useApiKeysStore, type ApiKeyExpiration } from '@/stores/apiKeysStore';
import { toast } from '@/stores/toastStore';
import type { ApiKeyType, MockApiKey } from '@/mocks/apiKeys';
import { colors } from '@/theme/tokens';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (key: MockApiKey) => void;
}

const TYPE_OPTIONS: { value: ApiKeyType; label: string; description: string; disabled?: boolean }[] = [
  { value: 'publishable', label: 'Publishable', description: 'Para usar en frontend (web/mobile).' },
  { value: 'secret', label: 'Secret', description: 'Para usar en backend / server-to-server.' },
  {
    value: 'restricted',
    label: 'Restricted',
    description: 'Permisos granulares (disponible en próxima versión).',
    disabled: true,
  },
];

const EXPIRATION_OPTIONS: { value: ApiKeyExpiration; label: string }[] = [
  { value: '30d', label: '30 días' },
  { value: '90d', label: '90 días' },
  { value: '180d', label: '180 días' },
  { value: '365d', label: '365 días' },
];

export function CreateApiKeyModal({ open, onClose, onCreated }: Props) {
  const createKey = useApiKeysStore(s => s.createKey);
  const saving = useApiKeysStore(s => s.saving);

  const [name, setName] = useState('');
  const [type, setType] = useState<ApiKeyType>('publishable');
  const [expiration, setExpiration] = useState<ApiKeyExpiration>('90d');

  useEffect(() => {
    if (open) {
      setName('');
      setType('publishable');
      setExpiration('90d');
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('El nombre de la key es obligatorio.');
      return;
    }
    const newKey = await createKey({ name: name.trim(), type, expiration });
    toast.success('API Key creada correctamente.');
    onCreated(newKey);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 2, minWidth: { sm: 500 } } } }}>
      <DialogTitle sx={{ pr: 6 }}>
        Crear nueva API Key
        <IconButton aria-label="Cerrar" onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 0.5 }}>
          <TextField
            label="Nombre de la key"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={saving}
            required
            helperText="Usá un nombre descriptivo para identificar el uso (ej: «Backend producción»)."
          />

          <TextField
            select
            label="Tipo"
            value={type}
            onChange={e => setType(e.target.value as ApiKeyType)}
            disabled={saving}
          >
            {TYPE_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                <Stack spacing={0.25}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {opt.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                    {opt.description}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Expiración"
            value={expiration}
            onChange={e => setExpiration(e.target.value as ApiKeyExpiration)}
            disabled={saving}
          >
            {EXPIRATION_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Creando…' : 'Crear API Key'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateApiKeyModal;
