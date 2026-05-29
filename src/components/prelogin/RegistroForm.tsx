import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  Link,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContextBanner from '@/components/common/ContextBanner';
import PasswordChecklist, {
  DEFAULT_PASSWORD_RULES,
  isPasswordValid,
} from '@/components/common/PasswordChecklist';
import PasswordStrengthBar from '@/components/common/PasswordStrengthBar';
import { COUNTRIES } from '@/constants/countries';
import { useAuthStore, type Language } from '@/stores/authStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useUIStore } from '@/stores/uiStore';
import { redirectAfterLogin } from '@/routes/postAuthRedirect';
import { colors } from '@/theme/tokens';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'pt-BR', label: 'Português (Brasil)' },
];

const registroSchema = yup.object({
  companyName: yup
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .required('Obligatorio'),
  country: yup.string().required('Seleccioná un país'),
  email: yup
    .string()
    .email('Correo electrónico inválido (ejemplo: usuario@ejemplo.com)')
    .required('El correo es obligatorio'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .test('rules', 'La contraseña no cumple con todas las reglas', value =>
      isPasswordValid(value ?? '', DEFAULT_PASSWORD_RULES),
    ),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirmá tu contraseña'),
  language: yup
    .mixed<Language>()
    .oneOf(['es', 'en', 'pt-BR'])
    .required('Seleccioná un idioma'),
  acceptTerms: yup.boolean().oneOf([true], 'Debés aceptar los términos').required(),
});

type FormValues = yup.InferType<typeof registroSchema>;

export function RegistroForm() {
  const navigate = useNavigate();
  const registerNewUser = useAuthStore(s => s.registerNewUser);
  const setRegistrationCountry = useOnboardingStore(s => s.setRegistrationCountry);
  const setUILanguage = useUIStore(s => s.setLanguage);

  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid, isDirty },
  } = useForm<FormValues>({
    resolver: yupResolver(registroSchema),
    mode: 'onChange',
    defaultValues: {
      companyName: '',
      country: '',
      email: '',
      password: '',
      passwordConfirm: '',
      language: 'es',
      acceptTerms: false,
    },
  });

  const password = watch('password');
  const companyName = watch('companyName');
  const email = watch('email');

  // Re-validar passwordConfirm cuando cambia password (sincronía de matching).
  useEffect(() => {
    if (submitAttempted) {
      void trigger('passwordConfirm');
    }
  }, [password, submitAttempted, trigger]);

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 500));
    const user = registerNewUser({
      companyName: data.companyName,
      country: data.country,
      email: data.email,
      password: data.password,
      language: data.language,
    });
    // Propagar el idioma elegido al uiStore para que el AvatarMenu y el resto
    // del portal post-login lo reflejen sin requerir un cambio manual.
    setUILanguage(data.language);
    // Guardar el país de incorporación para que el Step 1 del wizard pueda
    // pre-poblar País Residencia Fiscal y País Constitución.
    setRegistrationCountry(data.country);
    setSubmitting(false);
    const token = `tok_${user.id}`;
    navigate(`/confirm-email/${token}`, { state: { email: data.email } });
  };

  const onInvalidSubmit = () => {
    setSubmitAttempted(true);
  };

  // El banner verde "Todo listo" solo aparece cuando el form es válido y el usuario ya tocó algo.
  const showSuccessBanner = isValid && isDirty;
  // El banner rojo "Corregí" solo aparece después de un submit fallido (no asustar tipeando).
  const showErrorBanner = submitAttempted && !isValid;

  return (
    <Stack
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
      spacing={2.5}
      sx={{ width: '100%' }}
    >
      <Stack spacing={0.5}>
        <Typography variant="h1">Crear cuenta</Typography>
        <Typography variant="body2" color="text.secondary">
          ¿Ya tenés una cuenta?{' '}
          <Link component={RouterLink} to="/login" fontWeight={600}>
            Iniciá Sesión
          </Link>
        </Typography>
      </Stack>

      {showSuccessBanner && (
        <ContextBanner variant="success">
          Todo listo — pulsá &apos;Comenzar&apos; para continuar.
        </ContextBanner>
      )}
      {showErrorBanner && (
        <ContextBanner variant="error">
          Corregí los errores para continuar. Revisá los campos marcados en rojo.
        </ContextBanner>
      )}

      <SectionDivider>DATOS DE TU EMPRESA</SectionDivider>

      <TextField
        {...register('companyName')}
        label="Nombre de la empresa"
        error={!!errors.companyName}
        helperText={errors.companyName?.message}
        InputProps={{ endAdornment: <ValidIndicator visible={!errors.companyName && companyName.length >= 2} /> }}
      />

      <Controller
        name="country"
        control={control}
        render={({ field }) => (
          <FormControl error={!!errors.country} fullWidth>
            <TextField
              {...field}
              select
              label="País de incorporación"
              value={field.value || ''}
              error={!!errors.country}
              helperText={errors.country?.message}
            >
              {COUNTRIES.map(c => (
                <MenuItem key={c.code} value={c.code}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box component="span" sx={{ fontSize: 18, lineHeight: 1 }}>
                      {c.flag}
                    </Box>
                    <span>{c.name}</span>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        )}
      />

      <Stack spacing={0.5}>
        <TextField
          {...register('email')}
          label="Correo electrónico corporativo"
          type="email"
          autoComplete="email"
          error={!!errors.email}
          helperText={errors.email?.message}
          InputProps={{
            endAdornment: <ValidIndicator visible={!errors.email && /.+@.+\..+/.test(email)} />,
          }}
        />
        {/* Adenda Cambio 1: helper text para emails que ya tienen cuenta. */}
        <Typography variant="caption" sx={{ color: colors.textSecondary, paddingX: 1.5 }}>
          Si manejás varias empresas, podés usar el mismo correo para registrar cada una.
        </Typography>
      </Stack>

      <SectionDivider>CREDENCIALES DE ACCESO</SectionDivider>

      <Stack spacing={1}>
        <TextField
          {...register('password')}
          label="Contraseña"
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
        <PasswordStrengthBar password={password ?? ''} />
        <PasswordChecklist password={password ?? ''} />
      </Stack>

      <TextField
        {...register('passwordConfirm')}
        label="Confirmar contraseña"
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

      {/* Adenda Cambio 2: 6to campo "Idioma preferido", antes del checkbox de Términos. */}
      <Controller
        name="language"
        control={control}
        render={({ field }) => (
          <FormControl error={!!errors.language} fullWidth>
            <TextField
              {...field}
              select
              label="Idioma preferido"
              value={field.value || 'es'}
              error={!!errors.language}
              helperText={errors.language?.message ?? 'Lo usaremos para comunicaciones de esta cuenta.'}
            >
              {LANGUAGES.map(l => (
                <MenuItem key={l.code} value={l.code}>
                  {l.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        )}
      />

      <Controller
        name="acceptTerms"
        control={control}
        render={({ field }) => (
          <FormControl error={!!errors.acceptTerms}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                  sx={{
                    color: colors.borderStrong,
                    '&.Mui-checked': { color: colors.brandPrimary },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: colors.textPrimary }}>
                  Al registrarte aceptás el{' '}
                  <Link href="#" onClick={e => e.preventDefault()} fontWeight={600}>
                    Aviso de Privacidad
                  </Link>{' '}
                  y los{' '}
                  <Link href="#" onClick={e => e.preventDefault()} fontWeight={600}>
                    Términos y Condiciones
                  </Link>
                  .
                </Typography>
              }
            />
            {errors.acceptTerms && (
              <FormHelperText sx={{ ml: 0 }}>{errors.acceptTerms.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        disabled={submitting}
        fullWidth
      >
        {submitting ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={18} sx={{ color: 'inherit' }} />
            Creando cuenta…
          </Box>
        ) : (
          'Comenzar'
        )}
      </Button>
    </Stack>
  );
}

function SectionDivider({ children }: { children: React.ReactNode }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ paddingTop: 1 }}>
      <Divider sx={{ flex: 1, borderColor: colors.borderDefault }} />
      <Typography
        variant="caption"
        sx={{
          fontSize: 11,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: colors.textSecondary,
          fontWeight: 600,
        }}
      >
        {children}
      </Typography>
      <Divider sx={{ flex: 1, borderColor: colors.borderDefault }} />
    </Stack>
  );
}

function ValidIndicator({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <InputAdornment position="end">
      <CheckCircleIcon sx={{ color: colors.pwReqMet, fontSize: 20 }} />
    </InputAdornment>
  );
}

export default RegistroForm;
