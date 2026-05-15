import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, Link, Stack, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from '@/stores/toastStore';

const schema = yup.object({
  email: yup
    .string()
    .email('Correo electrónico inválido (ejemplo: usuario@ejemplo.com)')
    .required('El correo es obligatorio'),
});

type FormValues = yup.InferType<typeof schema>;

export function PasswordResetRequestForm() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: { email: '' },
  });

  const onSubmit = async (_data: FormValues) => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    setSubmitting(false);
    toast.success('Si el correo está registrado, recibirás un link en breve.');
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <Stack
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      spacing={2.5}
      sx={{ width: '100%' }}
    >
      <Stack spacing={0.5}>
        <Typography variant="h1">Recuperar contraseña</Typography>
        <Typography variant="body2" color="text.secondary">
          Ingresá tu correo y te enviaremos un link para crear una nueva contraseña.
        </Typography>
      </Stack>

      <TextField
        {...register('email')}
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        error={!!errors.email}
        helperText={errors.email?.message}
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
            Enviando…
          </Box>
        ) : (
          'Enviar link de recuperación'
        )}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Link
          component={RouterLink}
          to="/login"
          variant="body2"
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
        >
          <ArrowBackIcon fontSize="small" /> Volver al inicio de sesión
        </Link>
      </Box>
    </Stack>
  );
}

export default PasswordResetRequestForm;
