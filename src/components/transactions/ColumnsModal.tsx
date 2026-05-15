import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { GridColumnVisibilityModel } from '@mui/x-data-grid';
import { COLUMN_LABELS, DEFAULT_VISIBLE_COLUMNS } from './transactionColumns';
import { colors } from '@/theme/tokens';

interface Props {
  open: boolean;
  visibility: GridColumnVisibilityModel;
  onClose: () => void;
  onApply: (m: GridColumnVisibilityModel) => void;
}

export function ColumnsModal({ open, visibility, onClose, onApply }: Props) {
  const [draft, setDraft] = useState<GridColumnVisibilityModel>(visibility);

  const toggle = (field: string) => {
    setDraft(prev => ({ ...prev, [field]: !(prev[field] ?? true) }));
  };

  const apply = () => {
    onApply(draft);
    onClose();
  };

  const restoreDefaults = () => setDraft(DEFAULT_VISIBLE_COLUMNS);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 2 } } }}>
      <DialogTitle sx={{ pr: 6 }}>
        Columnas visibles
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
          Tildá para mostrar u ocultar columnas en la tabla.
        </Typography>
        <Stack
          sx={{
            border: `1px solid ${colors.borderDefault}`,
            borderRadius: 1.5,
            overflow: 'hidden',
          }}
        >
          {Object.entries(COLUMN_LABELS).map(([field, label]) => (
            <Box
              key={field}
              sx={{
                paddingX: 1.5,
                paddingY: 0.5,
                borderBottom: `1px solid ${colors.borderDefault}`,
                '&:last-of-type': { borderBottom: 'none' },
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={draft[field] ?? true}
                    onChange={() => toggle(field)}
                    sx={{ color: colors.borderStrong, '&.Mui-checked': { color: colors.brandPrimary } }}
                  />
                }
                label={<Typography variant="body2">{label}</Typography>}
              />
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={restoreDefaults}>Restaurar default</Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" color="primary" onClick={apply}>
          Aplicar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ColumnsModal;
