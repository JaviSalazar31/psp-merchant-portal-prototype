import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Divider,
  Grid,
  IconButton,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Sparkline from '@/components/common/Sparkline';
import MiniBarChart from '@/components/common/MiniBarChart';
import StatusBadge from '@/components/common/StatusBadge';
import { useAuthStore } from '@/stores/authStore';
import { useMerchantScope } from '@/hooks/useMerchantScope';
import { MOCK_TRANSACTIONS } from '@/mocks/transactions';
import { MOCK_SETTLEMENTS } from '@/mocks/settlements';
import { COUNTRY_BY_CODE } from '@/constants/countries';
import { formatCurrency } from '@/constants/currencies';
import { colors } from '@/theme/tokens';

const TOTAL_BALANCE_USD = 184_250.0;

const DAILY_TRANSACTED_30D = [
  4200, 4800, 4500, 5100, 4900, 5400, 5800, 5200, 6100, 5900,
  6400, 6000, 6700, 6300, 7000, 6800, 7200, 6900, 7500, 7100,
  7800, 7400, 8100, 7700, 8400, 8000, 8600, 8300, 8900, 9100,
];

const TRANSACTION_COUNT = 1284;
const TRANSACTION_COUNT_SPARK = [820, 910, 870, 1010, 980, 1120, 1190, 1284];
const APPROVAL_RATE = 94.3;

/** Balance mock por moneda. La tabla filtra las filas según los países del comercio. */
const BALANCE_BY_CURRENCY: Record<string, { balance: number; availableForPayout: number }> = {
  MXN: { balance: 3_142_580.5, availableForPayout: 2_980_000 },
  BRL: { balance: 412_300.75, availableForPayout: 388_000 },
  COP: { balance: 56_120_000, availableForPayout: 52_000_000 },
  USD: { balance: TOTAL_BALANCE_USD, availableForPayout: 171_300 },
};

const HEAD_CELL = {
  fontSize: 11,
  letterSpacing: 0.5,
  color: colors.textSecondary,
  fontWeight: 700,
};

