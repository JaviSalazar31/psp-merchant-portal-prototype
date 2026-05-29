import { useState } from 'react';
import {
  Box,
  Chip,
  IconButton,
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
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContextBanner from '@/components/common/ContextBanner';
import RevealKeyModal from './RevealKeyModal';
import { useApiKeysStore } from '@/stores/apiKeysStore';
import { toast } from '@/stores/toastStore';
import { colors } from '@/theme/tokens';
import type { MockApiKey } from '@/mocks/apiKeys';

/**
 * API Keys — sólo lectura.
 *
 * Decisión: el usuario del comercio NO crea, renombra, rota ni elimina API keys
 * desde el portal. Razones:
 *   1) Las keys productivas se generan automáticamente cuando se activa la cuenta.
 *   2) Permitir edición/rotación desde el portal expone el riesgo de romper
 *      integraciones activas. Es una tarea técnica que vive del lado del backend.
 *
 * Lo que sí puede hacer el usuario acá: ver el listado, ver la key completa
 * (publishable se muestra entera, secret se revela bajo modal), y copiar.
 */

function fmtDate(d: Date): string {
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function typeLabel(t: MockApiKey['type']) {
  if (t === 'publishable') return 'Publishable';
  if (t === 'secret') return 'Secret';
  return 'Restricted';
}

function maskedSecret(key: MockApiKey): string {
  if (key.type === 'publishable') return key.fullKey;
  // Para secret/restricted: prefix + bullets + suffix (la key real se ve en el modal).
  return `${key.prefix}••••••••••••••••••${key.suffix}`;
}

export function ApiKeysList() {
  const keys = useApiKeysStore(s => s.keys);
  const [revealState, setRevealState] = useState<{ key: MockApiKey | null; reason: 'reveal' | 'new' | 'rotated' }>({
    key: null,
    reason: 'reveal',
  });

  const handleReveal = (key: MockApiKey) => setRevealState({ key, reason: 'reveal' });

  const handleCopyMasked = (key: MockApiKey) => {
    navigator.clipboard.writeText(key.fullKey);
    toast.success('Key copiada al portapapeles.');
  };

  return (
    <Stack spacing={3}>
      <ContextBanner variant="info">
        Tus API keys actuales son de <strong>prueba</strong> y no procesan transacciones reales.
        Las keys productivas se generan automáticamente cuando tu cuenta se activa, sin necesidad
        de gestionarlas desde acá.
      </ContextBanner>

      <TableContainer
        sx={{
          border: `1px solid ${colors.borderDefault}`,
          borderRadius: 2,
          backgroundColor: colors.bgCard,
          overflow: 'auto',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: colors.bgSubtle }}>
              <TableCell sx={{ fontSize: 11, letterSpacing: 0.5, color: colors.textSecondary, fontWeight: 700 }}>
                NOMBRE
              </TableCell>
              <TableCell sx={{ fontSize: 11, letterSpacing: 0.5, color: colors.textSecondary, fontWeight: 700 }}>
                TIPO
              </TableCell>
              <TableCell sx={{ fontSize: 11, letterSpacing: 0.5, color: colors.textSecondary, fontWeight: 700 }}>
                KEY
              </TableCell>
              <TableCell sx={{ fontSize: 11, letterSpacing: 0.5, color: colors.textSecondary, fontWeight: 700 }}>
                CREADA
              </TableCell>
              <TableCell sx={{ fontSize: 11, letterSpacing: 0.5, color: colors.textSecondary, fontWeight: 700 }}>
                ÚLTIMO USO
              </TableCell>
              <TableCell sx={{ fontSize: 11, letterSpacing: 0.5, color: colors.textSecondary, fontWeight: 700 }}>
                ESTADO
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keys.map(key => {
              const isRevoked = key.status === 'Revocada';
              return (
                <TableRow key={key.id} hover sx={{ opacity: isRevoked ? 0.55 : 1 }}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {key.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={typeLabel(key.type)}
                      size="small"
                      sx={{
                        backgroundColor: key.type === 'publishable' ? '#DBEAFE' : '#FEE2E2',
                        color: key.type === 'publishable' ? '#1E40AF' : '#991B1B',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box
                        component="code"
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: 12,
                          color: colors.textPrimary,
                          backgroundColor: colors.bgSubtle,
                          paddingX: 1,
                          paddingY: 0.5,
                          borderRadius: 1,
                          wordBreak: 'break-all',
                          maxWidth: 280,
                        }}
                      >
                        {maskedSecret(key)}
                      </Box>
                      {key.type === 'publishable' ? (
                        <Tooltip title="Copiar">
                          <IconButton size="small" onClick={() => handleCopyMasked(key)}>
                            <ContentCopyIcon fontSize="inherit" sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Mostrar key completa">
                          <IconButton size="small" onClick={() => handleReveal(key)}>
                            <VisibilityOutlinedIcon fontSize="inherit" sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, color: colors.textSecondary }}>
                    {fmtDate(key.createdAt)}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, color: colors.textSecondary }}>
                    {key.lastUsedAt ? fmtDate(key.lastUsedAt) : '—'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={key.status}
                      size="small"
                      sx={{
                        backgroundColor:
                          key.status === 'Activa' ? colors.bannerSuccess.bg : colors.bannerError.bg,
                        color:
                          key.status === 'Activa' ? colors.bannerSuccess.fg : colors.bannerError.fg,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            {keys.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box sx={{ paddingY: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Tus API keys aparecerán acá cuando tu cuenta se active.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <RevealKeyModal
        open={!!revealState.key}
        apiKey={revealState.key}
        reason={revealState.reason}
        onClose={() => setRevealState({ key: null, reason: 'reveal' })}
      />
    </Stack>
  );
}

export default ApiKeysList;
