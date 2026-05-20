import { Card, Grid, Stack, Typography } from '@mui/material';
import type { MockSettlement } from '@/mocks/settlements';
import { formatCurrency } from '@/constants/currencies';
import { colors } from '@/theme/tokens';

function fmtShortDate(d: Date): string {
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function KpiCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: React.ReactNode;
  hint?: string;
}) {
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

interface Props {
  rows: MockSettlement[];
}

export function SettlementsKpiCards({ rows }: Props) {
  const upcoming = [...rows]
    .filter(s => s.status === 'PENDING' || s.status === 'IN_TRANSIT')
    .sort((a, b) => a.payoutDate.getTime() - b.payoutDate.getTime());

  const next = upcoming[0];

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const thisMonth = rows.filter(s => s.salesDay >= monthStart);
  const monthVolume: Record<string, number> = {};
  for (const s of thisMonth) {
    monthVolume[s.currency] = (monthVolume[s.currency] ?? 0) + s.netPayout;
  }
  const topMonth = Object.entries(monthVolume).sort(([, a], [, b]) => b - a)[0];

  const pending = rows.filter(s => s.status === 'PENDING' || s.status === 'IN_TRANSIT');
  const pendingByCurrency: Record<string, number> = {};
  for (const s of pending) {
    pendingByCurrency[s.currency] = (pendingByCurrency[s.currency] ?? 0) + s.netPayout;
  }
  const topPending = Object.entries(pendingByCurrency).sort(([, a], [, b]) => b - a)[0];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} lg={4}>
        <KpiCard
          title="Próximo payout"
          value={next ? formatCurrency(next.netPayout, next.currency) : '—'}
          hint={next ? `${fmtShortDate(next.payoutDate)} · ${next.id}` : 'Sin próximos payouts'}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={4}>
        <KpiCard
          title="Total este mes"
          value={topMonth ? formatCurrency(topMonth[1], topMonth[0]) : '—'}
          hint={`${thisMonth.length} settlement${thisMonth.length === 1 ? '' : 's'}`}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={4}>
        <KpiCard
          title="Pending payout"
          value={topPending ? formatCurrency(topPending[1], topPending[0]) : '—'}
          hint={`${pending.length} settlement${pending.length === 1 ? '' : 's'}`}
        />
      </Grid>
    </Grid>
  );
}

export default SettlementsKpiCards;
