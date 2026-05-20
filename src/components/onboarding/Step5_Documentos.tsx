import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { WizardFooter } from './OnboardingLayout';
import SectionDivider from './SectionDivider';
import ContextBanner from '@/components/common/ContextBanner';
import DocumentUploadCard from '@/components/common/DocumentUploadCard';
import {
  resolveDocLabel,
  visibleDocsFor,
  type DocumentDef,
  type IncorporationCountry,
} from '@/constants/documentTypes';
import {
  useOnboardingStore,
  type EntityDocuments,
  type UploadedDocument,
} from '@/stores/onboardingStore';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';
import { generateKycDocx, kycDocxFilename, type KycCountry } from '@/utils/kyc/kycGenerator';

function emptyDocs(): EntityDocuments {
  return { single: {}, multi: {} };
}

function isComplete(docs: EntityDocuments, visible: DocumentDef[]): boolean {
  for (const doc of visible) {
    if (!doc.required) continue;
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
  const step1 = useOnboardingStore(s => s.step1Data);
  const existing = useOnboardingStore(s => s.step5Data);
  const setStep5Data = useOnboardingStore(s => s.setStep5Data);

  // País de constitución de la entidad (definido en Step 1). Determina:
  // - qué KYC se descarga (MX/CO/BR)
  // - si aparece el campo Poder Legal (solo MX)
  // - la etiqueta del documento fiscal (RFC / NIT / CNPJ)
  const incorporation = (step1?.incorporationCountry ?? null) as IncorporationCountry | null;

  const [docs, setDocs] = useState<EntityDocuments>(() => existing ?? emptyDocs());

  useEffect(() => {
    // Si el usuario llegó acá sin haber definido país de constitución, lo mandamos al Step 1.
    if (!step1?.incorporationCountry) navigate('/onboarding/step-1');
  }, [step1, navigate]);

  const visibleDocs = visibleDocsFor(incorporation);
  const allComplete = isComplete(docs, visibleDocs);

  const setSingle = (key: string, file: UploadedDocument | null) => {
    setDocs(prev => ({
      single: { ...prev.single, [key]: file },
      multi: prev.multi,
    }));
  };

  const setMulti = (key: string, files: UploadedDocument[]) => {
    setDocs(prev => ({
      single: prev.single,
      multi: { ...prev.multi, [key]: files },
    }));
  };

  const onContinue = () => {
    if (!allComplete) {
      toast.error('Faltan documentos obligatorios.');
      return;
    }
    setStep5Data(docs);
    navigate('/onboarding/step-6');
  };

  const handleDownloadTemplate = async () => {
    if (!incorporation) {
      toast.error('Definí el país de constitución en el Paso 1 antes de descargar el KYC.');
      return;
    }
    try {
      const blob = await generateKycDocx(incorporation as KycCountry);
      saveAs(blob, kycDocxFilename(incorporation as KycCountry));
      toast.success('Plantilla KYC descargada.');
    } catch (err) {
      console.error('Error generando plantilla KYC:', err);
      toast.error('No se pudo generar la plantilla KYC. Intentá de nuevo.');
    }
  };

  const renderDoc = (doc: DocumentDef) => {
    const isMulti = !!(doc.maxFiles && doc.maxFiles > 1);
    const files = isMulti
      ? (docs.multi[doc.key] ?? [])
      : docs.single[doc.key]
      ? [docs.single[doc.key]!]
      : [];
    const label = resolveDocLabel(doc, incorporation);
    return (
      <DocumentUploadCard
        key={doc.key}
        label={label}
        required={doc.required}
        maxFiles={doc.maxFiles ?? 1}
        hint={doc.hint}
        acceptedFormats={doc.acceptedFormats}
        files={files}
        onChange={list => {
          if (isMulti) {
            setMulti(
              doc.key,
              list.map(f => ({ ...f, uploadedAt: new Date() })),
            );
          } else {
            setSingle(doc.key, list[0] ? { ...list[0], uploadedAt: new Date() } : null);
          }
        }}
      />
    );
  };

  const kycDoc = visibleDocs.find(d => d.section === 'kyc');
  const entityDocs = visibleDocs.filter(d => d.section === 'entity');

  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <Typography variant="h2">Documentos</Typography>
        <Typography variant="body2" color="text.secondary">
          Nos ayudan a validar la identidad y situación legal de tu empresa, necesario para cumplir con la
          regulación vigente. Salvo el logotipo, todos los archivos deben estar en formato PDF y no superar
          los 10 MB.
        </Typography>
      </Stack>

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

      {kycDoc && renderDoc(kycDoc)}

      <SectionDivider>DOCUMENTOS DE LA ENTIDAD LEGAL</SectionDivider>

      <ContextBanner variant="info">
        Estos documentos corresponden a tu entidad legal. Si operás con entidades legales distintas en otros
        países, contactá a soporte.
      </ContextBanner>

      <Grid container spacing={2}>
        {entityDocs.map(d => (
          <Grid item xs={12} md={6} key={d.key}>
            {renderDoc(d)}
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
