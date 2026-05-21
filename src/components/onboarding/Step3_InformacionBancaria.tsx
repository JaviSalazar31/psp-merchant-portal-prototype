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
import { COUNTRIES, COUNTRY_BY_CODE, countryToCurrency } from '@/constants/countries';
import { CURRENCY_BY_CODE } from '@/constants/currencies';
import { useOnboardingStore, type BankAccountData, type Step3Data } from '@/stores/onboardingStore';
import { toast } from '@/stores/toastStore';

/**
 * Step 3 — Información Bancaria.
 *
 * Cambios 21/05 con Producto:
 * - Campos específicos por país (MX/BR/CO). USD ya no aparece como opción
 *   de moneda — la moneda queda atada a la moneda local del país del banco.
 * - Se quitan IBAN, Número de ruta y SWIFT (no aplican para transferencias
 *   locales en LATAM; cada país tiene su propia infraestructura).
 *
 * Requisitos por país (alineado a buenas prácticas de mercado fintech LATAM):
 * - México: CLABE de 18 dígitos + Nombre del banco + Titular
 * - Brasil: Agencia + Cuenta + Tipo (corriente/ahorros) + CPF/CNPJ del titular
 *   + Banco
 * - Colombia: Número de cuenta + Tipo (corriente/ahorros) + Banco + Titular
 */

function emptyBank(country: string): BankAccountData {
  return {
    bankCountry: country,
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    bankAddress: '',
    clabe: '',
    agencyNumber: '',
    accountType: '',
    holderDocumentType: '',
    holderDocumentNumber: '',
    currency: countryToCurrency(country),
  };
}

function isBankValid(b: BankAccountData | undefined): boolean {
  if (!b) return false;
  const baseValid = !!b.bankCountry && !!b.bankName && !!b.accountHolder && !!b.currency;
  if (!baseValid) return false;
  switch (b.bankCountry) {
    case 'MX':
      // CLABE: 18 dígitos exactos
      return !!b.clabe && /^[0-9]{18}$/.test(b.clabe);
    case 'BR':
      return (
        !!b.agencyNumber &&
        !!b.accountNumber &&
        !!b.accountType &&
        !!b.holderDocumentType &&
        !!b.holderDocumentNumber
      );
    case 'CO':
      return !!b.accountNumber && !!b.accountType && !!b.holderDocumentNumber;
    default:
      return !!b.accountNumber;
  }
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

  // Cambiar el país del banco también resetea la moneda a la moneda local del país
  const setBankCountry = (newCountry: string) => {
    if (!current) return;
    setByCountry(prev => ({
      ...prev,
      [current]: {
        ...(prev[current] ?? emptyBank(current)),
        bankCountry: newCountry,
        currency: countryToCurrency(newCountry),
      },
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

  const countryLabel = COUNTRY_BY_CODE[bank.bankCountry]?.name ?? bank.bankCountry;
  const currencyLabel = CURRENCY_BY_CODE[bank.currency]?.name ?? bank.currency;

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
            onChange={e => setBankCountry(e.target.value)}
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
            helperText={!bank.bankName ? 'Ingresá el nombre de la institución' : ''}
          />
        </Grid>

        {/* Campos específicos por país */}
        {bank.bankCountry === 'MX' && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                label="CLABE * (18 dígitos)"
                value={bank.clabe ?? ''}
                onChange={e => setField('clabe', e.target.value.replace(/\D/g, '').slice(0, 18))}
                error={!!bank.clabe && bank.clabe.length !== 18}
                helperText={
                  !bank.clabe
                    ? 'Clave Bancaria Estandarizada de 18 dígitos'
                    : bank.clabe.length !== 18
                    ? `Faltan ${18 - bank.clabe.length} dígitos`
                    : '✓ CLABE válida'
                }
                inputProps={{ inputMode: 'numeric', maxLength: 18 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nombre del titular *"
                value={bank.accountHolder}
                onChange={e => setField('accountHolder', e.target.value)}
                error={!bank.accountHolder}
                helperText="Nombre que figura en la cuenta bancaria"
              />
            </Grid>
          </>
        )}

        {bank.bankCountry === 'BR' && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                label="Agencia * (4-5 dígitos)"
                value={bank.agencyNumber ?? ''}
                onChange={e => setField('agencyNumber', e.target.value.replace(/\D/g, '').slice(0, 5))}
                error={!!bank.agencyNumber && bank.agencyNumber.length < 4}
                helperText={!bank.agencyNumber ? 'Número de agencia del banco' : ''}
                inputProps={{ inputMode: 'numeric', maxLength: 5 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Número de cuenta *"
                value={bank.accountNumber}
                onChange={e => setField('accountNumber', e.target.value.replace(/[^0-9\-]/g, ''))}
                error={!bank.accountNumber}
                helperText="Incluye el dígito verificador (ej: 12345-6)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Tipo de cuenta *"
                value={bank.accountType ?? ''}
                onChange={e => setField('accountType', e.target.value as 'corriente' | 'ahorros' | '')}
                error={!bank.accountType}
              >
                <MenuItem value="corriente">Conta Corrente</MenuItem>
                <MenuItem value="ahorros">Conta Poupança</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nombre del titular *"
                value={bank.accountHolder}
                onChange={e => setField('accountHolder', e.target.value)}
                error={!bank.accountHolder}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Tipo de documento del titular *"
                value={bank.holderDocumentType ?? ''}
                onChange={e =>
                  setField('holderDocumentType', e.target.value as 'CPF' | 'CNPJ' | '')
                }
                error={!bank.holderDocumentType}
              >
                <MenuItem value="CPF">CPF (persona física)</MenuItem>
                <MenuItem value="CNPJ">CNPJ (persona jurídica)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={`${bank.holderDocumentType || 'CPF/CNPJ'} del titular *`}
                value={bank.holderDocumentNumber ?? ''}
                onChange={e => setField('holderDocumentNumber', e.target.value)}
                error={!bank.holderDocumentNumber}
                helperText={
                  bank.holderDocumentType === 'CPF'
                    ? '000.000.000-00'
                    : bank.holderDocumentType === 'CNPJ'
                    ? '00.000.000/0000-00'
                    : ''
                }
              />
            </Grid>
          </>
        )}

        {bank.bankCountry === 'CO' && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                label="Número de cuenta *"
                value={bank.accountNumber}
                onChange={e => setField('accountNumber', e.target.value.replace(/\D/g, ''))}
                error={!bank.accountNumber}
                helperText="Solo dígitos"
                inputProps={{ inputMode: 'numeric' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Tipo de cuenta *"
                value={bank.accountType ?? ''}
                onChange={e => setField('accountType', e.target.value as 'corriente' | 'ahorros' | '')}
                error={!bank.accountType}
              >
                <MenuItem value="corriente">Cuenta corriente</MenuItem>
                <MenuItem value="ahorros">Cuenta de ahorros</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nombre del titular *"
                value={bank.accountHolder}
                onChange={e => setField('accountHolder', e.target.value)}
                error={!bank.accountHolder}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Cédula o NIT del titular *"
                value={bank.holderDocumentNumber ?? ''}
                onChange={e => setField('holderDocumentNumber', e.target.value)}
                error={!bank.holderDocumentNumber}
                helperText="Documento que valida la titularidad"
              />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <TextField
            label="Dirección del banco"
            value={bank.bankAddress}
            onChange={e => setField('bankAddress', e.target.value)}
            helperText="Opcional"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Moneda de la cuenta"
            value={`${bank.currency} — ${currencyLabel}`}
            disabled
            helperText={`Moneda local de ${countryLabel} (no editable)`}
          />
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
