import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { COUNTRIES } from '@/constants/countries';
import { DEPARTMENTS } from '@/constants/industries';
import type { Contact } from '@/stores/onboardingStore';
import { colors } from '@/theme/tokens';

const schema = yup.object({
  firstName: yup.string().min(2, 'Mínimo 2 caracteres').required('Obligatorio'),
  lastName: yup.string().min(2, 'Mínimo 2 caracteres').required('Obligatorio'),
  email: yup.string().email('Correo inválido').required('Obligatorio'),
  phonePrefix: yup.string().required('Obligatorio'),
  phone: yup.string().min(6, 'Mínimo 6 dígitos').required('Obligatorio'),
  department: yup.string().required('Obligatorio'),
});

type FormValues = yup.InferType<typeof schema>;

interface CrearContactoModalProps {
  open: boolean;
  country: string;
  existing?: Contact | null;
  onClose: () => void;
  onSave: (contact: Contact) => void;
}

export function CrearContactoModal({
  open,
  country,
  existing,
  onClose,
  onSave,
}: CrearContactoModalProps) {
  const defaultPrefix = COUNTRIES.find(c => c.code === country)?.phonePrefix ?? '+52';

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      firstName: existing?.firstName ?? '',
      lastName: existing?.lastName ?? '',
      email: existing?.email ?? '',
      phonePrefix: existing?.phonePrefix ?? defaultPrefix,
      phone: existing?.phone ?? '',
      department: existing?.department ?? 'GENERAL',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        firstName: existing?.firstName ?? '',
        lastName: existing?.lastName ?? '',
        email: existing?.email ?? '',
        phonePrefix: existing?.phonePrefix ?? defaultPrefix,
        phone: existing?.phone ?? '',
        department: existing?.department ?? 'GENERAL',
      });
    }
  }, [open, existing, defaultPrefix, reset]);

  const onSubmit = (data: FormValues) => {
    const contact: Contact = {
      id: existing?.id ?? `c_${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phonePrefix: data.phonePrefix,
      phone: data.phone,
      department: data.department,
      country,
    };
    onSave(contact);
    onClose();
  };

  const phonePrefix = watch('phonePrefix');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 2 } } }}
    >
      <DialogTitle sx={{ pr: 6 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <PersonAddAltIcon sx={{ color: colors.brandPrimaryDark }} />
          <Typography variant="h3">{existing ? 'Editar Contacto' : 'Crear Contacto'}</Typography>
        </Stack>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 12, top: 12 }}
          size="small"
        >
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
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={1}>
                <TextField
                  {...register('phonePrefix')}
                  select
                  label="Prefijo"
                  value={phonePrefix || defaultPrefix}
                  sx={{ width: 140 }}
                >
                  {COUNTRIES.map(c => (
                    <MenuItem key={c.code} value={c.phonePrefix}>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <Box component="span" sx={{ fontSize: 14 }}>
                          {c.flag}
                        </Box>
                        <span>{c.phonePrefix}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  {...register('phone')}
                  label="Teléfono *"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  sx={{ flex: 1 }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('department')}
                select
                label="Departamento *"
                defaultValue={existing?.department ?? 'GENERAL'}
                error={!!errors.department}
                helperText={errors.department?.message}
              >
                {DEPARTMENTS.map(d => (
                  <MenuItem key={d.key} value={d.key}>
                    {d.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!isValid}
          onClick={handleSubmit(onSubmit)}
        >
          {existing ? 'Guardar cambios' : 'Crear contacto'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CrearContactoModal;
