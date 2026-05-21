import type { ReactNode } from 'react';
import { Box, Stack } from '@mui/material';
import HeroPanel from './HeroPanel';
import Logo from '@/components/common/Logo';
import LanguageSelector from '@/components/common/LanguageSelector';
import { colors } from '@/theme/tokens';

interface PreloginLayoutProps {
  children: ReactNode;
  /** Si es false, no muestra el split-screen (pantallas centradas simples como ConfirmEmail). */
  splitScreen?: boolean;
}

export function PreloginLayout({ children, splitScreen = true }: PreloginLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: colors.bgPage,
      }}
    >
      {splitScreen && (
        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', md: 'block' },
            position: 'relative',
          }}
        >
          <HeroPanel />
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingX: { xs: 2, sm: 4, md: 4 },
            paddingY: 2,
          }}
        >
          <LanguageSelector />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: { xs: 'flex-start', md: 'center' },
            paddingX: { xs: 3, sm: 6, md: 6, lg: 8 },
            paddingBottom: { xs: 4, md: 6 },
          }}
        >
          <Stack spacing={3} sx={{ width: '100%', maxWidth: 440 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Logo width={{ xs: 90, sm: 104, md: 120 }} />
            </Box>
            {children}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default PreloginLayout;
