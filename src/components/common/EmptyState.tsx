import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { colors } from '@/theme/tokens';

interface EmptyStateProps {
  variant?: 'empty' | 'no-results';
  title: string;
  description?: string;
  illustration?: ReactNode;
  cta?: ReactNode;
}

export function EmptyState({ variant = 'empty', title, description, illustration, cta }: EmptyStateProps) {
  const defaultIllustration =
    variant === 'no-results' ? (
      <SearchOffIcon sx={{ fontSize: 56, color: colors.textMuted }} />
    ) : (
      <InboxOutlinedIcon sx={{ fontSize: 56, color: colors.textMuted }} />
    );

  return (
    <Stack
      spacing={2}
      alignItems="center"
      sx={{ paddingY: 6, paddingX: 3, textAlign: 'center' }}
    >
      <Box
        sx={{
          width: 88,
          height: 88,
          borderRadius: '50%',
          backgroundColor: colors.bgSubtle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {illustration ?? defaultIllustration}
      </Box>
      <Stack spacing={0.5} sx={{ maxWidth: 420 }}>
        <Typography variant="h4">{title}</Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </Stack>
      {cta}
    </Stack>
  );
}

export default EmptyState;
