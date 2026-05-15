import { Box, Button, Card, Chip, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuthStore, MOCK_TEST_USERS_HINT } from '@/stores/authStore';
import { colors } from '@/theme/tokens';
import Logo from '@/components/common/Logo';

/**
 * Placeholder usado por rutas internas que todavía no se construyen en esta fase.
 * Muestra qué ruta se está visitando, qué usuario está logueado y un atajo para cerrar sesión.
 * Se reemplaza en Fases 3 y 4 cuando se monten Onboarding y AppLayout.
 */
export default function StubPage({ phase, title }: { phase: number; title: string }) {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const location = useLocation();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        backgroundColor: colors.bgPage,
      }}
    >
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 560 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Logo width={120} />
        </Box>
        <Card sx={{ padding: 3 }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h3">{title}</Typography>
              <Chip
                label={`Fase ${phase}`}
                size="small"
                sx={{ bgcolor: colors.brandPrimary, color: colors.brandDarkest, fontWeight: 600 }}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Ruta actual: <code>{location.pathname}</code>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Esta pantalla es un placeholder. Se construye en la Fase {phase} del checklist.
            </Typography>

            {user && (
              <Box
                sx={{
                  paddingX: 2,
                  paddingY: 1.5,
                  backgroundColor: colors.bgSubtle,
                  border: `1px solid ${colors.borderDefault}`,
                  borderRadius: 1.5,
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Usuario activo
                </Typography>
                <Stack spacing={0.25} sx={{ mt: 0.5 }}>
                  <Typography variant="body2">
                    <strong>{user.firstName} {user.lastName}</strong> · {user.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Empresa: {user.companyName} · Status: <code>{user.onboardingStatus}</code> · Step: {user.currentOnboardingStep}
                  </Typography>
                </Stack>
              </Box>
            )}

            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button variant="outlined" component={RouterLink} to="/login">
                Ir a /login
              </Button>
              {user && (
                <Button variant="contained" onClick={() => logout()}>
                  Cerrar sesión
                </Button>
              )}
            </Stack>
          </Stack>
        </Card>

        {!user && (
          <Card sx={{ padding: 2.5 }}>
            <Stack spacing={1.5}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Usuarios mock para probar el flujo
              </Typography>
              {MOCK_TEST_USERS_HINT.map(u => (
                <Stack key={u.email} direction="row" spacing={1.5} alignItems="center">
                  <Typography variant="caption" sx={{ width: 180, fontFamily: 'monospace' }}>
                    {u.email}
                  </Typography>
                  <Chip
                    label={u.status}
                    size="small"
                    sx={{ fontFamily: 'monospace', fontSize: 11 }}
                  />
                </Stack>
              ))}
              <Typography variant="caption" color="text.secondary">
                Password para todos: <code>{MOCK_TEST_USERS_HINT[0]?.password}</code>
              </Typography>
              <Link component={RouterLink} to="/login" variant="body2">
                Ir al login →
              </Link>
            </Stack>
          </Card>
        )}
      </Stack>
    </Box>
  );
}
