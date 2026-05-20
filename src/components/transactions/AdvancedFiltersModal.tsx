import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TRANSACTION_STATES, type TransactionStatusKey } from '@/constants/transactionStates';
import { useMerchantScope } from '@/hooks/useMerchantScope';
import type { TransactionFilters } from './filterTypes';
import { EMPTY_FILTERS } from './filterTypes';
import { colors } from '@/theme/tokens';

interface Props {
  open: boolean;
  filters: TransactionFilters;
  onClose: () => void;
  onApply: (f: TransactionFilters) => void;
}

export function AdvancedFiltersModal({ open, filters, onClose, onApply }: Props) {
  const [draft, setDraft] = useState<TransactionFilters>(filters);
  const merchantScope = useMerchantScope();

  const set = <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) =>
    setDraft(prev => ({ ...prev, [key]: value }));

  const toggleInArr = <T extends string>(key: 'country' | 'currency' | 'paymentMethod' | 'status', val: T) => {
    setDraft(prev => {
      const arr = prev[key] as T[];
      const next = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
      return { ...prev, [key]: next };
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 2 } } }}>
      <DialogTitle sx={{ pr: 6 }}>
        Filtros avanzados
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={0}>
          <FilterAccordion title="Datos de la transacción" defaultExpanded>
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  label="ID transacción"
                  value={draft.search}
                  onChange={e => set('search', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  label="Referencia"
                  value=""
                  disabled
                  helperText="Usá el campo ID arriba"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Estados
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                  {(Object.keys(TRANSACTION_STATES) as TransactionStatusKey[]).map(s => (
                    <Chip
                      key={s}
                      label={TRANSACTION_STATES[s].label}
                      onClick={() => toggleInArr('status', s)}
                      sx={{
                        backgroundColor: draft.status.includes(s) ? colors.brandDarkest : colors.bgSubtle,
                        color: draft.status.includes(s) ? colors.textInverse : colors.textPrimary,
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </FilterAccordion>

          <FilterAccordion title="Datos financieros">
            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <TextField
                  size="small"
                  type="number"
                  label="Monto desde"
                  value={draft.amountMin ?? ''}
                  onChange={e => set('amountMin', e.target.value ? Number(e.target.value) : null)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size="small"
                  type="number"
                  label="Monto hasta"
                  value={draft.amountMax ?? ''}
                  onChange={e => set('amountMax', e.target.value ? Number(e.target.value) : null)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  size="small"
                  label="Moneda"
                  value={draft.currency[0] ?? ''}
                  onChange={e => set('currency', e.target.value ? [e.target.value] : [])}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value=""><em>Todas</em></MenuItem>
                  {merchantScope.currencies.map(c => (
                    <MenuItem key={c.code} value={c.code}>{c.code} — {c.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </FilterAccordion>

          <FilterAccordion title="Datos del cliente">
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  label="Email cliente"
                  type="email"
                  value={draft.customerEmail}
                  onChange={e => set('customerEmail', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  label="Nombre cliente"
                  value={draft.customerName}
                  onChange={e => set('customerName', e.target.value)}
                />
              </Grid>
            </Grid>
          </FilterAccordion>

          <FilterAccordion title="Geografía y método">
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Países
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                  {merchantScope.countries.map(c => (
                    <Chip
                      key={c.code}
                      label={`${c.flag} ${c.code}`}
                      onClick={() => toggleInArr('country', c.code)}
                      sx={{
                        backgroundColor: draft.country.includes(c.code) ? colors.brandDarkest : colors.bgSubtle,
                        color: draft.country.includes(c.code) ? colors.textInverse : colors.textPrimary,
                      }}
                    />
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Métodos de pago
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                  {merchantScope.paymentMethods.map(m => (
                    <Chip
                      key={m.key}
                      label={m.label}
                      onClick={() => toggleInArr('paymentMethod', m.key)}
                      sx={{
                        backgroundColor: draft.paymentMethod.includes(m.key) ? colors.brandDarkest : colors.bgSubtle,
                        color: draft.paymentMethod.includes(m.key) ? colors.textInverse : colors.textPrimary,
                      }}
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </FilterAccordion>

          <FilterAccordion title="Fechas">
            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <TextField
                  size="small"
                  type="date"
                  label="Fecha desde"
                  InputLabelProps={{ shrink: true }}
                  value={draft.dateFrom ?? ''}
                  onChange={e => set('dateFrom', e.target.value || null)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size="small"
                  type="date"
                  label="Fecha hasta"
                  InputLabelProps={{ shrink: true }}
                  value={draft.dateTo ?? ''}
                  onChange={e => set('dateTo', e.target.value || null)}
                />
              </Grid>
            </Grid>
          </FilterAccordion>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={() => setDraft(EMPTY_FILTERS)}>Limpiar todo</Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onApply(draft);
            onClose();
          }}
        >
          Aplicar filtros
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function FilterAccordion({
  title,
  defaultExpanded,
  children,
}: {
  title: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      square={false}
      sx={{
        boxShadow: 'none',
        border: `1px solid ${colors.borderDefault}`,
        borderRadius: 1.5,
        mb: 1,
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}

export default AdvancedFiltersModal;
