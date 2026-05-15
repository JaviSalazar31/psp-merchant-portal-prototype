import { Alert, AlertTitle, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ErrorStateProps {
  message: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, description, onRetry }: ErrorStateProps) {
  return (
    <Alert
      severity="error"
      action={
        onRetry && (
          <Button
            size="small"
            color="inherit"
            startIcon={<RefreshIcon fontSize="small" />}
            onClick={onRetry}
          >
            Reintentar
          </Button>
        )
      }
      sx={{ borderRadius: 1.5 }}
    >
      <AlertTitle>{message}</AlertTitle>
      {description}
    </Alert>
  );
}

export default ErrorState;
