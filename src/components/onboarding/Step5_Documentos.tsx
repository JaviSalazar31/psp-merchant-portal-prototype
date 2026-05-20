import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { WizardFooter } from './OnboardingLayout';
import SectionDivider from './SectionDivider';
import CountryPills from '@/components/common/CountryPills';
import ContextBanner from '@/components/common/ContextBanner';
import DocumentUploadCard from '@/components/common/DocumentUploadCard';
import { COUNTRY_BY_CODE } from '@/constants/countries';
import { ONBOARDING_DOCUMENTS } from '@/constants/documentTypes';
import {
  useOnboardingStore,
  type Step5Data,
  type CountryDocuments,
  type UploadedDocument,
} from '@/stores/onboardingStore';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';
import { generateKycDocx, kycDocxFilename, type KycCountry } from '@/utils/kyc/kycGenerator';

function emptyCountryDocs(): CountryDocuments {
  return { single: {}, multi: {} };
}

function isCountryDocsComplete(docs: CountryDocuments | undefined): boolean {
  if (!docs) return false;
  for (const doc of ONBOARDING_DOCUMENTS) {
    if (!doc.required) continue;
    // En Fase 1 no hay documentos condicionales activos (la rama crypto se postergó a V2).
    if (doc.conditional) continue;
    if (doc.maxFiles && doc.maxFiles > 1) {
      const list = docs.multi[doc.key];
      if (!list || list.length === 0) return false;
    } else {
      const single = docs.single[doc.key];
      if (!single) return false;
    }
  }
  return true;
}

