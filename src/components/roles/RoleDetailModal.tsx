import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import type { MockRole } from '@/mocks/roles';
import { colors } from '@/theme/tokens';

interface Props {
  role: MockRole | null;
  open: boolean;
  onClose: () => void;
}

export function RoleDetailModal({ role, open, onClose }: Props) {
  if (!role) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper" slotProps={{ paper: { sx: { borderRadius: 2, maxHeight: '90vh' } } }}>
      <DialogTitle sx={{ pr: 6, pb: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="baseline">
          <Typography variant="h3">{role.label}</Typography>
          <Typography variant="caption" color="text.secondary">
            Rol built-in · permisos no editables
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {role.description}
        </Typography>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ paddingX: 3 }}>
        <Stack divider={<Divider sx={{ borderColor: colors.borderDefault }} />} spacing={0}>
          {role.permissions.map(group => (
            <Box key={group.category} sx={{ paddingY: 1.5 }}>
              <Typography
                variant="caption"
                sx={{
                  color: colors.textSecondary,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  display: 'block',
                  mb: 1,
                }}
              >
                {group.category}
              </Typography>
              <Grid container spacing={0.5}>
                {group.permissions.map(p => (
                  <Grid item xs={12} sm={6} key={p.label}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ paddingY: 0.25 }}>
                      {p.granted ? (
                        <CheckCircleIcon sx={{ fontSize: 16, color: colors.pwReqMet }} />
                      ) : (
                        <RemoveCircleOutlineIcon sx={{ fontSize: 16, color: colors.textMuted }} />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          color: p.granted ? colors.textPrimary : colors.textMuted,
                          textDecoration: p.granted ? 'none' : 'line-through',
                          textDecorationStyle: 'solid',
                        }}
                      >
                        {p.label}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="contained" color="primary" onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RoleDetailModal;
