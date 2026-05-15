import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ContextBanner from '@/components/common/ContextBanner';
import LockoutDialog, { type LockoutType } from './LockoutDialog';
import { useAuthStore } from '@/stores/authStore';
import { redirectAfterLogin } from '@/routes/postAuthRedirect';

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Correo electrónico inválido (ejemplo: usuario@ejemplo.com)')
    .required('El correo es obligatorio'),
  password: yup
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .required('La contraseña es obligatoria'),
});

type FormValues = yup.InferType<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const login = useAuthStore(s => s.login);

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [credentialError, setCredentialError] = useState(false);
  const [dialog, setDialog] = useState<{ type: LockoutType; lockedUntil: number } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    setCredentialError(false);
    // Pequeño delay para simular request a backend.
    await new Promise(r => setTimeout(r, 400));
    const result = login(data.email, data.password);
    setSubmitting(false);

    if (result.success && result.user) {
      redirectAfterLogin(navigate, result.user);
      return;
    }

    if (result.error === 'locked_now' && result.lockedUntil) {
      setDialog({ type: 'now', lockedUntil: result.lockedUntil });
      return;
    }
    if (result.error === 'locked_persistent' && result.lockedUntil) {
      setDialog({ type: 'persistent', lockedUntil: result.lockedUntil });
      return;
    }
    setCredentialError(true);
  };

  const formDisabled = submitting || !!dialog;

  return (
    <Stack
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      spacing={2.5}
      sx={{ width: '100%' }}
    >
      <Stack spacing={0.5}>
        <Typography variant="h1">Inicio de Sesión</Typography>
        <Typography variant="body2" color="text.secondary">
          ¿No tenés una cuenta?{' '}
          <Link component={RouterLink} to="/registro" fontWeight={600}>
            Regístrate
          </Link>
        </Typography>
      </Stack>

      {credentialError && (
        <ContextBanner variant="error">
          Usuario o contraseña incorrectos. Verificá tus datos e intentá nuevamente.
        </ContextBanner>
      )}

      <TextField
        {...register('email')}
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        error={!!errors.email}
        helperText={errors.email?.message}
        disabled={formDisabled}
      />

      <TextField
        {...register('password')}
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        error={!!errors.password}
        helperText={errors.password?.message}
        disabled={formDisabled}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(v => !v)}
                edge="end"
                size="small"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <VisibilityOffOutlinedIcon fontSize="small" />
                ) : (
                  <VisibilityOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        disabled={!isValid || formDisabled}
        fullWidth
      >
        {submitting ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={18} sx={{ color: 'inherit' }} />
            Ingresando…
          </Box>
        ) : (
          'Ingresar'
        )}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Link component={RouterLink} to="/password-reset" variant="body2" fontWeight={600}>
          ¿Olvidaste tu contraseña? Recuperala
        </Link>
      </Box>

      {dialog && (
        <LockoutDialog
          open
          type={dialog.type}
          lockedUntil={dialog.lockedUntil}
          onClose={() => setDialog(null)}
        />
      )}
    </Stack>
  );
}

export default LoginForm;
