import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import StatusBadge from '@/components/common/StatusBadge';
import ContextBanner from '@/components/common/ContextBanner';
import type { MockSettlement } from '@/mocks/settlements';
import { MOCK_TRANSACTIONS } from '@/mocks/transactions';
import { formatCurrency } from '@/constants/currencies';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';

interface Props {
  settlement: MockSettlement | null;
  open: boolean;
  onClose: () => void;
}

function fmtDate(d: Date): string {
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function KV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ paddingY: 0.4 }}>
      <Typography variant="caption" sx={{ width: 170, color: colors.textSecondary, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ flex: 1 }}>
        {value}
      </Typography>
    </Stack>
  );
}

function FinancialLine({
  label,
  amount,
  currency,
  sign,
  emphasis,
}: {
  label: string;
  amount: number;
  currency: string;
  sign: '+' | '-';
  emphasis?: boolean;
}) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ paddingY: 0.5 }}>
      <Typography
        variant={emphasis ? 'body1' : 'body2'}
        sx={{ fontWeight: emphasis ? 700 : 500, color: emphasis ? colors.textPrimary : colors.textSecondary }}
      >
        {label}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="baseline">
        <Typography variant="caption" sx={{ color: colors.textMuted, fontFamily: 'monospace' }}>
          ({sign})
        </Typography>
        <Typography
          variant={emphasis ? 'h4' : 'body2'}
          sx={{ fontWeight: emphasis ? 700 : 600, fontFamily: emphasis ? 'inherit' : 'monospace' }}
        >
          {formatCurrency(amount, currency)}
        </Typography>
      </Stack>
    </Stack>
  );
}

