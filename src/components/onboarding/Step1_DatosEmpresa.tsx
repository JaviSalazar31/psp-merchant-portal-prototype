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

// Máximo de tres países de operación según la definición productiva de Fase 1.
const MAX_OPERATION_COUNTRIES = 3;

// Patrones de identificación fiscal por país (validación de forma — la
// verificación de dígito verificador completa queda server-side en
// producción, acá aplicamos validación de formato para evitar entradas
// claramente inválidas, alineado a buenas prácticas de mercado fintech
// LATAM).
const FISCAL_ID_RULES: Record<
  string,
  { pattern: RegExp; minLen: number; maxLen: number; example: string }
> = {
  // RFC México: 12-13 chars alfanuméricos en mayúsculas (persona moral 12, persona física 13)
  MX: {
    pattern: /^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/i,
    minLen: 12,
    maxLen: 13,
    example: 'ABC123456XYZ',
  },
  // CNPJ Brasil: 14 dígitos (con o sin máscara)
  BR: {
    pattern: /^[0-9.\-\/]{14,18}$/,
    minLen: 14,
    maxLen: 18,
    example: '12.345.678/0001-90',
  },
  // NIT Colombia: 9-10 dígitos + dígito de verificación (formato 900.123.456-7)
  CO: {
    pattern: /^[0-9.\-]{9,15}$/,
    minLen: 9,
    maxLen: 15,
    example: '900.123.456-7',
  },
};

const schema = yup.object({
  fiscalResidenceCountry: yup.string().required('Obligatorio'),
  incorporationCountry: yup.string().required('Obligatorio'),
  fiscalId: yup
    .string()
    .required('Obligatorio')
    .test('fiscal-id-format', function (value) {
      const country = this.parent.fiscalResidenceCountry as string | undefined;
      if (!value) return this.createError({ message: 'Obligatorio' });
      if (!country) return true; // si no hay país, no validamos contra patrón
      const rule = FISCAL_ID_RULES[country];
      if (!rule) return true;
      const cleaned = value.trim();
      if (cleaned.length < rule.minLen || cleaned.length > rule.maxLen) {
        return this.createError({
          message: `Debe tener entre ${rule.minLen} y ${rule.maxLen} caracteres (ej: ${rule.example})`,
        });
      }
      if (!rule.pattern.test(cleaned)) {
        return this.createError({
          message: `Formato inválido. Ejemplo válido: ${rule.example}`,
        });
      }
      return true;
    }),
  commercialName: yup.string().default(''),
  legalName: yup
    .string()
    .required('Obligatorio')
    .min(3, 'Ingresá al menos 3 caracteres')
    .max(150, 'Máximo 150 caracteres'),
  registrationNumber: yup.string().default(''),
  corporateEmail: yup
    .string()
    .email('Ingresá un correo válido (ej: contacto@empresa.com)')
    .default(''),
  website: yup
    .string()
    .default('')
    .test('website-format', 'Debe ser una URL válida (ej: https://tuempresa.com)', value => {
      if (!value) return true;
      try {
        const url = value.startsWith('http') ? value : `https://${value}`;
        new URL(url);
        return /\.[a-z]{2,}/i.test(url);
      } catch {
        return false;
      }
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

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    // onTouched: los errores aparecen al perder foco, no mientras se escribe.
    mode: 'onTouched',
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
      // Países de operación: vacíos por default. El comercio debe seleccionarlos
      // (hasta 3) — decisión 21/05 con Producto.
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
              // Forzamos máximo de 3 países en el cliente para alinear con la spec productiva.
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
