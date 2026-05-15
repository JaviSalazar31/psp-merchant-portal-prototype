import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { WizardFooter } from './OnboardingLayout';
import SolicitudEnviadaModal from './SolicitudEnviadaModal';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { COUNTRY_BY_CODE } from '@/constants/countries';
import { ONBOARDING_DOCUMENTS } from '@/constants/documentTypes';
import { DEPARTMENTS } from '@/constants/industries';
import { colors } from '@/theme/tokens';

function KV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ paddingY: 0.5 }}>
      <Typography variant="caption" sx={{ width: 200, color: colors.textSecondary, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ flex: 1, color: colors.textPrimary }}>
        {value}
      </Typography>
    </Stack>
  );
}

export function Step6EnviarRevision() {
  const navigate = useNavigate();
  const store = useOnboardingStore();
  const [expanded, setExpanded] = useState<number | false>(1);
  const [showModal, setShowModal] = useState(false);

  const submit = store.submitOnboarding;
  const submitting = store.submitting;

  const completed = useMemo(() => {
    const c = [];
    if (store.step1Data) c.push(1);
    if (store.step2Data) c.push(2);
    if (store.step3Data) c.push(3);
    if (store.step4Data) c.push(4);
    if (store.step5Data) c.push(5);
    return c;
  }, [store.step1Data, store.step2Data, store.step3Data, store.step4Data, store.step5Data]);

  const allComplete = completed.length === 5;
  const canSubmit = allComplete && store.confirmed;

  const onSubmit = async () => {
    await submit();
    setShowModal(true);
  };

  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <Typography variant="h2">Revisá tu información antes de enviar</Typography>
        <Typography variant="body2" color="text.secondary">
          Verificá que todos los datos sean correctos. Una vez enviado, nuestro equipo revisará tu
          solicitud y te contactaremos en las próximas 24-48 horas hábiles.
        </Typography>
      </Stack>

      {/* Step 1 Summary */}
      <SummaryAccordion
        n={1}
        title="Datos de la Empresa"
        expanded={expanded === 1}
        complete={completed.includes(1)}
        onToggle={(v) => setExpanded(v ? 1 : false)}
        onEdit={() => navigate('/onboarding/step-1')}
      >
        {store.step1Data && (
          <>
            <KV label="Razón social" value={store.step1Data.legalName} />
            {store.step1Data.commercialName && (
              <KV label="Nombre comercial" value={store.step1Data.commercialName} />
            )}
            <KV
              label="País residencia fiscal"
              value={COUNTRY_BY_CODE[store.step1Data.fiscalResidenceCountry]?.name ?? '—'}
            />
            <KV
              label="País constitución"
              value={COUNTRY_BY_CODE[store.step1Data.incorporationCountry]?.name ?? '—'}
            />
            <KV label="Número Identificación Fiscal" value={store.step1Data.fiscalId} />
            <KV label="Industria" value={store.step1Data.industry} />
            <KV label="Volumen mensual" value={`${store.step1Data.monthlyVolume} USD`} />
            <KV
              label="Países de operación"
              value={store.step1Data.operationCountries
                .map(c => `${COUNTRY_BY_CODE[c]?.flag} ${COUNTRY_BY_CODE[c]?.name}`)
                .join(', ')}
            />
          </>
        )}
      </SummaryAccordion>

      {/* Step 2 Summary */}
      <SummaryAccordion
        n={2}
        title="Dirección Comercial"
        expanded={expanded === 2}
        complete={completed.includes(2)}
        onToggle={(v) => setExpanded(v ? 2 : false)}
        onEdit={() => navigate('/onboarding/step-2')}
      >
        {store.step2Data &&
          Object.entries(store.step2Data).map(([country, addr]) => (
            <Box key={country} sx={{ pb: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {COUNTRY_BY_CODE[country]?.flag} {COUNTRY_BY_CODE[country]?.name}
              </Typography>
              <KV
                label="Dirección"
                value={`${addr.line1}${addr.line2 ? `, ${addr.line2}` : ''}, ${addr.city}`}
              />
              <KV label="Código postal / Estado" value={`${addr.zip} · ${addr.state}`} />
              <KV label="Teléfono" value={`${addr.phonePrefix} ${addr.phone}`} />
            </Box>
          ))}
      </SummaryAccordion>

      {/* Step 3 Summary */}
      <SummaryAccordion
        n={3}
        title="Información Bancaria"
        expanded={expanded === 3}
        complete={completed.includes(3)}
        onToggle={(v) => setExpanded(v ? 3 : false)}
        onEdit={() => navigate('/onboarding/step-3')}
      >
        {store.step3Data &&
          Object.entries(store.step3Data).map(([country, bank]) => (
            <Box key={country} sx={{ pb: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {COUNTRY_BY_CODE[country]?.flag} {COUNTRY_BY_CODE[country]?.name}
              </Typography>
              <KV label="Banco" value={`${bank.bankName} (${COUNTRY_BY_CODE[bank.bankCountry]?.name ?? '—'})`} />
              <KV
                label="Cuenta"
                value={`**** **** **** ${bank.accountNumber.slice(-4) || '----'} · ${bank.accountHolder}`}
              />
              <KV label="Moneda" value={bank.currency} />
              {bank.cryptoEnabled && (
                <KV
                  label="Wallet cripto"
                  value={`${bank.cryptoNetwork} · ${bank.cryptoWallet.slice(0, 8)}…${bank.cryptoWallet.slice(-6)}`}
                />
              )}
            </Box>
          ))}
      </SummaryAccordion>

      {/* Step 4 Summary */}
      <SummaryAccordion
        n={4}
        title={`Contactos y Escalaciones (${Object.values(store.step4Data ?? {}).reduce((sum, list) => sum + list.length, 0)})`}
        expanded={expanded === 4}
        complete={completed.includes(4)}
        onToggle={(v) => setExpanded(v ? 4 : false)}
        onEdit={() => navigate('/onboarding/step-4')}
      >
        {store.step4Data &&
          Object.entries(store.step4Data).map(([country, contacts]) => (
            <Box key={country} sx={{ pb: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {COUNTRY_BY_CODE[country]?.flag} {COUNTRY_BY_CODE[country]?.name}
              </Typography>
              {contacts.map(c => {
                const dept = DEPARTMENTS.find(d => d.key === c.department);
                return (
                  <KV
                    key={c.id}
                    label={`${c.firstName} ${c.lastName}`}
                    value={`${c.email} · ${dept?.label ?? c.department}`}
                  />
                );
              })}
            </Box>
          ))}
      </SummaryAccordion>

      {/* Step 5 Summary */}
      <SummaryAccordion
        n={5}
        title={(() => {
          const totalRequired = ONBOARDING_DOCUMENTS.filter(d => d.required && !d.conditional).length;
          const totalCountries = Object.keys(store.step5Data ?? {}).length;
          const total = totalRequired * Math.max(1, totalCountries);
          let loaded = 0;
          if (store.step5Data) {
            for (const docs of Object.values(store.step5Data)) {
              loaded += Object.values(docs.single).filter(Boolean).length;
              loaded += Object.values(docs.multi).filter(list => list.length > 0).length;
            }
          }
          return `Documentos (${loaded}/${total} cargados ✓)`;
        })()}
        expanded={expanded === 5}
        complete={completed.includes(5)}
        onToggle={(v) => setExpanded(v ? 5 : false)}
        onEdit={() => navigate('/onboarding/step-5')}
      >
        {store.step5Data &&
          Object.entries(store.step5Data).map(([country, docs]) => (
            <Box key={country} sx={{ pb: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {COUNTRY_BY_CODE[country]?.flag} {COUNTRY_BY_CODE[country]?.name}
              </Typography>
              <Grid container spacing={0.5}>
                {ONBOARDING_DOCUMENTS.map(d => {
                  const isMulti = !!(d.maxFiles && d.maxFiles > 1);
                  const loaded = isMulti
                    ? (docs.multi[d.key]?.length ?? 0) > 0
                    : !!docs.single[d.key];
                  return (
                    <Grid item xs={12} sm={6} key={d.key}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <CheckCircleIcon
                          sx={{
                            fontSize: 14,
                            color: loaded ? colors.pwReqMet : colors.textMuted,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ color: loaded ? colors.textPrimary : colors.textMuted }}
                        >
                          {d.label}
                        </Typography>
                      </Stack>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          ))}
      </SummaryAccordion>

      <FormControlLabel
        control={
          <Checkbox
            checked={store.confirmed}
            onChange={e => store.setConfirmed(e.target.checked)}
            sx={{ color: colors.borderStrong, '&.Mui-checked': { color: colors.brandPrimary } }}
          />
        }
        label={
          <Typography variant="body2">
            Confirmo que la información proporcionada es verídica y completa.
          </Typography>
        }
      />

      <WizardFooter
        onBack={() => navigate('/onboarding/step-5')}
        onContinue={onSubmit}
        isLastStep
        continueLabel="Enviar para revisión"
        continueDisabled={!canSubmit}
        submitting={submitting}
      />

      <Backdrop
        open={submitting}
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.modal + 1, flexDirection: 'column', gap: 2 }}
      >
        <CircularProgress sx={{ color: colors.brandPrimary }} />
        <Typography variant="body1">Enviando tu solicitud…</Typography>
      </Backdrop>

      <SolicitudEnviadaModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          navigate('/review-pending', { replace: true });
        }}
      />
    </Stack>
  );
}

interface SummaryAccordionProps {
  n: number;
  title: string;
  expanded: boolean;
  complete: boolean;
  onToggle: (v: boolean) => void;
  onEdit: () => void;
  children: React.ReactNode;
}

function SummaryAccordion({
  n,
  title,
  expanded,
  complete,
  onToggle,
  onEdit,
  children,
}: SummaryAccordionProps) {
  return (
    <Accordion
      expanded={expanded}
      onChange={(_, v) => onToggle(v)}
      disableGutters
      square={false}
      sx={{
        border: `1px solid ${colors.borderDefault}`,
        borderRadius: 2,
        '&:before': { display: 'none' },
        boxShadow: 'none',
        overflow: 'hidden',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: expanded ? colors.bgSubtle : colors.bgCard,
          '& .MuiAccordionSummary-content': { alignItems: 'center' },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flex: 1 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: complete ? colors.brandPrimary : colors.bgCard,
              border: `1.5px solid ${complete ? colors.brandPrimary : colors.borderStrong}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: colors.brandDarkest,
            }}
          >
            {complete ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : n}
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 600, flex: 1 }}>
            {title}
          </Typography>
        </Stack>
        <Link
          component="button"
          onClick={e => {
            e.stopPropagation();
            onEdit();
          }}
          variant="caption"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
            fontWeight: 600,
            mr: 1,
          }}
        >
          <EditOutlinedIcon sx={{ fontSize: 14 }} />
          Editar
        </Link>
      </AccordionSummary>
      <AccordionDetails sx={{ paddingTop: 0 }}>{children}</AccordionDetails>
    </Accordion>
  );
}

export default Step6EnviarRevision;
