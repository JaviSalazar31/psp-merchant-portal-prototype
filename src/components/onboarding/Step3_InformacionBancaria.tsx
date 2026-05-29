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
import { COUNTRY_BY_CODE, countryToCurrency } from '@/constants/countries';
import {
  isValidCLABE,
  isValidCPF,
  isValidCNPJ,
  isValidCedulaCO,
  isValidNIT,
} from '@/constants/fiscalIdValidators';
import { useOnboardingStore, type BankAccountData, type Step3Data } from '@/stores/onboardingStore';
import { toast } from '@/stores/toastStore';

/**
 * Campos por país (Fase 1):
 *   MX → CLABE (18 dígitos) + Banco + Titular
 *   BR → Banco + Agencia + Cuenta + Tipo cuenta + Tipo doc + Documento titular
 *   CO → Banco + Cuenta + Tipo cuenta + Cédula/NIT del titular
 *
 * La moneda es derivada del país (no editable): MXN/BRL/COP.
 */

const BR_ACCOUNT_TYPES = [
  { value: 'corriente', label: 'Cuenta corriente' },
  { value: 'poupanca', label: 'Cuenta poupança' },
];

const CO_ACCOUNT_TYPES = [
  { value: 'corriente', label: 'Cuenta corriente' },
  { value: 'ahorros', label: 'Cuenta de ahorros' },
];

const BR_DOC_TYPES = [
  { value: 'CPF', label: 'CPF' },
  { value: 'CNPJ', label: 'CNPJ' },
];

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
    currency: countryToCurrency(country) ?? 'USD',
    accountType: country === 'BR' ? 'corriente' : country === 'CO' ? 'corriente' : '',
    branchCode: '',
    holderDocumentType: country === 'BR' ? 'CNPJ' : '',
    holderDocument: '',
  };
}

