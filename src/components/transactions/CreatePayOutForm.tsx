import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { COUNTRIES, COUNTRY_BY_CODE } from '@/constants/countries';
import { CURRENCIES } from '@/constants/currencies';
import { methodsForCountry, PAYMENT_METHODS } from '@/constants/paymentMethods';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';

const PAYOUT_CURRENCIES = ['MXN', 'BRL', 'COP', 'ARS', 'USD'] as const;
const ACCOUNT_TYPES = [
  { key: 'BANK_ACCOUNT', label: 'Cuenta bancaria' },
  { key: 'CLABE', label: 'CLABE (México)' },
  { key: 'PIX', label: 'PIX key (Brasil)' },
] as const;

const schema = yup.object({
  amount: yup.number().typeError('Monto inválido').positive('Debe ser mayor a 0').required('Obligatorio'),
  currency: yup.string().oneOf(PAYOUT_CURRENCIES as unknown as string[]).required('Obligatorio'),
  country: yup.string().required('Obligatorio'),
  beneficiaryName: yup.string().min(3, 'Mínimo 3 caracteres').required('Obligatorio'),
  accountType: yup.string().required('Obligatorio'),
  accountNumber: yup.string().min(4, 'Mínimo 4 caracteres').required('Obligatorio'),
  bankName: yup.string().min(2, 'Mínimo 2 caracteres').required('Obligatorio'),
  paymentMethod: yup.string().required('Obligatorio'),
  reference: yup.string().max(80, 'Máximo 80 caracteres').required('Obligatorio'),
  notes: yup.string().max(200, 'Máximo 200 caracteres').default(''),
});

type FormValues = yup.InferType<typeof schema>;

function makePayOutId(): string {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `PO-${n}`;
}

export function CreatePayOutForm() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      amount: undefined,
      currency: 'MXN',
      country: 'MX',
      beneficiaryName: '',
      accountType: 'BANK_ACCOUNT',
      accountNumber: '',
      bankName: '',
      paymentMethod: '',
      reference: '',
      notes: '',
    },
  });

  const country = watch('country');
  const reference = watch('reference') ?? '';
  const notes = watch('notes') ?? '';

  const methodOptions = useMemo(() => {
    if (!country) return PAYMENT_METHODS;
    return methodsForCountry(country);
  }, [country]);

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 700));
    setSubmitting(false);
    const id = makePayOutId();
    toast.success(`Pay-Out creado correctamente. ID: ${id}`, 5500);
    navigate('/transactions/pay-out');
    // NB: el mock no se persiste en MOCK_TRANSACTIONS para no contaminar el seed;
    // un siguiente render mostrará la tabla sin el item. Acordate del scope demo.
    void data;
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon fontSize="small" />}
          onClick={() => navigate('/transactions/pay-out')}
        >
          Volver
        </Button>
        <Stack spacing={0.25}>
          <Typography variant="h1">Crear Pay-Out</Typography>
          <Typography variant="body2" color="text.secondary">
            Instruí una dispersión manual de fondos a un beneficiario.
          </Typography>
        </Stack>
      </Stack>

      <Card sx={{ padding: { xs: 2, md: 3 } }}>
        <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2.5}>
          <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
            Importe
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ''}
                    onChange={e =>
                      field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                    }
                    type="number"
                    label="Monto *"
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {CURRENCIES.find(c => c.code === watch('currency'))?.symbol ?? '$'}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Moneda *"
                    error={!!errors.currency}
                    helperText={errors.currency?.message}
                  >
                    {PAYOUT_CURRENCIES.map(c => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>

          <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', pt: 1 }}>
            Beneficiario
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="País destino *"
                    error={!!errors.country}
                    helperText={errors.country?.message}
                  >
                    {COUNTRIES.map(c => (
                      <MenuItem key={c.code} value={c.code}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box component="span">{c.flag}</Box>
                          <span>{c.name}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('beneficiaryName')}
                label="Nombre completo o razón social *"
                error={!!errors.beneficiaryName}
                helperText={errors.beneficiaryName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="accountType"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Tipo de cuenta *"
                    error={!!errors.accountType}
                    helperText={errors.accountType?.message}
                  >
                    {ACCOUNT_TYPES.map(t => (
                      <MenuItem key={t.key} value={t.key}>
                        {t.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('accountNumber')}
                label="Número de cuenta o key *"
                error={!!errors.accountNumber}
                helperText={errors.accountNumber?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('bankName')}
                label="Banco *"
                error={!!errors.bankName}
                helperText={errors.bankName?.message}
                placeholder={COUNTRY_BY_CODE[country]?.name ? `Banco en ${COUNTRY_BY_CODE[country].name}` : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Método de pago *"
                    error={!!errors.paymentMethod}
                    helperText={errors.paymentMethod?.message ?? 'Filtrado según el país destino'}
                  >
                    {methodOptions.map(m => (
                      <MenuItem key={m.key} value={m.key}>
                        {m.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>

          <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', pt: 1 }}>
            Detalle
          </Typography>

          <TextField
            {...register('reference')}
            label="Concepto / Referencia *"
            error={!!errors.reference}
            helperText={errors.reference?.message ?? `${reference.length}/80`}
            inputProps={{ maxLength: 80 }}
          />

          <TextField
            {...register('notes')}
            label="Notas internas (opcional)"
            multiline
            rows={3}
            error={!!errors.notes}
            helperText={errors.notes?.message ?? `${notes.length}/200`}
            inputProps={{ maxLength: 200 }}
          />

          <Stack
            direction={{ xs: 'column-reverse', sm: 'row' }}
            spacing={1.5}
            justifyContent="flex-end"
            sx={{ pt: 1 }}
          >
            <Button variant="outlined" onClick={() => navigate('/transactions/pay-out')}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isValid || submitting}
              sx={{ minWidth: 180 }}
            >
              {submitting ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={18} sx={{ color: 'inherit' }} />
                  Creando…
                </Box>
              ) : (
                'Crear Pay-Out'
              )}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}

export default CreatePayOutForm;