export function SettlementDetailModal({ settlement, open, onClose }: Props) {
  const [showTx, setShowTx] = useState(false);

  const includedTx = useMemo(() => {
    if (!settlement) return [];
    return MOCK_TRANSACTIONS.filter(t => settlement.transactionIds.includes(t.id));
  }, [settlement]);

  if (!settlement) return null;

  const handleDownloadReport = () => {
    const lines = ['id,reference,createdAt,country,currency,amount,fees,netAmount,status'];
    for (const t of includedTx) {
      lines.push(
        [
          t.id,
          t.reference,
          t.createdAt.toISOString(),
          t.country,
          t.currency,
          t.amount,
          t.fees,
          t.netAmount,
          t.status,
        ].join(','),
      );
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paynau-${settlement.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Reporte de ${settlement.id} descargado.`);
  };

  const banner = (() => {
    if (settlement.status === 'PAID') {
      return (
        <ContextBanner variant="success">
          Liquidado el {fmtDate(settlement.payoutDate)}
          {settlement.bankReference ? ` · Referencia bancaria: ${settlement.bankReference}` : ''}
        </ContextBanner>
      );
    }
    if (settlement.status === 'IN_TRANSIT') {
      return (
        <ContextBanner variant="info">
          En tránsito hacia tu cuenta bancaria. Llegada estimada: {fmtDate(settlement.payoutDate)}.
        </ContextBanner>
      );
    }
    if (settlement.status === 'PENDING') {
      return (
        <ContextBanner variant="warning">
          Pendiente de procesamiento. Payout programado para {fmtDate(settlement.payoutDate)}.
        </ContextBanner>
      );
    }
    return (
      <ContextBanner variant="error">
        Falló el envío del wire. Operaciones se va a contactar con vos para reintentar.
      </ContextBanner>
    );
  })();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      slotProps={{ paper: { sx: { borderRadius: 2, maxHeight: '90vh' } } }}
    >
      <DialogTitle sx={{ pr: 6, pb: 1.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="h4">Settlement</Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', color: colors.textSecondary }}>
            {settlement.id}
          </Typography>
          <StatusBadge status={settlement.status} />
        </Stack>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box sx={{ paddingX: 3, paddingBottom: 1 }}>{banner}</Box>

      <DialogContent sx={{ pt: 2.5 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={0.5}>
              <KV label="Día de ventas" value={fmtDate(settlement.salesDay)} />
              <KV
                label="Fecha de payout"
                value={`${fmtDate(settlement.payoutDate)} · 3 días hábiles delay`}
              />
              <KV label="Moneda" value={settlement.currency} />
              <KV label="Cantidad de transacciones" value={`${settlement.transactionCount} tx`} />
              <KV
                label="Banco destino"
                value={`${settlement.bankName} · **** ${settlement.bankAccountLast4}`}
              />
              {settlement.bankReference && (
                <KV
                  label="Referencia bancaria"
                  value={<Box sx={{ fontFamily: 'monospace', fontSize: 12 }}>{settlement.bankReference}</Box>}
                />
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                padding: 2,
                borderRadius: 2,
                backgroundColor: colors.bgSubtle,
                border: `1px solid ${colors.borderDefault}`,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: colors.textSecondary,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Desglose financiero
              </Typography>
              <Stack divider={<Divider sx={{ borderColor: colors.borderDefault }} />} sx={{ mt: 1 }}>
                <FinancialLine
                  label="Volumen bruto"
                  amount={settlement.grossAmount}
                  currency={settlement.currency}
                  sign="+"
                />
                <FinancialLine
                  label="Comisiones"
                  amount={settlement.fees}
                  currency={settlement.currency}
                  sign="-"
                />
                <FinancialLine
                  label="Impuestos"
                  amount={settlement.taxes}
                  currency={settlement.currency}
                  sign="-"
                />
                <FinancialLine
                  label="Reembolsos"
                  amount={settlement.refunds}
                  currency={settlement.currency}
                  sign="-"
                />
                <FinancialLine
                  label="Chargebacks"
                  amount={settlement.chargebacks}
                  currency={settlement.currency}
                  sign="-"
                />
                <FinancialLine
                  label="Ajustes"
                  amount={settlement.adjustments}
                  currency={settlement.currency}
                  sign="-"
                />
              </Stack>
              <Divider sx={{ my: 1.5, borderColor: colors.borderStrong, borderWidth: 1 }} />
              <FinancialLine
                label="Monto neto a liquidar"
                amount={settlement.netPayout}
                currency={settlement.currency}
                sign="+"
                emphasis
              />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1}>
          <Link
            component="button"
            onClick={() => setShowTx(v => !v)}
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}
          >
            {showTx ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            {showTx ? 'Ocultar' : 'Ver'} transacciones incluidas ({includedTx.length})
          </Link>
          <Collapse in={showTx} timeout="auto" unmountOnExit>
            <Box
              sx={{
                border: `1px solid ${colors.borderDefault}`,
                borderRadius: 1.5,
                overflow: 'auto',
                maxHeight: 320,
              }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: 11, color: colors.textSecondary, fontWeight: 700, letterSpacing: 0.5 }}>
                      ID
                    </TableCell>
                    <TableCell sx={{ fontSize: 11, color: colors.textSecondary, fontWeight: 700, letterSpacing: 0.5 }}>
                      FECHA
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontSize: 11, color: colors.textSecondary, fontWeight: 700, letterSpacing: 0.5 }}
                    >
                      MONTO
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontSize: 11, color: colors.textSecondary, fontWeight: 700, letterSpacing: 0.5 }}
                    >
                      FEES
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontSize: 11, color: colors.textSecondary, fontWeight: 700, letterSpacing: 0.5 }}
                    >
                      NETO
                    </TableCell>
                    <TableCell sx={{ fontSize: 11, color: colors.textSecondary, fontWeight: 700, letterSpacing: 0.5 }}>
                      ESTADO
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {includedTx.map(t => (
                    <TableRow key={t.id} hover>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: 11 }}>
                        {t.id.slice(0, 28)}…
                      </TableCell>
                      <TableCell sx={{ fontSize: 12 }}>
                        {fmtDate(t.createdAt)}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: 12 }}>
                        {formatCurrency(t.amount, t.currency)}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: 12 }}>
                        {formatCurrency(t.fees, t.currency)}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: 12, fontWeight: 600 }}>
                        {formatCurrency(t.netAmount, t.currency)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={t.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {includedTx.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="caption" color="text.secondary" sx={{ paddingY: 2 }}>
                          No hay transacciones vinculadas a este settlement.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ paddingX: 3, paddingY: 2, justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
          onClick={handleDownloadReport}
        >
          Descargar reporte detallado (CSV)
        </Button>
        <Button variant="contained" color="primary" onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SettlementDetailModal;
