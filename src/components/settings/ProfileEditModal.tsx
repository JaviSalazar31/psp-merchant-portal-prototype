import { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ProfileEditModal({ open, onClose }: Props) {
  const user = useAuthStore(s => s.user);
  const updateUser = useAuthStore(s => s.updateUser);

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }
  }, [open, user]);

  if (!user) return null;

  const handleSave = async () => {
    if (!firstName.trim()) {
      toast.error('El nombre es obligatorio.');
      return;
    }
    setSaving(true);
    // Simulamos la actualización con un setTimeout — no hay backend real.
    await new Promise(r => setTimeout(r, 500));
    updateUser({ firstName: firstName.trim(), lastName: lastName.trim() });
    setSaving(false);
    toast.success('Datos personales actualizados.');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 2 } } }}>
      <DialogTitle sx={{ pr: 6 }}>
        Editar datos personales
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 0.5 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                backgroundColor: colors.brandPrimary,
                color: colors.brandDarkest,
                fontWeight: 700,
                fontSize: 22,
              }}
            >
              {(firstName[0] ?? '?').toUpperCase()}
              {(lastName[0] ?? '').toUpperCase()}
            </Avatar>
            <Stack spacing={0.25}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user.email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                El correo no se puede modificar desde acá.
              </Typography>
            </Stack>
          </Stack>

          <TextField
            label="Nombre"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            disabled={saving}
            required
          />
          <TextField
            label="Apellido"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            disabled={saving}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProfileEditModal;
