import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContextBanner from '@/components/common/ContextBanner';
import { MOCK_ROLES } from '@/mocks/roles';
import type { MockMerchantUser } from '@/mocks/users';
import type { UserRole } from '@/stores/authStore';

const schema = yup.object({
  firstName: yup.string().min(2, 'Mínimo 2 caracteres').required('Obligatorio'),
  lastName: yup.string().min(2, 'Mínimo 2 caracteres').required('Obligatorio'),
  email: yup.string().email('Correo inválido').required('Obligatorio'),
  role: yup
    .mixed<UserRole>()
    .oneOf(['Admin', 'Operator', 'Viewer'])
    .required('Obligatorio'),
});

type FormValues = yup.InferType<typeof schema>;

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  user?: MockMerchantUser | null;
  onClose: () => void;
  onSubmit: (values: FormValues) => void;
}

export function UserFormModal({ open, mode, user, onClose, onSubmit }: Props) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      role: user?.role ?? 'Viewer',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        email: user?.email ?? '',
        role: user?.role ?? 'Viewer',
      });
    }
  }, [open, user, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 2 } } }}>
      <DialogTitle sx={{ pr: 6 }}>
        {mode === 'create' ? 'Crear nuevo usuario' : 'Editar usuario'}
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('firstName')}
                label="Nombre *"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('lastName')}
                label="Apellido *"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('email')}
                label="Correo electrónico *"
                type="email"
                disabled={mode === 'edit'}
                error={!!errors.email}
                helperText={
                  errors.email?.message ?? (mode === 'edit' ? 'El correo no se puede editar' : undefined)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Rol *"
                    error={!!errors.role}
                    helperText={errors.role?.message}
                  >
                    {MOCK_ROLES.map(r => (
                      <MenuItem key={r.key} value={r.key}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {r.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {r.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>

          {mode === 'create' && (
            <ContextBanner variant="info">
              Se enviará un correo de invitación al usuario para crear su contraseña.
            </ContextBanner>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" color="primary" disabled={!isValid} onClick={handleSubmit(onSubmit)}>
          {mode === 'create' ? 'Enviar invitación' : 'Guardar cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserFormModal;