export function HomeDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const merchantScope = useMerchantScope();
  const [welcomeOpen, setWelcomeOpen] = useState(true);

  const latestTransactions = useMemo(
    () =>
      [...MOCK_TRANSACTIONS]
        .filter(t => t.type === 'pay-in')
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5),
    [],
  );

  const upcomingSettlements = useMemo(
    () =>
      [...MOCK_SETTLEMENTS]
        .filter(s => s.status === 'PENDING' || s.status === 'IN_TRANSIT')
        .sort((a, b) => a.payoutDate.getTime() - b.payoutDate.getTime())
        .slice(0, 4),
    [],
  );

  // Una fila por cada país de operación + una fila USD consolidada.
  const balanceRows = useMemo(() => {
    const rows = merchantScope.countries.map(c => ({
      key: c.code,
      label: `${c.flag} ${c.name}`,
      currency: c.currency,
      ...(BALANCE_BY_CURRENCY[c.currency] ?? { balance: 0, availableForPayout: 0 }),
    }));
    rows.push({
      key: 'consolidado',
      label: '🌎 Consolidado',
      currency: 'USD',
      ...BALANCE_BY_CURRENCY.USD,
    });
    return rows;
  }, [merchantScope.countries]);

  const dailyTotal = DAILY_TRANSACTED_30D.reduce((a, b) => a + b, 0);
  const isApproved = user?.onboardingStatus === 'approved';

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h1">Inicio</Typography>
        <Typography variant="body1" color="text.secondary">
          Resumen de la actividad de tu cuenta.
        </Typography>
      </Stack>

      {isApproved && welcomeOpen && (
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{
            backgroundColor: colors.bannerSuccess.bg,
            border: `1px solid ${colors.bannerSuccess.border}`,
            borderLeft: `4px solid ${colors.brandPrimary}`,
            borderRadius: 1.5,
            paddingX: 2,
            paddingY: 1.25,
          }}
        >
          <CheckCircleIcon sx={{ color: colors.pwReqMet, fontSize: 22 }} />
          <Typography variant="body2" sx={{ flex: 1, color: colors.bannerSuccess.fg, fontWeight: 500 }}>
            ¡Bienvenido a {user?.companyName ?? 'tu comercio'}! Tu cuenta está activa.
          </Typography>
          <IconButton size="small" onClick={() => setWelcomeOpen(false)} aria-label="Cerrar">
            <CloseIcon fontSize="small" sx={{ color: colors.bannerSuccess.fg }} />
          </IconButton>
        </Stack>
      )}

      {/* Capa 1 — KPI principal: balance total consolidado en USD */}
      <Card sx={{ padding: { xs: 2.5, md: 3 }, backgroundColor: colors.brandDarkest }}>
        <Stack spacing={0.5}>
          <Typography
            variant="caption"
            sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            Balance total
          </Typography>
          <Typography sx={{ color: colors.brandPrimary, fontWeight: 800, fontSize: { xs: 36, md: 44 }, lineHeight: 1.1 }}>
            {formatCurrency(TOTAL_BALANCE_USD, 'USD')}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Saldo consolidado en dólares. El detalle por moneda local está más abajo.
          </Typography>
        </Stack>
      </Card>

      {/* Capa 2 — widgets de volumen, conteo y performance */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 2.5, height: '100%' }}>
            <Stack spacing={1.5} sx={{ height: '100%' }}>
              <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Monto transaccionado diario
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 700 }}>
                {formatCurrency(dailyTotal, 'USD')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Últimos 30 días · en dólares
              </Typography>
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end', minHeight: 120 }}>
                <MiniBarChart data={DAILY_TRANSACTED_30D} height={120} />
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ padding: 2.5, height: '100%' }}>
            <Stack spacing={1}>
              <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Conteo de transacciones
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 700 }}>
                {TRANSACTION_COUNT.toLocaleString('es-AR')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Este mes
              </Typography>
              <Box sx={{ pt: 1 }}>
                <Sparkline data={TRANSACTION_COUNT_SPARK} color={colors.pwReqMet} width={220} height={44} />
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ padding: 2.5, height: '100%' }}>
            <Stack spacing={1}>
              <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Tasa de aprobación
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 700 }}>
                {APPROVAL_RATE}%
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <TrendingUpIcon sx={{ fontSize: 16, color: colors.pwReqMet }} />
                <Typography variant="caption" sx={{ color: colors.pwReqMet, fontWeight: 600 }}>
                  +0,4 pts vs mes anterior
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Capa 3 — balance por país / moneda, filtrado por los países del comercio */}
      <Card sx={{ padding: { xs: 2, md: 2.5 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h4">Balance por país</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={HEAD_CELL}>PAÍS</TableCell>
                  <TableCell sx={HEAD_CELL}>MONEDA</TableCell>
                  <TableCell sx={HEAD_CELL} align="right">BALANCE</TableCell>
                  <TableCell sx={HEAD_CELL} align="right">DISPONIBLE PARA PAYOUTS</TableCell>
                  <TableCell sx={HEAD_CELL} align="right">DETALLE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {balanceRows.map(row => (
                  <TableRow key={row.key} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{row.label}</TableCell>
                    <TableCell sx={{ color: colors.textSecondary }}>{row.currency}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {formatCurrency(row.balance, row.currency)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: colors.textSecondary }}>
                      {formatCurrency(row.availableForPayout, row.currency)}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Ver transacciones de la región">
                        <IconButton size="small" onClick={() => navigate('/transactions/pay-in')}>
                          <ChevronRightIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Card>

      {/* Capa 5 — listas de resumen */}
      <Grid container spacing={2}>
        <Grid item xs={12} lg={7}>
          <Card sx={{ padding: 2.5 }}>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h4">Últimas transacciones</Typography>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/transactions/pay-in')}
                  sx={{ fontWeight: 600 }}
                >
                  Ver todas →
                </Link>
              </Stack>
              <Divider sx={{ borderColor: colors.borderDefault }} />
              <Stack divider={<Divider sx={{ borderColor: colors.borderDefault }} />} spacing={0}>
                {latestTransactions.map(tx => {
                  const country = COUNTRY_BY_CODE[tx.country];
                  return (
                    <Stack
                      key={tx.id}
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      sx={{ paddingY: 1.25, cursor: 'pointer', '&:hover': { backgroundColor: colors.bgSubtle } }}
                      onClick={() => navigate('/transactions/pay-in')}
                    >
                      <Box component="span" sx={{ fontSize: 18 }}>
                        {country?.flag}
                      </Box>
                      <Stack sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                          {tx.customerName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tx.id.slice(0, 18)}… · {tx.paymentMethod.replace('_', ' ').toLowerCase()}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 110, textAlign: 'right' }}>
                        {formatCurrency(tx.amount, tx.currency)}
                      </Typography>
                      <StatusBadge status={tx.status} />
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Card sx={{ padding: 2.5 }}>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h4">Próximas liquidaciones</Typography>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/settlements')}
                  sx={{ fontWeight: 600 }}
                >
                  Ver todas →
                </Link>
              </Stack>
              <Divider sx={{ borderColor: colors.borderDefault }} />
              <Stack spacing={1.5}>
                {upcomingSettlements.map(s => (
                  <Box
                    key={s.id}
                    onClick={() => navigate('/settlements')}
                    sx={{
                      padding: 1.5,
                      borderRadius: 1.5,
                      border: `1px solid ${colors.borderDefault}`,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: colors.bgSubtle },
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {s.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {s.payoutDate.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })} ·{' '}
                          {s.transactionCount} tx
                        </Typography>
                      </Stack>
                      <Stack alignItems="flex-end" spacing={0.5}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {formatCurrency(s.netPayout, s.currency)}
                        </Typography>
                        <StatusBadge status={s.status} />
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default HomeDashboard;
