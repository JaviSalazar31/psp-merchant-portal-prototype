import { Stack, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import ExportButton from './ExportButton';

export function TransactionsLayout() {
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
        <ExportButton scope="transacciones-pay-in" />
      </Stack>

      <Outlet />
    </Stack>
  );
}

export default TransactionsLayout;
