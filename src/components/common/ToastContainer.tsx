import { useEffect } from 'react';
import { Alert, IconButton, Slide, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useToastStore, type Toast, type ToastType } from '@/stores/toastStore';

const SEVERITY_MAP: Record<ToastType, 'success' | 'error' | 'info' | 'warning'> = {
  success: 'success',
  error: 'error',
  info: 'info',
  warning: 'warning',
};

function IconFor({ type }: { type: ToastType }) {
  const sx = { fontSize: 22 };
  if (type === 'success') return <CheckCircleIcon sx={sx} />;
  if (type === 'error') return <ErrorOutlineIcon sx={sx} />;
  if (type === 'warning') return <WarningAmberIcon sx={sx} />;
  return <InfoOutlinedIcon sx={sx} />;
}

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore(s => s.dismiss);

  useEffect(() => {
    if (!toast.duration) return;
    const t = setTimeout(() => dismiss(toast.id), toast.duration);
    return () => clearTimeout(t);
  }, [toast.id, toast.duration, dismiss]);

  return (
    <Slide direction="left" in mountOnEnter unmountOnExit>
      <Alert
        severity={SEVERITY_MAP[toast.type]}
        icon={<IconFor type={toast.type} />}
        variant="filled"
        action={
          <IconButton
            aria-label="cerrar"
            size="small"
            onClick={() => dismiss(toast.id)}
            sx={{ color: 'inherit' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        sx={{
          minWidth: 280,
          maxWidth: 480,
          alignItems: 'center',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
          borderRadius: 1.5,
        }}
      >
        {toast.message}
      </Alert>
    </Slide>
  );
}

export function ToastContainer() {
  const toasts = useToastStore(s => s.toasts);

  return (
    <Stack
      spacing={1.5}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: theme => theme.zIndex.snackbar + 10,
        pointerEvents: 'none',
        '& > *': { pointerEvents: 'auto' },
      }}
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </Stack>
  );
}

export default ToastContainer;
