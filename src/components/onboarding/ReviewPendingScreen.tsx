import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Link, Stack, Typography } from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import WizardHeader from './WizardHeader';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';

function formatNow(): string {
  const d = new Date();
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const day = d.getDate();
  const mon = months[d.getMonth()];
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${mon} ${year} · ${hh}:${mm}`;
}

export function ReviewPendingScreen() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const updateUser = useAuthStore(s => s.updateUser);
  const [submittedAt] = useState(formatNow);

  // Animación sutil del icono reloj
  useEffect(() => {
    // hint visual nada más
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleSimulateApproval = () => {
    updateUser({ onboardingStatus: 'approved' });
    toast.success('Solicitud aprobada por admin. Bienvenido al portal.');
    navigate('/home', { replace: true });
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.bgPage, display: 'flex', flexDirection: 'column' }}>
      <WizardHeader restricted />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingX: 3,
          paddingY: 6,
        }}
      >
        <Stack spacing={3} alignItems="center" textAlign="center" sx={{ maxWidth: 480 }}>
          <Box
            sx={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              backgroundColor: colors.bannerSuccess.bg,
              color: colors.pwReqMet,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2.4s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.4)' },
                '50%': { transform: 'scale(1.04)', boxShadow: '0 0 0 14px rgba(16, 185, 129, 0)' },
              },
            }}
          >
            <AccessTimeRoundedIcon sx={{ fontSize: 52 }} />
          </Box>

          <Stack spacing={1}>
            <Typography variant="h1">Tu solicitud está en revisión</Typography>
            <Typography variant="body1" color="text.secondary">
              Estamos validando tu información. Nuestro equipo te contactará en las próximas 24-48 horas
              hábiles.
            </Typography>
          </Stack>

          <Box
            sx={{
              backgroundColor: colors.bgCard,
              border: `1px solid ${colors.borderDefault}`,
              borderRadius: 2,
              padding: 2,
              width: '100%',
            }}
          >
            <Stack spacing={0.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  Estado actual
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600, color: colors.bannerWarning.fg }}>
                  En revisión
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  Solicitud enviada
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {submittedAt}
                </Typography>
              </Stack>
              {user && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">
                    Empresa
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {user.companyName}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary">
            ¿Tenés alguna duda? Escribinos a{' '}
            <Link href="mailto:operaciones@paynau.com">operaciones@paynau.com</Link>
          </Typography>

          <Button onClick={handleLogout} variant="outlined" sx={{ minWidth: 200 }}>
            Cerrar sesión
          </Button>

          <Box
            sx={{
              mt: 2,
              borderTop: `1px dashed ${colors.borderDefault}`,
              paddingTop: 2,
              width: '100%',
            }}
          >
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                MODO DEMO
              </Typography>
              <Button
                size="small"
                variant="text"
                onClick={handleSimulateApproval}
                sx={{
                  color: colors.textLink,
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: 'underline',
                }}
              >
                → Simular aprobación admin · ir a Home
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default ReviewPendingScreen;
