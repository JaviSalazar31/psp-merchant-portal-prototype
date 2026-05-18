import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import PasswordChecklist, { isPasswordValid } from '@/components/common/PasswordChecklist';
import { useSecurityStore } from '@/stores/securityStore';
import { toast } from '@/stores/toastStore';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ open, onClose }: Props) {
  const changePassword = useSecurityStore(s => s.changePassword);
  const saving = useSecurityStore(s => s.saving);

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
      setConfirmTouched(false);
    }
  }, [open]);

  const allValid = isPasswordValid(newPwd);
  const confirmsMatch = confirmPwd === newPwd && confirmPwd.length > 0;

  const canSubmit = currentPwd.length > 0 && allValid && confirmsMatch && !saving;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    await changePassword();
    toast.success('Contraseña actualizada correctamente.');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 2 } } }}>
      <DialogTitle sx={{ pr: 6 }}>
        Cambiar contraseña
        <IconButton aria-label="Cerrar" onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 0.5 }}>
          <TextField
            label="Contraseña actual"
            type={showCurrent ? 'text' : 'password'}
            value={currentPwd}
            onChange={e => setCurrentPwd(e.target.value)}
            disabled={saving}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrent(v => !v)}
                      edge="end"
                      size="small"
                      aria-label={showCurrent ? 'Ocultar' : 'Mostrar'}
                    >
                      {showCurrent ? (
                        <VisibilityOffOutlinedIcon fontSize="small" />
                      ) : (
                        <VisibilityOutlinedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Stack spacing={1}>
            <TextField
              label="Nueva contraseña"
              type={showNew ? 'text' : 'password'}
              value={newPwd}
              onChange={e => setNewPwd(e.target.value)}
              disabled={saving}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNew(v => !v)}
                        edge="end"
                        size="small"
                        aria-label={showNew ? 'Ocultar' : 'Mostrar'}
                      >
                        {showNew ? (
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        ) : (
                          <VisibilityOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <PasswordChecklist password={newPwd} />
          </Stack>

          <TextField
            label="Confirmar nueva contraseña"
            type={showNew ? 'text' : 'password'}
            value={confirmPwd}
            onChange={e => {
              setConfirmPwd(e.target.value);
              setConfirmTouched(true);
            }}
            disabled={saving}
            error={confirmTouched && !confirmsMatch}
            helperText={
              confirmTouched && !confirmsMatch ? 'Las contraseñas no coinciden.' : ' '
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!canSubmit}>
          {saving ? 'Guardando…' : 'Cambiar contraseña'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ChangePasswordModal;
