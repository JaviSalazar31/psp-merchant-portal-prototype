import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { WizardFooter } from './OnboardingLayout';
import CountryPills from '@/components/common/CountryPills';
import { COUNTRIES, COUNTRY_BY_CODE } from '@/constants/countries';
import { useOnboardingStore, type AddressData, type Step2Data } from '@/stores/onboardingStore';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';

function emptyAddress(country: string): AddressData {
  const prefix = COUNTRY_BY_CODE[country]?.phonePrefix ?? '+52';
  return {
    country,
    city: '',
    line1: '',
    line2: '',
    zip: '',
    state: '',
    phonePrefix: prefix,
    phone: '',
  };
}

function isAddressValid(a: AddressData | undefined): boolean {
  if (!a) return false;
  return !!a.country && !!a.line1 && !!a.zip && !!a.state && !!a.phone;
}

export function Step2DireccionComercial() {
  const navigate = useNavigate();
  const countries = useOnboardingStore(s => s.countriesSelected);
  const activeCountry = useOnboardingStore(s => s.activeCountry);
  const setActiveCountry = useOnboardingStore(s => s.setActiveCountry);
  const existing = useOnboardingStore(s => s.step2Data);
  const setStep2Data = useOnboardingStore(s => s.setStep2Data);

  const [byCountry, setByCountry] = useState<Step2Data>(() => {
    const init: Step2Data = {};
    for (const c of countries) {
      init[c] = existing?.[c] ?? emptyAddress(c);
    }
    return init;
  });

  // Si entró aleatoriamente sin step 1, devolverlo.
  useEffect(() => {
    if (countries.length === 0) {
      toast.warning('Completá los datos de la empresa primero.');
      navigate('/onboarding/step-1');
    }
  }, [countries, navigate]);

  const current = activeCountry ?? countries[0];
  const address = current ? byCountry[current] ?? emptyAddress(current) : null;

  const setField = <K extends keyof AddressData>(field: K, value: AddressData[K]) => {
    if (!current) return;
    setByCountry(prev => ({
      ...prev,
      [current]: { ...(prev[current] ?? emptyAddress(current)), [field]: value },
    }));
  };

  const onContinue = () => {
    if (!countries.every(c => isAddressValid(byCountry[c]))) {
      toast.error('Completá la dirección para todos los países seleccionados.');
      // Cambiá al primer país que falta para el usuario.
      const firstMissing = countries.find(c => !isAddressValid(byCountry[c]));
      if (firstMissing) setActiveCountry(firstMissing);
      return;
    }
    setStep2Data(byCountry);
    navigate('/onboarding/step-3');
  };

  if (!address || !current) {
    return null;
  }

  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <Typography variant="h2">Dirección Comercial</Typography>
        <Typography variant="body2" color="text.secondary">
          Nos permite asociar tu cuenta con tu información fiscal correctamente.
        </Typography>
      </Stack>

      {countries.length > 1 && (
        <CountryPills countries={countries} active={current} onChange={setActiveCountry} />
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="País *"
            value={address.country}
            onChange={e => setField('country', e.target.value)}
            disabled
            helperText="Asociado al país activo del wizard"
          >
            {COUNTRIES.map(c => (
              <MenuItem key={c.code} value={c.code}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box component="span" sx={{ fontSize: 16 }}>
                    {c.flag}
                  </Box>
                  <span>{c.name}</span>
                </Stack>
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Ciudad"
            value={address.city}
            onChange={e => setField('city', e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Dirección línea 1 *"
            value={address.line1}
            onChange={e => setField('line1', e.target.value)}
            error={!address.line1}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Dirección línea 2 (opcional)"
            value={address.line2}
            onChange={e => setField('line2', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Código postal *"
            value={address.zip}
            onChange={e => setField('zip', e.target.value)}
            error={!address.zip}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Estado / Provincia *"
            value={address.state}
            onChange={e => setField('state', e.target.value)}
            error={!address.state}
          />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={1}>
            <TextField
              select
              label="Prefijo"
              value={address.phonePrefix}
              onChange={e => setField('phonePrefix', e.target.value)}
              sx={{ width: 140 }}
              SelectProps={{ renderValue: (val) => <span>{val as string}</span> }}
            >
              {COUNTRIES.map(c => (
                <MenuItem key={c.code} value={c.phonePrefix}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Box component="span" sx={{ fontSize: 14 }}>
                      {c.flag}
                    </Box>
                    <span>{c.phonePrefix}</span>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                      {c.name}
                    </Typography>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Teléfono corporativo *"
              value={address.phone}
              onChange={e => setField('phone', e.target.value)}
              error={!address.phone}
              sx={{ flex: 1 }}
            />
          </Stack>
        </Grid>
      </Grid>

      <WizardFooter
        onBack={() => navigate('/onboarding/step-1')}
        onContinue={onContinue}
      />
    </Stack>
  );
}

export default Step2DireccionComercial;
