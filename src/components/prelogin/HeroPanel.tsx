import { Box } from '@mui/material';
import { colors, heroPanelGradient } from '@/theme/tokens';

/**
 * Panel decorativo del split-screen pre-login y onboarding.
 * Gradient verde brand con líneas diagonales luminosas superpuestas.
 */
export function HeroPanel() {
  const lines = [
    { y1: 200, y2: -100, opacity: 0.65, width: 3 },
    { y1: 380, y2: 80, opacity: 0.55, width: 2.5 },
    { y1: 560, y2: 240, opacity: 0.75, width: 3.5 },
    { y1: 720, y2: 420, opacity: 0.45, width: 2 },
    { y1: 900, y2: 600, opacity: 0.5, width: 2.5 },
    { y1: 1080, y2: 780, opacity: 0.4, width: 2 },
    { y1: 1260, y2: 960, opacity: 0.55, width: 2.5 },
  ];

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: heroPanelGradient,
        overflow: 'hidden',
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 600 1200"
        preserveAspectRatio="xMidYMid slice"
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.brandPrimary} stopOpacity="0" />
            <stop offset="50%" stopColor={colors.brandPrimary} stopOpacity="1" />
            <stop offset="100%" stopColor={colors.brandPrimary} stopOpacity="0" />
          </linearGradient>
        </defs>
        {lines.map((l, i) => (
          <line
            key={i}
            x1={-200}
            y1={l.y1}
            x2={900}
            y2={l.y2}
            stroke="url(#lineGradient)"
            strokeWidth={l.width}
            opacity={l.opacity}
          />
        ))}
      </Box>
    </Box>
  );
}

export default HeroPanel;
