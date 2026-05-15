import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Autocomplete,
  Box,
  Chip,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SectionDivider from './SectionDivider';
import { WizardFooter } from './OnboardingLayout';
import ContextBanner from '@/components/common/ContextBanner';
import { COUNTRIES, COUNTRY_BY_CODE, FISCAL_ID_HINTS } from '@/constants/countries';
import { INDUSTRIES, MONTHLY_VOLUME_RANGES } from '@/constants/industries';
import { useOnboardingStore, type Step1Data } from '@/stores/onboardingStore';
import { colors } from '@/theme/tokens';

const schema = yup.object({
  fiscalId: yup.string().min(4, 'Mínimo 4 caracteres').required('Obligatorio'),
  fiscalResidenceCountry: yup.string().required('Obligatorio'),
  incorporationCountry: yup.string().required('Obligatorio'),
  commercialName: yup.string().default(''),
  legalName: yup.string().min(2, 'Mínimo 2 caracteres').required('Obligatorio'),
  registrationNumber: yup.string().default(''),
  corporateEmail: yup.string().email('Correo inválido').default(''),
  website: yup.string().default(''),
  industry: yup.string().required('Obligatorio'),
  monthlyVolume: yup.string().required('Obligatorio'),
  operationCountries: yup
    .array(yup.string().required())
    .min(1, 'Seleccioná al menos un país de operación')
    .required(),
});

type FormValues = yup.InferType<typeof schema>;

