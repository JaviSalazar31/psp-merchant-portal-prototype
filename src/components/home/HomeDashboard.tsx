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
import { COUNTRY_BY_CODE, countryToCurrency } from '@/constants/countries';
import { formatCurrency } from '@/constants/currencies';
import { colors } from '@/theme/tokens';

// Series diarias por moneda local (Fase 1: cada comercio ve su moneda principal).
// Los valores reflejan escalas realistas: BRL ~5x más pequeño que MXN, COP ~200x más grande.
const DAILY_TRANSACTED_30D_BY_CURRENCY: Record<string, number[]> = {
  MXN: [
    84000, 96000, 90000, 102000, 98000, 108000, 116000, 104000, 122000, 118000,
    128000, 120000, 134000, 126000, 140000, 136000, 144000, 138000, 150000, 142000,
    156000, 148000, 162000, 154000, 168000, 160000, 172000, 166000, 178000, 182000,
  ],
  BRL: [
    16800, 19200, 18000, 20400, 19600, 21600, 23200, 20800, 24400, 23600,
    25600, 24000, 26800, 25200, 28000, 27200, 28800, 27600, 30000, 28400,
    31200, 29600, 32400, 30800, 33600, 32000, 34400, 33200, 35600, 36400,
  ],
  COP: [
    16_800_000, 19_200_000, 18_000_000, 20_400_000, 19_600_000, 21_600_000, 23_200_000, 20_800_000, 24_400_000, 23_600_000,
    25_600_000, 24_000_000, 26_800_000, 25_200_000, 28_000_000, 27_200_000, 28_800_000, 27_600_000, 30_000_000, 28_400_000,
    31_200_000, 29_600_000, 32_400_000, 30_800_000, 33_600_000, 32_000_000, 34_400_000, 33_200_000, 35_600_000, 36_400_000,
  ],
};

const TRANSACTION_COUNT = 1284;
const TRANSACTION_COUNT_SPARK = [820, 910, 870, 1010, 980, 1120, 1190, 1284];
const APPROVAL_RATE = 94.3;

/** Balance mock por moneda. La tabla filtra las filas según los países del comercio. */
const BALANCE_BY_CURRENCY: Record<string, { balance: number; availableForPayout: number }> = {
  MXN: { balance: 3_142_580.5, availableForPayout: 2_980_000 },
  BRL: { balance: 412_300.75, availableForPayout: 388_000 },
  COP: { balance: 56_120_000, availableForPayout: 52_000_000 },
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

  // Una fila por cada país de operación del comercio. Fase 1 NO muestra
  // consolidado en USD — decisión validada con Tech Lead: el comercio opera
  // en moneda local y el consolidado USD vuelve en Fase 2 cuando se habiliten
  // operaciones multi-país con liquidación cruzada.
  const balanceRows = useMemo(() => {
    return merchantScope.countries.map(c => ({
      key: c.code,
      label: `${c.flag} ${c.name}`,
      currency: c.currency,
      ...(BALANCE_BY_CURRENCY[c.currency] ?? { balance: 0, availableForPayout: 0 }),
    }));
  }, [merchantScope.countries]);

  // Moneda principal del comercio según su país de residencia fiscal.
  // En Fase 1 cada comercio ve su dashboard en una sola moneda local.
  const primaryCurrency = countryToCurrency(user?.country);
  const primaryCountryLabel = user?.country
    ? COUNTRY_BY_CODE[user.country]?.name ?? user.country
    : 'tu cuenta';
  const primaryBalance = BALANCE_BY_CURRENCY[primaryCurrency]?.balance ?? 0;
  const dailySeries = DAILY_TRANSACTED_30D_BY_CURRENCY[primaryCurrency] ?? [];
  const dailyTotal = dailySeries.reduce((a, b) => a + b, 0);

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
            Bienvenido a Paynau, tu perfil fue aprobado. Ya podés acceder a todos los servicios.
          </Typography>
          <IconButton size="small" onClick={() => setWelcomeOpen(false)} aria-label="Cerrar">
            <CloseIcon fontSize="small" sx={{ color: colors.bannerSuccess.fg }} />
          </IconButton>
        </Stack>
      )}

      {/* Capa 1 — Balance disponible en moneda local. Fase 1 muestra UNA moneda
          (la del país de residencia fiscal del comercio). El detalle completo
          por cada país operativo está más abajo (Capa 3). */}
      <Card sx={{ padding: { xs: 2.5, md: 3 }, backgroundColor: colors.brandDarkest }}>
        <Stack spacing={0.5}>
          <Typography
            variant="caption"
            sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            Balance disponible
          </Typography>
          <Typography sx={{ color: colors.brandPrimary, fontWeight: 800, fontSize: { xs: 36, md: 44 }, lineHeight: 1.1 }}>
            {formatCurrency(primaryBalance, primaryCurrency)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Saldo en {primaryCountryLabel} ({primaryCurrency}). El detalle por país de operación está más abajo.
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
                {formatCurrency(dailyTotal, primaryCurrency)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Últimos 30 días · en {primaryCurrency}
              </Typography>
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end', minHeight: 120 }}>
                <MiniBarChart data={dailySeries} height={120} />
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
