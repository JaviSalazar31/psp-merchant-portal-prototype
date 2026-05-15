import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ExportButton from './ExportButton';
import { colors } from '@/theme/tokens';

export function TransactionsLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = location.pathname.includes('pay-out') ? 'pay-out' : 'pay-in';
  const scope = currentTab === 'pay-in' ? 'transacciones-pay-in' : 'transacciones-pay-out';

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h1">Transacciones</Typography>
          <Typography variant="body1" color="text.secondary">
            Registro de todos los pagos procesados en tu plataforma.
          </Typography>
        </Stack>
        <ExportButton scope={scope} />
      </Stack>

      <Box sx={{ borderBottom: `1px solid ${colors.borderDefault}` }}>
        <Tabs
          value={currentTab}
          onChange={(_, v) => navigate(`/transactions/${v}`)}
          sx={{ minHeight: 'auto' }}
        >
          <Tab value="pay-in" label="Pay-In" />
          <Tab value="pay-out" label="Pay-Out" />
        </Tabs>
      </Box>

      <Outlet />
    </Stack>
  );
}

export default TransactionsLayout;