export function Step5Documentos() {
  const navigate = useNavigate();
  const countries = useOnboardingStore(s => s.countriesSelected);
  const activeCountry = useOnboardingStore(s => s.activeCountry);
  const setActiveCountry = useOnboardingStore(s => s.setActiveCountry);
  const existing = useOnboardingStore(s => s.step5Data);
  const setStep5Data = useOnboardingStore(s => s.setStep5Data);

  const [byCountry, setByCountry] = useState<Step5Data>(() => {
    const init: Step5Data = {};
    for (const c of countries) init[c] = existing?.[c] ?? emptyCountryDocs();
    return init;
  });

  useEffect(() => {
    if (countries.length === 0) navigate('/onboarding/step-1');
  }, [countries, navigate]);

  const current = activeCountry ?? countries[0];
  const docs = current ? byCountry[current] ?? emptyCountryDocs() : null;

  const missingCountries = countries.filter(c => !isCountryDocsComplete(byCountry[c]));
  const allComplete = countries.length > 0 && missingCountries.length === 0;

  const setSingle = (key: string, file: UploadedDocument | null) => {
    if (!current) return;
    setByCountry(prev => ({
      ...prev,
      [current]: {
        single: { ...(prev[current]?.single ?? {}), [key]: file },
        multi: prev[current]?.multi ?? {},
      },
    }));
  };

  const setMulti = (key: string, files: UploadedDocument[]) => {
    if (!current) return;
    setByCountry(prev => ({
      ...prev,
      [current]: {
        single: prev[current]?.single ?? {},
        multi: { ...(prev[current]?.multi ?? {}), [key]: files },
      },
    }));
  };

  const onContinue = () => {
    for (const c of countries) {
      if (!isCountryDocsComplete(byCountry[c])) {
        toast.error(`Faltan documentos obligatorios para ${c}.`);
        setActiveCountry(c);
        return;
      }
    }
    setStep5Data(byCountry);
    navigate('/onboarding/step-6');
  };

  const handleDownloadTemplate = async () => {
    if (!current) return;
    // País activo del wizard se mapea al template KYC correcto.
    // MX/CO comparten template (formato PayCash adaptado a marca PSP).
    // BR usa un template propio adaptado a la regulación brasileña (BACEN, Lei 9.613/1998).
    const kycCountry: KycCountry | null =
      current === 'MX' ? 'MX' : current === 'CO' ? 'CO' : current === 'BR' ? 'BR' : null;
    if (!kycCountry) {
      toast.error(`No hay plantilla KYC disponible para ${current}.`);
      return;
    }
    try {
      const blob = await generateKycDocx(kycCountry);
      saveAs(blob, kycDocxFilename(kycCountry));
      const countryName = COUNTRY_BY_CODE[current]?.name ?? current;
      toast.success(`Plantilla KYC de ${countryName} descargada.`);
    } catch (err) {
      console.error('Error generando plantilla KYC:', err);
      toast.error('No se pudo generar la plantilla KYC. Intentá de nuevo.');
    }
  };

  if (!docs || !current) return null;

  const sectionDocs = (section: 'kyc' | 'company' | 'fiscal' | 'ubo') =>
    ONBOARDING_DOCUMENTS.filter(d => d.section === section && !d.conditional);

  const renderDoc = (key: string, label: string, required: boolean, maxFiles?: number, hint?: string) => {
    const isMulti = !!(maxFiles && maxFiles > 1);
    const files = isMulti ? (docs.multi[key] ?? []) : docs.single[key] ? [docs.single[key]!] : [];
    return (
      <DocumentUploadCard
        key={key}
        label={label}
        required={required}
        maxFiles={maxFiles ?? 1}
        hint={hint}
        files={files}
        onChange={list => {
          if (isMulti) {
            setMulti(
              key,
              list.map(f => ({ ...f, uploadedAt: new Date() })),
            );
          } else {
            setSingle(key, list[0] ? { ...list[0], uploadedAt: new Date() } : null);
          }
        }}
      />
    );
  };

  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <Typography variant="h2">Documentos</Typography>
        <Typography variant="body2" color="text.secondary">
          Nos ayudan a validar la identidad y situación legal de tu empresa, necesario para cumplir con la
          regulación vigente. Todos los archivos deben estar en formato PDF y no superar los 10 MB.
        </Typography>
      </Stack>

      {countries.length > 1 && (
        <CountryPills countries={countries} active={current} onChange={setActiveCountry} />
      )}

      {countries.length > 1 && missingCountries.length > 0 && (
        <ContextBanner variant="warning">
          Te faltan documentos obligatorios de:{' '}
          {missingCountries.map(c => COUNTRY_BY_CODE[c]?.name ?? c).join(', ')}.
        </ContextBanner>
      )}

      <SectionDivider>DOCUMENTO KYC</SectionDivider>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
      >
        <Typography variant="body2" color="text.secondary">
          Una vez completada y firmada por el representante legal, cargala acá.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon fontSize="small" />}
          onClick={handleDownloadTemplate}
          sx={{
            borderColor: colors.brandPrimary,
            color: colors.brandPrimaryDark,
            '&:hover': { borderColor: colors.brandPrimary, backgroundColor: 'rgba(124, 255, 69, 0.08)' },
          }}
        >
          Descargar plantilla KYC (Word)
        </Button>
      </Stack>

      {sectionDocs('kyc').map(d => renderDoc(d.key, d.label, d.required, d.maxFiles))}

      <SectionDivider>DOCUMENTACIÓN DE LA EMPRESA</SectionDivider>

      <Grid container spacing={2}>
        {sectionDocs('company').map(d => (
          <Grid item xs={12} md={6} key={d.key}>
            {renderDoc(d.key, d.label, d.required, d.maxFiles)}
          </Grid>
        ))}
      </Grid>

      <SectionDivider>DOCUMENTACIÓN FISCAL Y LEGAL</SectionDivider>

      <Grid container spacing={2}>
        {sectionDocs('fiscal').map(d => (
          <Grid item xs={12} md={6} key={d.key}>
            {renderDoc(d.key, d.label, d.required, d.maxFiles, d.key === 'comprobante_domicilio_empresa' ? 'máx. 3 meses' : undefined)}
          </Grid>
        ))}
      </Grid>

      <SectionDivider>DOCUMENTACIÓN UBOs / DIRECTORES</SectionDivider>

      <ContextBanner variant="warning">
        Los siguientes documentos aplican para cada UBO con participación mayor al 10% y para cada Director
        Ejecutivo.
      </ContextBanner>

      {sectionDocs('ubo').map(d => {
        const useCol = d.key !== 'ubo_ids';
        if (!useCol) return <Box key={d.key}>{renderDoc(d.key, d.label, d.required, d.maxFiles)}</Box>;
        return null;
      })}

      <Grid container spacing={2}>
        {sectionDocs('ubo')
          .filter(d => d.key !== 'ubo_ids')
          .map(d => (
            <Grid item xs={12} md={6} key={d.key}>
              {renderDoc(d.key, d.label, d.required, d.maxFiles)}
            </Grid>
          ))}
      </Grid>

      <ContextBanner variant="info" icon={<LockOutlinedIcon sx={{ fontSize: 20 }} />}>
        Tus documentos están protegidos con encriptación AES-256. Solo personal autorizado tendrá acceso
        durante la revisión.
      </ContextBanner>

      <WizardFooter
        onBack={() => navigate('/onboarding/step-4')}
        onContinue={onContinue}
        continueDisabled={!allComplete}
      />
    </Stack>
  );
}

export default Step5Documentos;
