import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { WizardFooter } from './OnboardingLayout';
import SectionDivider from './SectionDivider';
import CountryPills from '@/components/common/CountryPills';
import ContextBanner from '@/components/common/ContextBanner';
import { COUNTRIES, COUNTRY_BY_CODE } from '@/constants/countries';
import { CURRENCIES } from '@/constants/currencies';
import { useOnboardingStore, type BankAccountData, type Step3Data } from '@/stores/onboardingStore';
import { toast } from '@/stores/toastStore';

function emptyBank(country: string): BankAccountData {
  return {
    bankCountry: country,
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    bankAddress: '',
    routingNumber: '',
    iban: '',
    swift: '',
    currency: 'USD',
  };
}

function isBankValid(b: BankAccountData | undefined): boolean {
  if (!b) return false;
  return (
    !!b.bankCountry &&
    !!b.bankName &&
    !!b.accountNumber &&
    !!b.accountHolder &&
    !!b.currency &&
    (!!b.routingNumber || !!b.iban)
  );
}

export function Step3InformacionBancaria() {
  const navigate = useNavigate();
  const countries = useOnboardingStore(s => s.countriesSelected);
  const activeCountry = useOnboardingStore(s => s.activeCountry);
  const setActiveCountry = useOnboardingStore(s => s.setActiveCountry);
  const existing = useOnboardingStore(s => s.step3Data);
  const setStep3Data = useOnboardingStore(s => s.setStep3Data);

  const [byCountry, setByCountry] = useState<Step3Data>(() => {
    const init: Step3Data = {};
    for (const c of countries) init[c] = existing?.[c] ?? emptyBank(c);
    return init;
  });

  useEffect(() => {
    if (countries.length === 0) {
      navigate('/onboarding/step-1');
    }
  }, [countries, navigate]);

  const current = activeCountry ?? countries[0];
  const bank = current ? byCountry[current] ?? emptyBank(current) : null;

  const missingCountries = countries.filter(c => !isBankValid(byCountry[c]));
  const allComplete = countries.length > 0 && missingCountries.length === 0;

  const setField = <K extends keyof BankAccountData>(field: K, value: BankAccountData[K]) => {
    if (!current) return;
    setByCountry(prev => ({
      ...prev,
      [current]: { ...(prev[current] ?? emptyBank(current)), [field]: value },
    }));
  };

  const onContinue = () => {
    if (!countries.every(c => isBankValid(byCountry[c]))) {
      toast.error('Completá los datos bancarios para todos los países seleccionados.');
      const firstMissing = countries.find(c => !isBankValid(byCountry[c]));
      if (firstMissing) setActiveCountry(firstMissing);
      return;
    }
    setStep3Data(byCountry);
    navigate('/onboarding/step-4');
  };

  if (!bank || !current) return null;

  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <Typography variant="h2">Información Bancaria</Typography>
        <Typography variant="body2" color="text.secondary">
          Información sobre la cuenta bancaria para procesar tus liquidaciones.
        </Typography>
      </Stack>

      {countries.length > 1 && (
        <CountryPills countries={countries} active={current} onChange={setActiveCountry} />
      )}

      {countries.length > 1 && missingCountries.length > 0 && (
        <ContextBanner variant="warning">
          Te faltan los datos bancarios de:{' '}
          {missingCountries.map(c => COUNTRY_BY_CODE[c]?.name ?? c).join(', ')}.
        </ContextBanner>
      )}

      <SectionDivider>CUENTA BANCARIA</SectionDivider>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="País del banco *"
            value={bank.bankCountry}
            onChange={e => setField('bankCountry', e.target.value)}
          >
            {COUNTRIES.map(c => (
              <MenuItem key={c.code} value={c.code}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box component="span" sx={{ fontSize: 16 }}>{c.flag}</Box>
                  <span>{c.name}</span>
                </Stack>
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Nombre del banco *"
            value={bank.bankName}
            onChange={e => setField('bankName', e.target.value)}
            error={!bank.bankName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Número de cuenta *"
            value={bank.accountNumber}
            onChange={e => setField('accountNumber', e.target.value)}
            error={!bank.accountNumber}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Nombre del titular *"
            value={bank.accountHolder}
            onChange={e => setField('accountHolder', e.target.value)}
            error={!bank.accountHolder}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Dirección del banco"
            value={bank.bankAddress}
            onChange={e => setField('bankAddress', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Número de ruta"
            value={bank.routingNumber}
            onChange={e => setField('routingNumber', e.target.value)}
            helperText="Obligatorio si no usás IBAN"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="IBAN"
            value={bank.iban}
            onChange={e => setField('iban', e.target.value)}
            helperText="Obligatorio si no usás Número de ruta"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Código SWIFT / BIC"
            value={bank.swift}
            onChange={e => setField('swift', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Moneda de la cuenta *"
            value={bank.currency}
            onChange={e => setField('currency', e.target.value)}
          >
            {CURRENCIES.map(c => (
              <MenuItem key={c.code} value={c.code}>
                {c.code} — {c.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <WizardFooter
        onBack={() => navigate('/onboarding/step-2')}
        onContinue={onContinue}
        continueDisabled={!allComplete}
      />
    </Stack>
  );
}

export default Step3InformacionBancaria;
