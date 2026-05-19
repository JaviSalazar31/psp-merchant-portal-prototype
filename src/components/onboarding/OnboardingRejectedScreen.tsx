import { Box, Button, Link, Stack, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useNavigate } from 'react-router-dom';
import WizardHeader from './WizardHeader';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme/tokens';

// Documentos mock que el Backoffice marca para corrección. En producción vendrán del backend.
const REJECTED_DOCUMENTS: Array<{ name: string; reason: string }> = [
  {
    name: 'Acta Constitutiva',
    reason: 'El documento no incluye la firma del Representante Legal en la última página.',
  },
  {
    name: 'Comprobante de domicilio',
    reason: 'La fecha de emisión supera los 3 meses. Cargá uno más reciente.',
  },
  {
    name: 'ID del Representante Legal',
    reason: 'La imagen del frente está borrosa. Subí una versión legible en alta resolución.',
  },
];

export function OnboardingRejectedScreen() {
  const navigate = useNavigate();
  const updateUser = useAuthStore(s => s.updateUser);
  const logout = useAuthStore(s => s.logout);

  const handleCorrect = () => {
    // Re-habilitamos el wizard cambiando el status a 'in_progress' antes de navegar al paso de docs.
    updateUser({ onboardingStatus: 'in_progress', currentOnboardingStep: 5 });
    navigate('/onboarding/step-5');
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
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
          paddingX: { xs: 2, sm: 3 },
          paddingY: 5,
        }}
      >
        <Stack spacing={3} alignItems="center" textAlign="center" sx={{ maxWidth: 560 }}>
          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              backgroundColor: colors.bannerWarning.bg,
              color: colors.bannerWarning.fg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 48 }} />
          </Box>

          <Stack spacing={1}>
            <Typography variant="h1">Tu solicitud necesita correcciones</Typography>
            <Typography variant="body1" color="text.secondary">
              Nuestro equipo de Backoffice revisó tu documentación y encontró algunos puntos que
              hay que ajustar antes de habilitar tu cuenta. Cargá las nuevas versiones de los
              documentos listados abajo para continuar.
            </Typography>
          </Stack>

          <Stack
            spacing={0}
            sx={{
              width: '100%',
              border: `1px solid ${colors.borderDefault}`,
              borderRadius: 2,
              backgroundColor: colors.bgCard,
              overflow: 'hidden',
              textAlign: 'left',
            }}
            divider={
              <Box
                sx={{
                  borderBottom: `1px solid ${colors.borderDefault}`,
                }}
              />
            }
          >
            {REJECTED_DOCUMENTS.map(doc => (
              <Stack
                key={doc.name}
                direction="row"
                spacing={1.5}
                alignItems="flex-start"
                sx={{ paddingX: 2, paddingY: 1.5 }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: colors.bannerWarning.bg,
                    color: colors.bannerWarning.fg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <DescriptionOutlinedIcon sx={{ fontSize: 18 }} />
                </Box>
                <Stack spacing={0.25} sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {doc.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {doc.reason}
                  </Typography>
                </Stack>
              </Stack>
            ))}
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{ width: '100%' }}
            justifyContent="center"
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleCorrect}
              sx={{ minWidth: 220 }}
            >
              Corregir solicitud
            </Button>
            <Button
              variant="outlined"
              size="large"
              component="a"
              href="mailto:operaciones@paynau.com?subject=Consulta%20sobre%20mi%20onboarding"
              sx={{ minWidth: 220 }}
            >
              Contactar soporte
            </Button>
          </Stack>

          <Typography variant="caption" color="text.secondary">
            ¿Querés salir y volver más tarde?{' '}
            <Link component="button" onClick={handleLogout} sx={{ fontWeight: 600 }}>
              Cerrá tu sesión
            </Link>{' '}
            y retomá cuando estés listo.
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

export default OnboardingRejectedScreen;
