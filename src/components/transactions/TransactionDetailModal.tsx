import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StatusBadge from '@/components/common/StatusBadge';
import ContextBanner from '@/components/common/ContextBanner';
import type { MockTransaction, TransactionEvent } from '@/mocks/transactions';
import { TRANSACTION_STATES } from '@/constants/transactionStates';
import { COUNTRY_BY_CODE } from '@/constants/countries';
import { PAYMENT_METHOD_BY_KEY } from '@/constants/paymentMethods';
import { formatCurrency } from '@/constants/currencies';
import { friendlyErrorMessage } from '@/constants/errorMessages';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';

interface Props {
  transaction: MockTransaction | null;
  open: boolean;
  onClose: () => void;
}

function fmtDateTime(d: Date): string {
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}

function fmtTimelineTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}

function KV({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ paddingY: 0.5 }}>
      <Typography variant="caption" sx={{ width: 200, color: colors.textSecondary, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          flex: 1,
          color: colors.textPrimary,
          fontFamily: mono ? 'monospace' : 'inherit',
          fontSize: mono ? 12 : undefined,
          wordBreak: 'break-all',
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

function CopyableId({ value }: { value: string }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ display: 'inline-flex' }}>
      <Box component="span" sx={{ fontFamily: 'monospace', fontSize: 12 }}>
        {value}
      </Box>
      <Tooltip title="Copiar">
        <IconButton
          size="small"
          onClick={e => {
            e.stopPropagation();
            navigator.clipboard?.writeText(value).catch(() => {});
            toast.info('ID copiado al portapapeles.');
          }}
        >
          <ContentCopyIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

export function TransactionDetailModal({ transaction, open, onClose }: Props) {
  const [tab, setTab] = useState<'general' | 'detalle' | 'eventos' | 'cep' | 'comisiones'>('general');

  if (!transaction) return null;

  const meta = TRANSACTION_STATES[transaction.status];
  const showCEP = transaction.country === 'MX' && transaction.paymentMethod === 'SPEI';
  const country = COUNTRY_BY_CODE[transaction.country];
  const method = PAYMENT_METHOD_BY_KEY[transaction.paymentMethod];
  const isFinalError = transaction.status === 'FALLIDO' || transaction.status === 'RECHAZADO';

  const handleExportPdf = () => {
    const stamp = transaction.id.slice(0, 18);
    const blob = new Blob(
      [`Comprobante simulado · PSP\n\nID: ${transaction.id}\nMonto: ${formatCurrency(transaction.amount, transaction.currency)}\nEstado: ${meta.label}`],
      { type: 'application/pdf' },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `psp-tx-${stamp}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Comprobante exportado.');
  };

  const renderBanner = () => {
    if (transaction.status === 'AUTORIZADO' && transaction.approvedAt) {
      return (
        <ContextBanner variant="success">
          Pago autorizado por {formatCurrency(transaction.amount, transaction.currency)} el{' '}
          {fmtDateTime(transaction.approvedAt)}.
          {transaction.partnerReference && ` · Referencia partner: ${transaction.partnerReference}`}
        </ContextBanner>
      );
    }
    if (transaction.status === 'PENDIENTE') {
      return (
        <ContextBanner variant="warning">
          Esperando confirmación del partner de pago. Esto puede tardar unos minutos.
        </ContextBanner>
      );
    }
    if (transaction.status === 'EN_REVISION') {
      return (
        <ContextBanner variant="warning">
          La transacción fue marcada para revisión manual por riesgo elevado. Te avisaremos cuando se resuelva.
        </ContextBanner>
      );
    }
    if (transaction.status === 'EN_DISPUTA') {
      return (
        <ContextBanner variant="error">
          El tarjetahabiente abrió una disputa con el banco emisor. Operaciones se va a contactar con vos.
        </ContextBanner>
      );
    }
    if (transaction.status === 'REEMBOLSADO') {
      return (
        <ContextBanner variant="info">
          Reembolso aprobado y procesado por {formatCurrency(transaction.amount, transaction.currency)}.
        </ContextBanner>
      );
    }
    if (isFinalError) {
      // Adenda Cambio 7: mensaje amigable.
      return (
        <ContextBanner variant="error" title={meta.label}>
          {friendlyErrorMessage(transaction.errorCode)}
        </ContextBanner>
      );
    }
    return null;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      slotProps={{ paper: { sx: { borderRadius: 2, maxHeight: '90vh' } } }}
    >
      <DialogTitle sx={{ pr: 6, paddingBottom: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
          <Typography variant="h4" sx={{ minWidth: 0 }}>
            Transacción
          </Typography>
          <CopyableId value={transaction.id} />
        </Stack>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 12, top: 12 }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box sx={{ paddingX: 3, paddingBottom: 1 }}>{renderBanner()}</Box>

      <Box sx={{ borderBottom: `1px solid ${colors.borderDefault}`, paddingX: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" allowScrollButtonsMobile>
          <Tab value="general" label="General" />
          <Tab value="detalle" label="Detalle" />
          <Tab value="eventos" label="Eventos" />
          {showCEP && <Tab value="cep" label="CEP Banxico" />}
          <Tab value="comisiones" label="Comisiones" />
        </Tabs>
      </Box>

      <DialogContent sx={{ pt: 2.5 }}>
        {tab === 'general' && (
          <Stack spacing={1}>
            <Grid container spacing={1.5}>
              <Grid item xs={12} md={6}>
                <KV label="ID transacción" value={<CopyableId value={transaction.id} />} />
                <KV label="Referencia" value={<Box sx={{ fontFamily: 'monospace', fontSize: 12 }}>{transaction.reference}</Box>} />
                <KV label="Tipo" value={transaction.type === 'pay-in' ? 'Pay-In' : 'Pay-Out'} />
                <KV label="Estado" value={<StatusBadge status={transaction.status} />} />
              </Grid>
              <Grid item xs={12} md={6}>
                <KV label="Fecha creación" value={fmtDateTime(transaction.createdAt)} />
                <KV
                  label="Fecha aprobación"
                  value={transaction.approvedAt ? fmtDateTime(transaction.approvedAt) : '—'}
                />
                <KV
                  label="País"
                  value={
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <Box component="span">{country?.flag}</Box>
                      <span>{country?.name}</span>
                    </Stack>
                  }
                />
                <KV label="Método de pago" value={method?.label ?? transaction.paymentMethod} />
              </Grid>
            </Grid>

            <Divider sx={{ my: 1.5 }} />

            <Grid container spacing={1.5}>
              <Grid item xs={6} md={4}>
                <KV label="Monto bruto" value={formatCurrency(transaction.amount, transaction.currency)} />
                <KV label="Comisiones" value={formatCurrency(transaction.fees, transaction.currency)} />
                <KV label="Impuestos" value={formatCurrency(transaction.taxes, transaction.currency)} />
              </Grid>
              <Grid item xs={6} md={4}>
                <Box
                  sx={{
                    backgroundColor: colors.bgSubtle,
                    borderRadius: 1.5,
                    padding: 2,
                    border: `1px solid ${colors.borderDefault}`,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    MONTO NETO
                  </Typography>
                  <Typography variant="h3" sx={{ mt: 0.5 }}>
                    {formatCurrency(transaction.netAmount, transaction.currency)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Stack>
        )}

        {tab === 'detalle' && (
          <Stack spacing={1}>
            <KV
              label={transaction.type === 'pay-out' ? 'Beneficiario' : 'Cliente'}
              value={
                transaction.type === 'pay-out' && transaction.beneficiaryName
                  ? transaction.beneficiaryName
                  : transaction.customerName
              }
            />
            <KV label="Email" value={transaction.customerEmail} />
            {transaction.cardLast4 && (
              <KV label="Tarjeta" value={`**** **** **** ${transaction.cardLast4}`} />
            )}
            <KV label="Moneda" value={transaction.currency} />
            {transaction.partnerReference && (
              <KV label="Referencia partner" value={transaction.partnerReference} mono />
            )}
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: colors.textSecondary }}>
              METADATA
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {transaction.metadata
                ? Object.entries(transaction.metadata).map(([k, v]) => `${k}: ${v}`).join(' · ')
                : 'Sin metadata custom.'}
            </Typography>
          </Stack>
        )}

        {tab === 'eventos' && (
          <Stack spacing={2} sx={{ pl: 1 }}>
            {transaction.events.map((ev, i) => (
              <EventRow key={i} ev={ev} isLast={i === transaction.events.length - 1} />
            ))}
            {transaction.events.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No hay eventos registrados todavía.
              </Typography>
            )}
          </Stack>
        )}

        {tab === 'cep' && showCEP && (
          <Stack spacing={1}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Comprobante Electrónico de Pago (CEP)
            </Typography>
            <KV label="Folio" value={transaction.partnerReference ?? '—'} mono />
            <KV label="Banco emisor" value="BBVA México" />
            <KV label="Banco receptor" value="Santander México" />
            <KV label="CLABE emisora" value="012345678901234567" mono />
            <KV label="CLABE receptora" value="014321098765432109" mono />
            <Box sx={{ pt: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
                onClick={() => toast.success('CEP descargado.')}
              >
                Descargar CEP PDF
              </Button>
            </Box>
          </Stack>
        )}

        {tab === 'comisiones' && (
          <Stack spacing={1}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Desglose de comisiones
            </Typography>
            {/* Adenda Cambio 8: sin atribuir a partner específico */}
            <KV label="Markup PSP" value={formatCurrency(transaction.fees * 0.5, transaction.currency)} />
            <KV label="Scheme fees" value={formatCurrency(transaction.fees * 0.24, transaction.currency)} />
            <KV label="Interchange" value={formatCurrency(transaction.fees * 0.26, transaction.currency)} />
            <Divider sx={{ my: 0.5 }} />
            <KV
              label="Total comisiones"
              value={
                <Box sx={{ fontWeight: 700 }}>
                  {formatCurrency(transaction.fees, transaction.currency)}
                </Box>
              }
            />
            <KV label="Impuestos sobre fees" value={formatCurrency(transaction.taxes, transaction.currency)} />
          </Stack>
        )}
      </DialogContent>

      {/* Adenda Cambio 5: footer SOLO Exportar PDF. NO se muestran botones Refund ni Dispute. */}
      <DialogActions sx={{ paddingX: 3, paddingY: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
          onClick={handleExportPdf}
        >
          Exportar PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function EventRow({ ev, isLast }: { ev: TransactionEvent; isLast: boolean }) {
  const color =
    ev.type === 'authorized' ? colors.pwReqMet :
    ev.type === 'rejected' || ev.type === 'failed' ? colors.bannerError.fg :
    ev.type === 'dispute_opened' ? colors.bannerError.fg :
    ev.type === 'in_review' ? colors.bannerWarning.fg :
    ev.type === 'refunded' ? colors.statusReembolsado.fg :
    colors.bannerInfo.fg;

  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Stack alignItems="center" spacing={0} sx={{ pt: 0.25 }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: color,
            border: `2px solid ${colors.bgCard}`,
            boxShadow: `0 0 0 2px ${color}33`,
          }}
        />
        {!isLast && (
          <Box sx={{ width: 1.5, flex: 1, backgroundColor: colors.borderDefault, minHeight: 28, mt: 0.5 }} />
        )}
      </Stack>
      <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0, paddingBottom: isLast ? 0 : 1.5 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          {ev.type === 'authorized' && <CheckCircleIcon sx={{ fontSize: 14, color: colors.pwReqMet }} />}
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {ev.description}
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {fmtTimelineTime(ev.timestamp)} · {ev.type}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default TransactionDetailModal;
