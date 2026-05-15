import { Card, Grid, Stack, Typography } from '@mui/material';
import type { MockTransaction } from '@/mocks/transactions';
import { formatCurrency } from '@/constants/currencies';
import { colors } from '@/theme/tokens';

interface KpiProps {
  scope: 'pay-in' | 'pay-out';
  rows: MockTransaction[];
}

function todayCount(rows: MockTransaction[]): number {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return rows.filter(r => r.createdAt >= start).length;
}

function approvalRate(rows: MockTransaction[]): number {
  const final = rows.filter(r =>
    ['AUTORIZADO', 'RECHAZADO', 'FALLIDO', 'EN_DISPUTA', 'REEMBOLSADO'].includes(r.status),
  );
  if (final.length === 0) return 0;
  const ok = final.filter(r => r.status === 'AUTORIZADO' || r.status === 'REEMBOLSADO').length;
  return (ok / final.length) * 100;
}

function volumeByCurrency(rows: MockTransaction[]): { currency: string; total: number } {
  const sums: Record<string, number> = {};
  for (const r of rows) {
    if (r.status === 'AUTORIZADO' || r.status === 'REEMBOLSADO') {
      sums[r.currency] = (sums[r.currency] ?? 0) + r.amount;
    }
  }
  const sorted = Object.entries(sums).sort(([, a], [, b]) => b - a);
  if (sorted.length === 0) return { currency: 'USD', total: 0 };
  return { currency: sorted[0][0], total: sorted[0][1] };
}

function KpiCard({ title, value, hint }: { title: string; value: string; hint?: string }) {
  return (
    <Card sx={{ padding: 2.5, height: '100%' }}>
      <Stack spacing={0.75}>
        <Typography
          variant="caption"
          sx={{
            color: colors.textSecondary,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {title}
        </Typography>
        <Typography variant="h2" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
        {hint && (
          <Typography variant="caption" color="text.secondary">
            {hint}
          </Typography>
        )}
      </Stack>
    </Card>
  );
}

export function TransactionKpiCards({ scope, rows }: KpiProps) {
  const total = rows.length;
  const vol = volumeByCurrency(rows);
  const today = todayCount(rows);
  const rate = approvalRate(rows);

  const isPayIn = scope === 'pay-in';

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} lg={3}>
        <KpiCard
          title={isPayIn ? 'Total de transacciones' : 'Total de pagos enviados'}
          value={`${total.toLocaleString('es-AR')}`}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <KpiCard
          title={isPayIn ? 'Monto procesado' : 'Volumen pagado'}
          value={formatCurrency(vol.total, vol.currency)}
          hint={`En ${vol.currency} (moneda principal)`}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <KpiCard
          title={isPayIn ? 'Transacciones hoy' : 'Pagos hoy'}
          value={`${today}`}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <KpiCard
          title={isPayIn ? 'Tasa de aprobación' : 'Tasa de éxito'}
          value={`${rate.toFixed(1)}%`}
        />
      </Grid>
    </Grid>
  );
}

export default TransactionKpiCards;
