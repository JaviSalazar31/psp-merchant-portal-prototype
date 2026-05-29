import { useEffect, useMemo, useState } from 'react';
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
import {
  isValidFiscalId,
  isValidWebsite,
} from '@/constants/fiscalIdValidators';
import { useOnboardingStore, type Step1Data } from '@/stores/onboardingStore';
import { colors } from '@/theme/tokens';

const MAX_OPERATION_COUNTRIES = 3;

/**
 * Schema con validaciones REALES por país:
 *   - fiscalId: dígito verificador real (RFC homoclave+fecha, CNPJ módulo 11, NIT DIAN)
 *   - corporateEmail: bloquea gmail/hotmail/outlook/yahoo/etc.
 *   - website: TLD válido (no acepta "x" sin punto)
 *   - legalName: min 3, max 200, sin caracteres exóticos
 */
const schema = yup.object({
  fiscalResidenceCountry: yup.string().required('Obligatorio'),
  incorporationCountry: yup.string().required('Obligatorio'),
  fiscalId: yup
    .string()
    .required('Obligatorio')
    .test('fiscalId-valid', 'Identificación fiscal inválida para el país de residencia', function (value) {
      const country = this.parent.fiscalResidenceCountry;
      if (!country || !value) return false;
      return isValidFiscalId(country, value);
    }),
  commercialName: yup.string().default(''),
  legalName: yup
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(200, 'Máximo 200 caracteres')
    .required('Obligatorio'),
  registrationNumber: yup.string().default(''),
  corporateEmail: yup
    .string()
    .email('Correo inválido')
    .default(''),
  website: yup
    .string()
    .default('')
    .test('website-valid', 'URL inválida (ejemplo: https://miempresa.com)', v => {
      // Opcional: solo valida si el usuario completó algo.
      if (!v || v.trim() === '') return true;
      return isValidWebsite(v);
    }),
  industry: yup.string().required('Obligatorio'),
  monthlyVolume: yup.string().required('Obligatorio'),
  operationCountries: yup
    .array(yup.string().required())
    .min(1, 'Seleccioná al menos un país de operación')
    .max(MAX_OPERATION_COUNTRIES, `Podés seleccionar hasta ${MAX_OPERATION_COUNTRIES} países`)
    .required(),
});

type FormValues = yup.InferType<typeof schema>;

export function Step1DatosEmpresa() {
  const navigate = useNavigate();
  const existing = useOnboardingStore(s => s.step1Data);
  const setStep1Data = useOnboardingStore(s => s.setStep1Data);
  const registrationCountry = useOnboardingStore(s => s.registrationCountry);

  // Auto-prefill: el país de incorporación elegido en Registro pre-pobla
  // País Residencia Fiscal y País Constitución (editables, no bloqueados).
  // Asunción: para PYMES suelen coincidir en >95% de casos; corporativos
  // multinacionales pueden hacer override manual.
  const initialFiscalResidence =
    existing?.fiscalResidenceCountry ?? registrationCountry ?? '';
  const initialIncorporation =
    existing?.incorporationCountry ?? registrationCountry ?? '';

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      fiscalId: existing?.fiscalId ?? '',
      fiscalResidenceCountry: initialFiscalResidence,
      incorporationCountry: initialIncorporation,
      commercialName: existing?.commercialName ?? '',
      legalName: existing?.legalName ?? '',
      registrationNumber: existing?.registrationNumber ?? '',
      corporateEmail: existing?.corporateEmail ?? '',
      website: existing?.website ?? '',
      industry: existing?.industry ?? '',
      monthlyVolume: existing?.monthlyVolume ?? '',
      // Vacío por default; el usuario debe seleccionar explícitamente.
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

  // Sincronizar incorporación con residencia fiscal mientras el user no la edite.
  const [touchedIncorporation, setTouchedIncorporation] = useState(false);
  useEffect(() => {
    if (!fiscalResidence) return;
    if (touchedIncorporation) return;
    setValue('incorporationCountry', fiscalResidence, { shouldValidate: true });
  }, [fiscalResidence, touchedIncorporation, setValue]);

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
                onChange={e => {
                  setTouchedIncorporation(true);
                  field.onChange(e);
                }}
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

      <TextField
        {...register('fiscalId')}
        label={`Número de Identificación Fiscal${hint ? ` (${hint.label})` : ''} *`}
        placeholder={hint?.placeholder ?? 'Ingresá el ID fiscal de la empresa'}
        error={!!errors.fiscalId}
        helperText={errors.fiscalId?.message}
      />

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
            label="Nombre legal de la empresa *"
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
            placeholder="https://miempresa.com"
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
              const trimmed = val.length > MAX_OPERATION_COUNTRIES ? val.slice(0, MAX_OPERATION_COUNTRIES) : val;
              field.onChange(trimmed);
            }}
            getOptionDisabled={code => {
              const selected = field.value ?? [];
              return selected.length >= MAX_OPERATION_COUNTRIES && !selected.includes(code);
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
                  errors.operationCountries?.message ??
                  `Hasta ${MAX_OPERATION_COUNTRIES} países (${(field.value ?? []).length}/${MAX_OPERATION_COUNTRIES})`
                }
              />
            )}
          />
        )}
      />

      <WizardFooter onContinue={handleSubmit(onSubmit)} continueDisabled={!isValid} />
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
