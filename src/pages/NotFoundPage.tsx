import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Link, Stack, Typography } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
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
    description:
      'La dirección que intentaste abrir no está disponible o fue movida. Volvé al inicio para retomar tu sesión.',
  },
  '500': {
    code: '500',
    title: 'Algo salió mal de nuestro lado',
    description: 'Estamos trabajando para resolverlo. Intentá de nuevo en unos segundos.',
  },
  '403': {
    code: '403',
    title: 'No tenés acceso a este recurso',
    description: 'Si creés que es un error, contactá al administrador de tu cuenta.',
  },
};

/** Tiempo del reintento silencioso simulado ante un 5xx, antes de mostrar la pantalla. */
const AUTO_RETRY_MS = 2000;

export function NotFoundPage({ variant = '404' }: NotFoundPageProps) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const meta = COPY[variant];

  // El portal real intenta un reintento silencioso ante un error 5xx antes de mostrar
  // la pantalla. En el prototipo lo simulamos con una espera breve (mock + setTimeout).
  const [retrying, setRetrying] = useState(variant === '500');
  useEffect(() => {
    if (variant !== '500') return;
    const timer = setTimeout(() => setRetrying(false), AUTO_RETRY_MS);
    return () => clearTimeout(timer);
  }, [variant]);

  const handleBack = () => {
    navigate(isAuthenticated ? '/home' : '/login', { replace: true });
  };

  if (retrying) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: colors.bgPage,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress sx={{ color: colors.brandPrimary }} />
          <Typography variant="body1" color="text.secondary">
            Reintentando conexión…
          </Typography>
        </Stack>
      </Box>
    );
  }

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
      <Stack spacing={3} alignItems="center" textAlign="center" sx={{ maxWidth: 480 }}>
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

        {variant === '500' ? (
          <Stack spacing={1.5} alignItems="center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}
              sx={{ minWidth: 220 }}
            >
              Reintentar
            </Button>
            <Link
              href="mailto:soporte@paynau.com?subject=Reporte%20de%20problema"
              sx={{ fontWeight: 600 }}
            >
              Reportar problema
            </Link>
          </Stack>
        ) : (
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
        )}
      </Stack>
    </Box>
  );
}

export default NotFoundPage;
