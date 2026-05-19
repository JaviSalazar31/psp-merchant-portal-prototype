import { Box, Button, Stack, Typography } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme/tokens';

interface NotFoundPageProps {
  /** Variante de error a renderizar. Por defecto 404. */
  variant?: '404' | '500' | '403';
}

const COPY: Record<NonNullable<NotFoundPageProps['variant']>, {
  code: string;
  title: string;
  description: string;
}> = {
  '404': {
    code: '404',
    title: 'Esta página no existe',
    description: 'La dirección que intentaste abrir no está disponible o fue movida. Volvé al inicio para retomar tu sesión.',
  },
  '500': {
    code: '500',
    title: 'Algo se rompió de nuestro lado',
    description: 'Tuvimos un problema técnico al procesar tu solicitud. Probá de nuevo en unos minutos o contactanos si el inconveniente persiste.',
  },
  '403': {
    code: '403',
    title: 'No tenés acceso a esta sección',
    description: 'Tu usuario actual no tiene los permisos necesarios. Si creés que es un error, contactá al administrador de tu cuenta.',
  },
};

export function NotFoundPage({ variant = '404' }: NotFoundPageProps) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const meta = COPY[variant];

  const handleBack = () => {
    navigate(isAuthenticated ? '/home' : '/login', { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: colors.bgPage,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingX: { xs: 3, sm: 4 },
        paddingY: 6,
      }}
    >
      <Stack
        spacing={3}
        alignItems="center"
        textAlign="center"
        sx={{ maxWidth: 480 }}
      >
        <Box
          component="svg"
          viewBox="0 0 220 100"
          sx={{ width: { xs: 200, sm: 240 }, height: 'auto' }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="gradStops" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.brandPrimary} />
              <stop offset="100%" stopColor="#2E8B26" />
            </linearGradient>
          </defs>
          <text
            x="50%"
            y="78"
            textAnchor="middle"
            fontFamily='"Inter", -apple-system, sans-serif'
            fontWeight="800"
            fontSize="78"
            letterSpacing="-2"
            fill="url(#gradStops)"
          >
            {meta.code}
          </text>
          <circle cx="180" cy="20" r="6" fill={colors.brandPrimary} />
        </Box>

        <Stack spacing={1}>
          <Typography variant="h1" sx={{ fontWeight: 700 }}>
            {meta.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {meta.description}
          </Typography>
        </Stack>

        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<HomeOutlinedIcon />}
          onClick={handleBack}
          sx={{ minWidth: 220 }}
        >
          Volver al inicio
        </Button>
      </Stack>
    </Box>
  );
}

export default NotFoundPage;
