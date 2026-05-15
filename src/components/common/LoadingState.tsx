import { Box, Skeleton, Stack } from '@mui/material';

interface LoadingStateProps {
  variant: 'table' | 'cards' | 'form' | 'list';
  rows?: number;
  count?: number;
  fields?: number;
  items?: number;
}

export function LoadingState({ variant, rows = 7, count = 4, fields = 5, items = 3 }: LoadingStateProps) {
  if (variant === 'table') {
    return (
      <Stack spacing={1}>
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
        ))}
      </Stack>
    );
  }
  if (variant === 'cards') {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${count}, 1fr)`, gap: 2 }}>
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={108} sx={{ borderRadius: 2 }} />
        ))}
      </Box>
    );
  }
  if (variant === 'form') {
    return (
      <Stack spacing={2}>
        {Array.from({ length: fields }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
        ))}
      </Stack>
    );
  }
  return (
    <Stack spacing={1.5}>
      {Array.from({ length: items }).map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={72} sx={{ borderRadius: 1.5 }} />
      ))}
    </Stack>
  );
}

export default LoadingState;
