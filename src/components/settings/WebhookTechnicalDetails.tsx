import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { WEBHOOK_PAYLOAD_EXAMPLE, WEBHOOK_RETRY_POLICY } from '@/mocks/webhooks';
import { colors } from '@/theme/tokens';

/**
 * Sección colapsable con la información técnica de un canal callback. Colapsada por
 * defecto: el usuario administrativo no la necesita, el rol técnico la expande.
 */
export function WebhookTechnicalDetails({ defaultExpanded = false }: { defaultExpanded?: boolean }) {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      square={false}
      sx={{
        boxShadow: 'none',
        border: `1px solid ${colors.borderDefault}`,
        borderRadius: 1.5,
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Detalles técnicos
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: colors.textSecondary }}>
              Firma de seguridad
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cada POST se firma con HMAC SHA256 usando el signing secret del canal. Verificá
              la firma del header <code>PSP-Signature</code> antes de procesar el evento.
            </Typography>
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: colors.textSecondary }}>
              Formato del payload
            </Typography>
            <Box
              component="pre"
              sx={{
                margin: 0,
                fontFamily: 'monospace',
                fontSize: 12,
                backgroundColor: colors.bgSubtle,
                padding: 1.5,
                borderRadius: 1,
                border: `1px solid ${colors.borderDefault}`,
                overflowX: 'auto',
              }}
            >
              {WEBHOOK_PAYLOAD_EXAMPLE}
            </Box>
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: colors.textSecondary }}>
              Política de reintentos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {WEBHOOK_RETRY_POLICY}
            </Typography>
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export default WebhookTechnicalDetails;
