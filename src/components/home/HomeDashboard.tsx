import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import WebhookOutlinedIcon from '@mui/icons-material/WebhookOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import Sparkline from '@/components/common/Sparkline';
import StatusBadge from '@/components/common/StatusBadge';
import { useAuthStore } from '@/stores/authStore';
import { MOCK_TRANSACTIONS } from '@/mocks/transactions';
import { MOCK_SETTLEMENTS } from '@/mocks/settlements';
import { COUNTRY_BY_CODE } from '@/constants/countries';
import { formatCurrency } from '@/constants/currencies';
import { colors } from '@/theme/tokens';

interface KpiCardProps {
  title: string;
  value: string;
  trend?: { icon: 'up' | 'flat'; label: string; color: string };
  hint?: string;
  sparkline?: number[];
  sparkColor?: string;
}

function KpiCard({ title, value, trend, hint, sparkline, sparkColor }: KpiCardProps) {
  return (
    <Card sx={{ padding: 2.5, height: '100%' }}>
      <Stack spacing={1}>
        <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {title}
        </Typography>
        <Stack direction="row" alignItems="baseline" spacing={1}>
          <Typography variant="h2" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
        </Stack>
        {trend && (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {trend.icon === 'up' ? (
              <TrendingUpIcon sx={{ fontSize: 16, color: trend.color }} />
            ) : (
              <TrendingFlatIcon sx={{ fontSize: 16, color: trend.color }} />
            )}
            <Typography variant="caption" sx={{ color: trend.color, fontWeight: 600 }}>
              {trend.label}
            </Typography>
          </Stack>
        )}
        {hint && (
          <Typography variant="caption" color="text.secondary">
            {hint}
          </Typography>
        )}
        {sparkline && (
          <Box sx={{ pt: 1 }}>
            <Sparkline data={sparkline} color={sparkColor ?? colors.pwReqMet} width={180} height={36} />
          </Box>
        )}
      </Stack>
    </Card>
  );
}

export function HomeDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);

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
        .slice(0, 3),
    [],
  );

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h1">Bienvenido, {user?.firstName ?? 'tu equipo'} 👋</Typography>
        <Typography variant="body1" color="text.secondary">
          Acá tenés un resumen de la actividad de tu cuenta.
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard
            title="Transacciones hoy"
            value="84"
            trend={{ icon: 'up', label: '+12% vs ayer', color: colors.pwReqMet }}
            sparkline={[40, 52, 48, 65, 58, 72, 80, 84]}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard
            title="Volumen procesado · mes"
            value="$2.341.892 MXN"
            trend={{ icon: 'up', label: '+8% vs mes anterior', color: colors.pwReqMet }}
            sparkline={[1.8, 1.9, 2.0, 2.05, 2.1, 2.18, 2.25, 2.34]}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard
            title="Tasa de aprobación"
            value="94.3%"
            trend={{ icon: 'flat', label: 'estable', color: colors.textSecondary }}
            sparkline={[94, 93.8, 94.1, 94.4, 94.2, 94.3]}
            sparkColor={colors.textSecondary}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard
            title="Settlements pendientes"
            value="3"
            hint="Próximo: 17 may · $45.230 MXN"
          />
        </Grid>
      </Grid>

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
                          sx={{
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
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
                <Typography variant="h4">Próximos settlements</Typography>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/settlements')}
                  sx={{ fontWeight: 600 }}
                >
                  Ver todos →
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
                          {s.payoutDate.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })} · {s.transactionCount} tx
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

      <Card sx={{ padding: 2.5 }}>
        <Stack spacing={2}>
          <Typography variant="h4">Acciones rápidas</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexWrap="wrap" useFlexGap>
            <Button
              variant="outlined"
              startIcon={<KeyOutlinedIcon />}
              onClick={() => navigate('/api-keys')}
            >
              Crear API Key
            </Button>
            <Button
              variant="outlined"
              startIcon={<WebhookOutlinedIcon />}
              onClick={() => navigate('/webhooks')}
            >
              Configurar Webhook
            </Button>
            <Button
              variant="outlined"
              startIcon={<PersonAddAltOutlinedIcon />}
              onClick={() => navigate('/users')}
            >
              Invitar usuario
            </Button>
            <Button
              variant="outlined"
              startIcon={<MenuBookOutlinedIcon />}
              onClick={() => window.open('https://docs.paynau.com', '_blank', 'noopener')}
            >
              Ver documentación
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}

export default HomeDashboard;
