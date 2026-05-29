import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useAuthStore, type Language } from '@/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';
import {
  DATE_FORMAT_OPTIONS,
  NUMBER_FORMAT_OPTIONS,
  TIMEZONE_OPTIONS,
  type ProfileNotifications,
  type ProfilePreferences,
} from '@/mocks/profile';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';

function initialsOf(firstName: string, lastName: string): string {
  return `${firstName[0] ?? '?'}${lastName[0] ?? ''}`.toUpperCase();
}

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'pt-BR', label: 'Português (Brasil)' },
];

function CardSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack spacing={2.5}>
          <Stack spacing={0.5}>
            <Typography variant="h4">{title}</Typography>
            {description && (
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            )}
          </Stack>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

/**
 * Pantalla /account ("Mi cuenta") — consolida en una sola página todo lo del
 * usuario logueado: datos personales editables, preferencias de interfaz y
 * notificaciones por correo. Antes esto vivía en dos pantallas separadas
 * ("Mi perfil" + "Cuenta"). Se unificó en Fase 1 para reducir entradas del
 * menú del avatar y agrupar bajo el mismo concepto "lo mío como usuario".
 *
 * Los datos del comercio (legal, dirección, banco) NO van acá: viven en
 * /profile ("Información"), read-only y heredados del onboarding.
 */
export function UserAccountSettings() {
  const user = useAuthStore(s => s.user);
  const updateUser = useAuthStore(s => s.updateUser);
  const preferences = useProfileStore(s => s.preferences);
  const notifications = useProfileStore(s => s.notifications);
  const updatePreferences = useProfileStore(s => s.updatePreferences);
  const updateNotifications = useProfileStore(s => s.updateNotifications);
  const prefsSaving = useProfileStore(s => s.saving);

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

  const handlePrefChange = async <K extends keyof ProfilePreferences>(
    field: K,
    value: ProfilePreferences[K],
  ) => {
    await updatePreferences({ [field]: value } as Partial<ProfilePreferences>);
    toast.success('Preferencia guardada.');
  };

  const handleNotifToggle = async (field: keyof ProfileNotifications, checked: boolean) => {
    await updateNotifications({ [field]: checked });
    toast.success('Notificaciones actualizadas.');
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h1">Mi cuenta</Typography>
        <Typography variant="body1" color="text.secondary">
          Gestioná tus datos personales, preferencias y notificaciones.
        </Typography>
      </Stack>

      <CardSection title="Datos personales" description="Información de tu usuario en el portal.">
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

        <TextField
          label="Correo electrónico"
          value={user.email}
          fullWidth
          InputProps={{
            readOnly: true,
            endAdornment: (
              <Tooltip
                title="Por seguridad, el cambio de email debe solicitarse a soporte"
                placement="top-end"
              >
                <InfoOutlinedIcon
                  sx={{ fontSize: 18, color: colors.textMuted, cursor: 'help' }}
                  aria-label="Información sobre cambio de email"
                />
              </Tooltip>
            ),
          }}
          sx={{ '& .MuiInputBase-root': { backgroundColor: colors.bgSubtle } }}
        />

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
      </CardSection>

      <CardSection
        title="Preferencias"
        description="Cómo querés ver fechas, números e idioma de la interfaz."
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2.5,
          }}
        >
          <TextField
            select
            label="Idioma"
            value={preferences.language}
            onChange={e => handlePrefChange('language', e.target.value as Language)}
            disabled={prefsSaving}
          >
            {LANGUAGE_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Zona horaria"
            value={preferences.timezone}
            onChange={e => handlePrefChange('timezone', e.target.value)}
            disabled={prefsSaving}
          >
            {TIMEZONE_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Formato de fecha"
            value={preferences.dateFormat}
            onChange={e => handlePrefChange('dateFormat', e.target.value)}
            disabled={prefsSaving}
          >
            {DATE_FORMAT_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Formato de número"
            value={preferences.numberFormat}
            onChange={e => handlePrefChange('numberFormat', e.target.value)}
            disabled={prefsSaving}
          >
            {NUMBER_FORMAT_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </CardSection>

      <CardSection
        title="Notificaciones"
        description="Decidí qué eventos te llegan por correo a tu casilla."
      >
        <Stack spacing={1.25}>
          <FormControlLabel
            control={
              <Checkbox
                checked={notifications.transactionAuthorized}
                onChange={e => handleNotifToggle('transactionAuthorized', e.target.checked)}
                disabled={prefsSaving}
              />
            }
            label={
              <Stack spacing={0.25}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Transacciones autorizadas
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Te avisamos cada vez que se autoriza un pago.
                </Typography>
              </Stack>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={notifications.settlementProcessed}
                onChange={e => handleNotifToggle('settlementProcessed', e.target.checked)}
                disabled={prefsSaving}
              />
            }
            label={
              <Stack spacing={0.25}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Settlements procesados
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Confirmación cada vez que se acredita un settlement.
                </Typography>
              </Stack>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={notifications.dailySummary}
                onChange={e => handleNotifToggle('dailySummary', e.target.checked)}
                disabled={prefsSaving}
              />
            }
            label={
              <Stack spacing={0.25}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Resumen diario
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Mail con KPIs y novedades del día (se envía 8 a. m. hora local).
                </Typography>
              </Stack>
            }
          />
        </Stack>
      </CardSection>
    </Stack>
  );
}

export default UserAccountSettings;
