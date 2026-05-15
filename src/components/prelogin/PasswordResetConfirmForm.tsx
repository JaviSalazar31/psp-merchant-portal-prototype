import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import PasswordChecklist, {
  DEFAULT_PASSWORD_RULES,
  isPasswordValid,
} from '@/components/common/PasswordChecklist';
import { toast } from '@/stores/toastStore';

const schema = yup.object({
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .test('rules', 'La contraseña no cumple con las reglas', value =>
      isPasswordValid(value ?? '', DEFAULT_PASSWORD_RULES),
    ),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirmá tu contraseña'),
});

type FormValues = yup.InferType<typeof schema>;

export function PasswordResetConfirmForm() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: { password: '', passwordConfirm: '' },
  });

  const password = watch('password');

  useEffect(() => {
    if (submitAttempted) {
      void trigger('passwordConfirm');
    }
  }, [password, submitAttempted, trigger]);

  const onSubmit = async (_data: FormValues) => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 500));
    setSubmitting(false);
    toast.success('Contraseña actualizada. Iniciá sesión con tu nueva contraseña.');
    navigate('/login');
  };

  return (
    <Stack
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit, () => setSubmitAttempted(true))}
      spacing={2.5}
      sx={{ width: '100%' }}
    >
      <Typography variant="h1">Crear nueva contraseña</Typography>

      <Stack spacing={1}>
        <TextField
          {...register('password')}
          label="Nueva contraseña"
          type={showPw ? 'text' : 'password'}
          autoComplete="new-password"
          error={!!errors.password && submitAttempted}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPw(v => !v)} edge="end" size="small">
                  {showPw ? (
                    <VisibilityOffOutlinedIcon fontSize="small" />
                  ) : (
                    <VisibilityOutlinedIcon fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <PasswordChecklist password={password ?? ''} />
      </Stack>

      <TextField
        {...register('passwordConfirm')}
        label="Confirmar nueva contraseña"
        type={showPwConfirm ? 'text' : 'password'}
        autoComplete="new-password"
        error={!!errors.passwordConfirm}
        helperText={errors.passwordConfirm?.message}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPwConfirm(v => !v)} edge="end" size="small">
                {showPwConfirm ? (
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
        disabled={!isValid || submitting}
        fullWidth
      >
        {submitting ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={18} sx={{ color: 'inherit' }} />
            Actualizando…
          </Box>
        ) : (
          'Actualizar contraseña'
        )}
      </Button>
    </Stack>
  );
}

export default PasswordResetConfirmForm;