function isBankValid(b: BankAccountData | undefined): boolean {
  if (!b) return false;
  if (!b.bankName) return false;
  if (!b.accountHolder) return false;

  switch (b.bankCountry) {
    case 'MX':
      return isValidCLABE(b.accountNumber);
    case 'BR': {
      if (!b.accountNumber) return false;
      if (!b.branchCode || !/^[0-9]{4,5}$/.test(b.branchCode)) return false;
      if (!b.accountType) return false;
      if (!b.holderDocumentType) return false;
      if (b.holderDocumentType === 'CPF' && !isValidCPF(b.holderDocument ?? '')) return false;
      if (b.holderDocumentType === 'CNPJ' && !isValidCNPJ(b.holderDocument ?? '')) return false;
      return true;
    }
    case 'CO':
      if (!b.accountNumber) return false;
      if (!b.accountType) return false;
      // Acepta cédula o NIT del titular.
      return isValidCedulaCO(b.holderDocument ?? '') || isValidNIT(b.holderDocument ?? '');
    default:
      // Fallback genérico.
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

  // Helpers para validación inline de cada campo según país.
  const mxClabeError =
    bank.bankCountry === 'MX' &&
    !!bank.accountNumber &&
    !isValidCLABE(bank.accountNumber)
      ? 'CLABE inválida (deben ser 18 dígitos con verificador correcto)'
      : '';

  const brDocError =
    bank.bankCountry === 'BR' && !!bank.holderDocument
      ? bank.holderDocumentType === 'CPF' && !isValidCPF(bank.holderDocument)
        ? 'CPF inválido'
        : bank.holderDocumentType === 'CNPJ' && !isValidCNPJ(bank.holderDocument)
        ? 'CNPJ inválido'
        : ''
      : '';

  const brBranchError =
    bank.bankCountry === 'BR' &&
    !!bank.branchCode &&
    !/^[0-9]{4,5}$/.test(bank.branchCode ?? '')
      ? 'Agencia debe tener 4 o 5 dígitos'
      : '';

  const coDocError =
    bank.bankCountry === 'CO' && !!bank.holderDocument
      ? !isValidCedulaCO(bank.holderDocument) && !isValidNIT(bank.holderDocument)
        ? 'Documento inválido (cédula 6-10 dígitos o NIT con verificador)'
        : ''
      : '';

  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <Typography variant="h2">Información Bancaria</Typography>
        <Typography variant="body2" color="text.secondary">
          Cuenta bancaria local del país para procesar tus liquidaciones.
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

      <SectionDivider>CUENTA BANCARIA — {COUNTRY_BY_CODE[current]?.name?.toUpperCase()}</SectionDivider>

      <Grid container spacing={2}>
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
            label="Nombre del titular *"
            value={bank.accountHolder}
            onChange={e => setField('accountHolder', e.target.value)}
            error={!bank.accountHolder}
          />
        </Grid>

        {/* === MÉXICO: CLABE === */}
        {bank.bankCountry === 'MX' && (
          <Grid item xs={12}>
            <TextField
              label="CLABE Interbancaria * (18 dígitos)"
              value={bank.accountNumber}
              onChange={e =>
                setField('accountNumber', e.target.value.replace(/\D/g, '').slice(0, 18))
              }
              error={!!mxClabeError}
              helperText={mxClabeError || 'Verificamos dígito verificador SPEI automáticamente.'}
              inputProps={{ inputMode: 'numeric', maxLength: 18 }}
            />
          </Grid>
        )}

        {/* === BRASIL: Agencia + Cuenta + Tipo + CPF/CNPJ === */}
        {bank.bankCountry === 'BR' && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                label="Agencia * (4-5 dígitos)"
                value={bank.branchCode ?? ''}
                onChange={e =>
                  setField('branchCode', e.target.value.replace(/\D/g, '').slice(0, 5))
                }
                error={!!brBranchError}
                helperText={brBranchError}
                inputProps={{ inputMode: 'numeric', maxLength: 5 }}
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
                select
                label="Tipo de cuenta *"
                value={bank.accountType ?? 'corriente'}
                onChange={e => setField('accountType', e.target.value)}
              >
                {BR_ACCOUNT_TYPES.map(t => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Documento del titular *"
                value={bank.holderDocumentType ?? 'CNPJ'}
                onChange={e => setField('holderDocumentType', e.target.value)}
              >
                {BR_DOC_TYPES.map(t => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={`${bank.holderDocumentType ?? 'CNPJ'} del titular *`}
                value={bank.holderDocument ?? ''}
                onChange={e => setField('holderDocument', e.target.value)}
                error={!!brDocError}
                helperText={brDocError}
                placeholder={bank.holderDocumentType === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
              />
            </Grid>
          </>
        )}

        {/* === COLOMBIA: Cuenta + Tipo + Cédula/NIT === */}
        {bank.bankCountry === 'CO' && (
          <>
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
                select
                label="Tipo de cuenta *"
                value={bank.accountType ?? 'corriente'}
                onChange={e => setField('accountType', e.target.value)}
              >
                {CO_ACCOUNT_TYPES.map(t => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Cédula o NIT del titular *"
                value={bank.holderDocument ?? ''}
                onChange={e => setField('holderDocument', e.target.value)}
                error={!!coDocError}
                helperText={coDocError ?? 'Cédula (6-10 dígitos) o NIT (con dígito verificador DIAN)'}
              />
            </Grid>
          </>
        )}

        {/* === FALLBACK genérico para países sin lógica específica === */}
        {!['MX', 'BR', 'CO'].includes(bank.bankCountry) && (
          <Grid item xs={12}>
            <TextField
              label="Número de cuenta *"
              value={bank.accountNumber}
              onChange={e => setField('accountNumber', e.target.value)}
              error={!bank.accountNumber}
            />
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <TextField
            label="Moneda de la cuenta"
            value={bank.currency}
            disabled
            helperText="Se deriva automáticamente del país"
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
