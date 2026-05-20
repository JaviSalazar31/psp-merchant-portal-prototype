import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';

function initialsOf(firstName: string, lastName: string): string {
  return `${firstName[0] ?? '?'}${lastName[0] ?? ''}`.toUpperCase();
}

/**
 * Pantalla /account — datos del usuario logueado. No incluye datos del comercio
 * (esos viven en /profile/wizard). Sólo el nombre y el apellido son editables.
 */
export function UserAccountSettings() {
  const user = useAuthStore(s => s.user);
  const updateUser = useAuthStore(s => s.updateUser);

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const trimmedFirst = firstName.trim();
  const trimmedLast = lastName.trim();
  const valid = trimmedFirst.length > 0 && trimmedLast.length > 0;
  const dirty = trimmedFirst !== user.firstName || trimmedLast !== user.lastName;

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    updateUser({ firstName: trimmedFirst, lastName: trimmedLast });
    setFirstName(trimmedFirst);
    setLastName(trimmedLast);
    setSaving(false);
    toast.success('Datos de tu usuario actualizados.');
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h1">Cuenta</Typography>
        <Typography variant="body1" color="text.secondary">
          Gestioná los datos de tu usuario.
        </Typography>
      </Stack>

      <Card>
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  fontSize: 22,
                  fontWeight: 700,
                  backgroundColor: colors.brandPrimary,
                  color: colors.brandDarkest,
                }}
              >
                {initialsOf(user.firstName, user.lastName)}
              </Avatar>
              <Stack spacing={0.25}>
                <Typography variant="h4">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Stack>
            </Stack>

            <Divider />

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              <TextField
                label="Nombre"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                error={!trimmedFirst}
                helperText={!trimmedFirst ? 'El nombre es obligatorio' : ' '}
              />
              <TextField
                label="Apellido"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                error={!trimmedLast}
                helperText={!trimmedLast ? 'El apellido es obligatorio' : ' '}
              />
            </Box>

            <Tooltip title="Para cambios, contactá a soporte" placement="top-start">
              <TextField
                label="Correo electrónico"
                value={user.email}
                fullWidth
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InfoOutlinedIcon sx={{ fontSize: 18, color: colors.textMuted }} />
                  ),
                }}
                helperText="Para cambios, contactá a soporte"
                sx={{ '& .MuiInputBase-root': { backgroundColor: colors.bgSubtle } }}
              />
            </Tooltip>

            <Box>
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                Rol
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={user.role}
                  size="small"
                  sx={{ fontWeight: 600, backgroundColor: colors.bgSubtle, color: colors.textPrimary }}
                />
              </Box>
            </Box>

            <Divider />

            <Stack direction="row" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                disabled={!dirty || !valid || saving}
                onClick={handleSave}
                startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
              >
                Guardar cambios
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default UserAccountSettings;
