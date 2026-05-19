import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import PasswordChecklist, { isPasswordValid } from '@/components/common/PasswordChecklist';
import PasswordStrengthBar from '@/components/common/PasswordStrengthBar';
import { useSecurityStore } from '@/stores/securityStore';
import { toast } from '@/stores/toastStore';

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Formulario de cambio de contraseña que se expande inline dentro de la tarjeta "Contraseña"
 * del Centro de Seguridad (no abre un modal). Reemplaza al `ChangePasswordModal` antiguo.
 */
export function ChangePasswordInline({ open, onClose }: Props) {
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
      setShowCurrent(false);
      setShowNew(false);
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
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Box sx={{ paddingTop: 2 }}>
        <Divider sx={{ marginBottom: 2.5 }} />
        <Stack spacing={2}>
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
            <PasswordStrengthBar password={newPwd} />
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

          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!canSubmit}>
              {saving ? 'Guardando…' : 'Cambiar contraseña'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Collapse>
  );
}

export default ChangePasswordInline;