export function Step1DatosEmpresa() {
  const navigate = useNavigate();
  const existing = useOnboardingStore(s => s.step1Data);
  const setStep1Data = useOnboardingStore(s => s.setStep1Data);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      fiscalId: existing?.fiscalId ?? '',
      fiscalResidenceCountry: existing?.fiscalResidenceCountry ?? '',
      incorporationCountry: existing?.incorporationCountry ?? '',
      commercialName: existing?.commercialName ?? '',
      legalName: existing?.legalName ?? '',
      registrationNumber: existing?.registrationNumber ?? '',
      corporateEmail: existing?.corporateEmail ?? '',
      website: existing?.website ?? '',
      industry: existing?.industry ?? '',
      monthlyVolume: existing?.monthlyVolume ?? '',
      operationCountries: existing?.operationCountries ?? [],
    },
  });

  const fiscalResidence = watch('fiscalResidenceCountry');
  const hint = fiscalResidence ? FISCAL_ID_HINTS[fiscalResidence] : null;
  const selectedCountries = watch('operationCountries') ?? [];

  // Auto-incluir el país de residencia fiscal en los países de operación.
  const [touchedCountries, setTouchedCountries] = useState(false);
  useMemo(() => {
    if (!fiscalResidence) return;
    if (touchedCountries) return;
    if (!selectedCountries.includes(fiscalResidence)) {
      setValue('operationCountries', [...selectedCountries, fiscalResidence], { shouldValidate: true });
    }
  }, [fiscalResidence]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = (data: FormValues) => {
    setStep1Data(data as Step1Data);
    navigate('/onboarding/step-2');
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2.5}>
      <Stack spacing={0.5}>
        <Typography variant="h2">Datos de la Empresa</Typography>
        <Typography variant="body2" color="text.secondary">
          Nos sirve para validar tu registro y conocer el perfil legal de tu empresa.
        </Typography>
      </Stack>

      <SectionDivider>IDENTIFICACIÓN FISCAL</SectionDivider>

      <TextField
        {...register('fiscalId')}
        label={`Número de Identificación Fiscal${hint ? ` (${hint.label})` : ''} *`}
        placeholder={hint?.placeholder ?? 'Ingresá el ID fiscal de la empresa'}
        error={!!errors.fiscalId}
        helperText={errors.fiscalId?.message}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Controller
            name="fiscalResidenceCountry"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="País Residencia Fiscal *"
                value={field.value || ''}
                error={!!errors.fiscalResidenceCountry}
                helperText={errors.fiscalResidenceCountry?.message}
              >
                {COUNTRIES.map(c => (
                  <MenuItem key={c.code} value={c.code}>
                    <CountryOption country={c} />
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="incorporationCountry"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="País Constitución *"
                value={field.value || ''}
                error={!!errors.incorporationCountry}
                helperText={errors.incorporationCountry?.message}
              >
                {COUNTRIES.map(c => (
                  <MenuItem key={c.code} value={c.code}>
                    <CountryOption country={c} />
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
      </Grid>

      {hint && (
        <ContextBanner variant="info" title={hint.flowName}>
          Se solicitará {hint.label} y datos fiscales de {COUNTRY_BY_CODE[fiscalResidence]?.name}.
        </ContextBanner>
      )}

      <SectionDivider>INFORMACIÓN COMERCIAL</SectionDivider>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('commercialName')}
            label="Nombre comercial"
            error={!!errors.commercialName}
            helperText={errors.commercialName?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('legalName')}
            label="Nombre de la empresa *"
            error={!!errors.legalName}
            helperText={errors.legalName?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('registrationNumber')}
            label="Número de Registro"
            error={!!errors.registrationNumber}
            helperText={errors.registrationNumber?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('corporateEmail')}
            label="Correo Electrónico Empresarial"
            type="email"
            error={!!errors.corporateEmail}
            helperText={errors.corporateEmail?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...register('website')}
            label="Sitio web"
            placeholder="https://"
            error={!!errors.website}
            helperText={errors.website?.message}
          />
        </Grid>
      </Grid>

      <SectionDivider>PERFIL OPERATIVO</SectionDivider>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Controller
            name="industry"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Industria *"
                value={field.value || ''}
                error={!!errors.industry}
                helperText={errors.industry?.message}
              >
                {INDUSTRIES.map(i => (
                  <MenuItem key={i} value={i}>
                    {i}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="monthlyVolume"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Volumen Mensual (USD) *"
                value={field.value || ''}
                error={!!errors.monthlyVolume}
                helperText={errors.monthlyVolume?.message}
              >
                {MONTHLY_VOLUME_RANGES.map(r => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
      </Grid>

      <Controller
        name="operationCountries"
        control={control}
        render={({ field }) => (
          <Autocomplete
            multiple
            options={COUNTRIES.map(c => c.code)}
            value={field.value ?? []}
            getOptionLabel={code => COUNTRY_BY_CODE[code]?.name ?? code}
            onChange={(_, val) => {
              setTouchedCountries(true);
              field.onChange(val);
            }}
            renderTags={(value, getTagProps) =>
              value.map((code, index) => {
                const country = COUNTRY_BY_CODE[code];
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    {...tagProps}
                    key={key}
                    label={
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Box component="span" sx={{ fontSize: 14 }}>
                          {country?.flag}
                        </Box>
                        <span>{country?.name}</span>
                      </Stack>
                    }
                    size="small"
                    deleteIcon={<CloseIcon fontSize="small" />}
                    sx={{
                      backgroundColor: colors.bgSubtle,
                      border: `1px solid ${colors.borderDefault}`,
                      fontWeight: 500,
                    }}
                  />
                );
              })
            }
            renderOption={(props, code) => {
              const country = COUNTRY_BY_CODE[code];
              if (!country) return null;
              return (
                <MenuItem {...props} key={code}>
                  <CountryOption country={country} />
                </MenuItem>
              );
            }}
            renderInput={params => (
              <TextField
                {...params}
                label="Países de Operación *"
                placeholder={field.value && field.value.length > 0 ? '' : 'Seleccioná uno o más'}
                error={!!errors.operationCountries}
                helperText={
                  errors.operationCountries?.message ?? 'Puedes seleccionar múltiples países'
                }
              />
            )}
          />
        )}
      />

      <WizardFooter onContinue={handleSubmit(onSubmit)} continueDisabled={false} />
    </Stack>
  );
}

function CountryOption({ country }: { country: { code: string; name: string; flag: string } }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box component="span" sx={{ fontSize: 16, lineHeight: 1 }}>
        {country.flag}
      </Box>
      <span>{country.name}</span>
    </Stack>
  );
}

export default Step1DatosEmpresa;
