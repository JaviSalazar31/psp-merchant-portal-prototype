import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Link, Stack, Typography } from '@mui/material';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import { colors } from '@/theme/tokens';
import { toast } from '@/stores/toastStore';

const COUNTDOWN_SECONDS = 60;

export function ConfirmEmailScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = (location.state as { email?: string } | null)?.email;
  const [email] = useState(emailFromState ?? 'tu correo registrado');
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const handleResend = () => {
    toast.success('Correo reenviado correctamente.');
    setSeconds(COUNTDOWN_SECONDS);
  };

  const handleSimulateClick = () => {
    // Demo only: simulamos que el usuario clickeó el link del correo y validó.
    toast.success('Correo confirmado. ¡Empecemos con el onboarding!');
    navigate('/onboarding/step-1');
  };

  const countdownLabel = `(${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')})`;

  return (
    <Stack spacing={3} alignItems="center" textAlign="center" sx={{ width: '100%' }}>
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          backgroundColor: colors.bannerInfo.bg,
          color: colors.bannerInfo.fg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MarkEmailUnreadOutlinedIcon sx={{ fontSize: 36 }} />
      </Box>

      <Stack spacing={1}>
        <Typography variant="h1">Confirmá tu correo</Typography>
        <Typography variant="body1" color="text.secondary">
          Te enviamos un correo de confirmación a{' '}
          <Box component="span" sx={{ fontWeight: 600, color: colors.textPrimary }}>
            {email}
          </Box>
          .
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Hacé clic en el link del correo para completar tu registro.
        </Typography>
      </Stack>

      <Box
        sx={{
          paddingX: 2,
          paddingY: 1.25,
          backgroundColor: colors.bgSubtle,
          border: `1px solid ${colors.borderDefault}`,
          borderRadius: 1.5,
          width: '100%',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          El link de confirmación expira en 60 minutos.
        </Typography>
      </Box>

      <Button
        variant="outlined"
        onClick={handleResend}
        disabled={seconds > 0}
        fullWidth
      >
        {seconds > 0 ? `Reenviar correo ${countdownLabel}` : 'Reenviar correo'}
      </Button>

      <Stack spacing={1.5} alignItems="center">
        <Box
          component="button"
          type="button"
          onClick={handleSimulateClick}
          sx={{
            background: 'none',
            border: 'none',
            color: colors.textLink,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0,
            '&:hover': { color: colors.brandPrimaryDark },
          }}
        >
          → Simular click en email recibido (modo demo)
        </Box>
        <Link component={RouterLink} to="/login" variant="body2">
          Volver al inicio de sesión
        </Link>
      </Stack>
    </Stack>
  );
}

export default ConfirmEmailScreen;
