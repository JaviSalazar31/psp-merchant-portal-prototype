import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { colors } from '@/theme/tokens';

type Variant = 'info' | 'success' | 'warning' | 'error';

interface ContextBannerProps {
  variant: Variant;
  children: ReactNode;
  title?: string;
  icon?: ReactNode;
  compact?: boolean;
}

const PALETTE: Record<Variant, { bg: string; fg: string; border: string }> = {
  info: colors.bannerInfo,
  success: colors.bannerSuccess,
  warning: colors.bannerWarning,
  error: colors.bannerError,
};

function DefaultIcon({ variant }: { variant: Variant }) {
  const sx = { fontSize: 20 };
  if (variant === 'success') return <CheckCircleIcon sx={sx} />;
  if (variant === 'error') return <ErrorOutlineIcon sx={sx} />;
  if (variant === 'warning') return <WarningAmberIcon sx={sx} />;
  return <InfoOutlinedIcon sx={sx} />;
}

export function ContextBanner({ variant, children, title, icon, compact }: ContextBannerProps) {
  const palette = PALETTE[variant];

  return (
    <Box
      role="alert"
      sx={{
        backgroundColor: palette.bg,
        color: palette.fg,
        border: `1px solid ${palette.border}`,
        borderRadius: 1.5,
        paddingX: compact ? 1.5 : 2,
        paddingY: compact ? 1 : 1.25,
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems={title ? 'flex-start' : 'center'}>
        <Box sx={{ color: palette.fg, display: 'flex', alignItems: 'center', mt: title ? 0.25 : 0 }}>
          {icon ?? <DefaultIcon variant={variant} />}
        </Box>
        <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
          {title && (
            <Typography variant="body2" sx={{ fontWeight: 600, color: palette.fg }}>
              {title}
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: palette.fg }}>
            {children}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

export default ContextBanner;
