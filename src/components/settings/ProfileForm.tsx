import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
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
import ProfileEditModal from './ProfileEditModal';

// Las opciones de idioma actuales del sistema viven en el LanguageSelector flotante.
// La unificación queda agendada para la Fase 9 — mantenemos las mismas 3 opciones acá.
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

function fmtDate(d: Date): string {
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function ProfileForm() {
  const user = useAuthStore(s => s.user);
  const preferences = useProfileStore(s => s.preferences);
  const notifications = useProfileStore(s => s.notifications);
  const updatePreferences = useProfileStore(s => s.updatePreferences);
  const updateNotifications = useProfileStore(s => s.updateNotifications);
  const saving = useProfileStore(s => s.saving);

  const [editOpen, setEditOpen] = useState(false);

  if (!user) return null;

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

  const initials = `${user.firstName[0] ?? '?'}${user.lastName[0] ?? ''}`.toUpperCase();

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h1">Mi perfil</Typography>
        <Typography variant="body1" color="text.secondary">
          Gestioná tus datos personales, preferencias y notificaciones.
        </Typography>
      </Stack>

      <CardSection title="Datos personales">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2.5}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2.5} alignItems="center">
            <Avatar
              sx={{
                width: 80,
                height: 80,
                backgroundColor: colors.brandPrimary,
                color: colors.brandDarkest,
                fontWeight: 700,
                fontSize: 28,
              }}
            >
              {initials}
            </Avatar>
            <Stack spacing={0.5}>
              <Typography variant="h3">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                <Chip
                  label={user.role}
                  size="small"
                  sx={{
                    backgroundColor: colors.bgSubtle,
                    color: colors.textPrimary,
                    fontWeight: 600,
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  Miembro desde {fmtDate(new Date(user.createdAt))}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Button
            variant="outlined"
            startIcon={<EditOutlinedIcon fontSize="small" />}
            onClick={() => setEditOpen(true)}
          >
            Editar
          </Button>
        </Stack>
      </CardSection>

      <CardSection title="Preferencias" description="Cómo querés ver fechas, números e idioma de la interfaz.">
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
            disabled={saving}
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
            disabled={saving}
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
            disabled={saving}
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
            disabled={saving}
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
                disabled={saving}
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
                checked={notifications.disputeOpened}
                onChange={e => handleNotifToggle('disputeOpened', e.target.checked)}
                disabled={saving}
              />
            }
            label={
              <Stack spacing={0.25}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Disputas abiertas
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Alerta inmediata cuando un cliente inicia una disputa.
                </Typography>
              </Stack>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={notifications.settlementProcessed}
                onChange={e => handleNotifToggle('settlementProcessed', e.target.checked)}
                disabled={saving}
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
                disabled={saving}
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

      <ProfileEditModal open={editOpen} onClose={() => setEditOpen(false)} />
    </Stack>
  );
}

export default ProfileForm;
