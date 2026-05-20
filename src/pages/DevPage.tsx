import { useNavigate, Navigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  useAuthStore,
  type Language,
  type OnboardingStatus,
  type UserRole,
} from '@/stores/authStore';
import { COUNTRIES } from '@/constants/countries';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';

const ONBOARDING_STATUSES: { value: OnboardingStatus; label: string; description: string }[] = [
  { value: 'not_started', label: 'No iniciado', description: 'El usuario nunca tocó el wizard.' },
  { value: 'in_progress', label: 'En progreso', description: 'Wizard a medio completar.' },
  { value: 'pending_review', label: 'En revisión', description: 'Bloqueante: pantalla de espera.' },
  { value: 'approved', label: 'Aprobado', description: 'Acceso completo al portal.' },
  { value: 'rejected', label: 'Rechazado', description: 'Pantalla de correcciones requeridas.' },
];

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'Admin', label: 'Admin' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Operator', label: 'Operator' },
  { value: 'Viewer', label: 'Viewer' },
];

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'pt-BR', label: 'Português (Brasil)' },
];

/**
 * Página de utilidades para demos y debug. Permite cambiar atributos del usuario logueado en
 * caliente para recorrer todos los estados sin armar múltiples usuarios mock. No debe aparecer
 * en sidebar ni en el menú del avatar — sólo se accede tipeando la URL `/dev`.
 */
export function DevPage() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const updateUser = useAuthStore(s => s.updateUser);

  if (!user) return <Navigate to="/login" replace />;

  const setStatus = (status: OnboardingStatus) => {
    const patch: Partial<typeof user> = { onboardingStatus: status };
    if (status === 'pending_review') patch.currentOnboardingStep = 6;
    if (status === 'approved') patch.currentOnboardingStep = 6;
    updateUser(patch);
    toast.success(`Status del onboarding seteado a "${status}".`);
  };

  const go = (path: string) => navigate(path);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.bgPage, paddingY: 5 }}>
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: colors.bannerWarning.bg,
                color: colors.bannerWarning.fg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BuildOutlinedIcon />
            </Box>
            <Stack spacing={0.25}>
              <Typography variant="h2">Modo demo · /dev</Typography>
              <Typography variant="body2" color="text.secondary">
                Controles para cambiar el estado del usuario en caliente. No es parte del
                producto: solo aplica durante presentaciones y debug del prototipo.
              </Typography>
            </Stack>
          </Stack>

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h4">Usuario actual</Typography>
                <Divider />
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                  <Chip label={`Email: ${user.email}`} variant="outlined" />
                  <Chip label={`Empresa: ${user.companyName}`} variant="outlined" />
                  <Chip label={`Status: ${user.onboardingStatus}`} color="primary" />
                  <Chip label={`Rol: ${user.role}`} variant="outlined" />
                  <Chip label={`País: ${user.country}`} variant="outlined" />
                  <Chip label={`Idioma: ${user.language}`} variant="outlined" />
                  <Chip label={`Step: ${user.currentOnboardingStep}`} variant="outlined" />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack spacing={2.5}>
                <Stack spacing={0.5}>
                  <Typography variant="h4">Estado de onboarding</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cambia el flujo en caliente para demostrar cada estado.
                  </Typography>
                </Stack>
                <Divider />
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {ONBOARDING_STATUSES.map(s => (
                    <Button
                      key={s.value}
                      variant={user.onboardingStatus === s.value ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setStatus(s.value)}
                    >
                      {s.label}
                    </Button>
                  ))}
                </Stack>
                <Stack spacing={0.5}>
                  {ONBOARDING_STATUSES.map(s => (
                    <Typography key={s.value} variant="caption" color="text.secondary">
                      <strong>{s.label}:</strong> {s.description}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack spacing={2.5}>
                <Typography variant="h4">Rol del usuario</Typography>
                <Divider />
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <TextField
                    select
                    label="Rol"
                    value={user.role}
                    onChange={e => {
                      updateUser({ role: e.target.value as UserRole });
                      toast.success(`Rol seteado a ${e.target.value}.`);
                    }}
                  >
                    {ROLES.map(r => (
                      <MenuItem key={r.value} value={r.value}>
                        {r.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Idioma preferido"
                    value={user.language}
                    onChange={e => {
                      updateUser({ language: e.target.value as Language });
                      toast.success(`Idioma seteado a ${e.target.value}.`);
                    }}
                  >
                    {LANGUAGES.map(l => (
                      <MenuItem key={l.value} value={l.value}>
                        {l.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="País"
                    value={user.country}
                    onChange={e => {
                      updateUser({ country: e.target.value });
                      toast.success(`País seteado a ${e.target.value}.`);
                    }}
                  >
                    {COUNTRIES.map(c => (
                      <MenuItem key={c.code} value={c.code}>
                        {c.flag} {c.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack spacing={2.5}>
                <Typography variant="h4">Navegación rápida</Typography>
                <Divider />
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={<OpenInNewIcon fontSize="small" />}
                    onClick={() => go('/home')}
                  >
                    Home
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={<OpenInNewIcon fontSize="small" />}
                    onClick={() => go('/onboarding/step-1')}
                  >
                    Wizard
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={<OpenInNewIcon fontSize="small" />}
                    onClick={() => go('/review-pending')}
                  >
                    Review pending
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={<OpenInNewIcon fontSize="small" />}
                    onClick={() => go('/transactions/pay-in')}
                  >
                    Transacciones
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={<OpenInNewIcon fontSize="small" />}
                    onClick={() => go('/security')}
                  >
                    Centro de Seguridad
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={<OpenInNewIcon fontSize="small" />}
                    onClick={() => go('/some-fake-route-404')}
                  >
                    Página 404
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}

export default DevPage;
