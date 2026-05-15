import { Divider, Stack, Typography } from '@mui/material';
import { colors } from '@/theme/tokens';

export function SectionDivider({ children }: { children: React.ReactNode }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ paddingY: 1 }}>
      <Divider sx={{ flex: 1, borderColor: colors.borderDefault }} />
      <Typography
        variant="caption"
        sx={{
          fontSize: 11,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: colors.textSecondary,
          fontWeight: 600,
        }}
      >
        {children}
      </Typography>
      <Divider sx={{ flex: 1, borderColor: colors.borderDefault }} />
    </Stack>
  );
}

export default SectionDivider;
