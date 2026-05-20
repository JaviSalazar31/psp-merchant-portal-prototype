import { Box } from '@mui/material';
import { colors } from '@/theme/tokens';

interface MiniBarChartProps {
  data: number[];
  height?: number;
  color?: string;
}

/**
 * Gráfico de barras compacto, sin dependencias externas. Cada barra se escala al
 * valor máximo de la serie. Pensado para widgets del dashboard.
 */
export function MiniBarChart({ data, height = 120, color = colors.brandPrimary }: MiniBarChartProps) {
  if (data.length === 0) return null;
  const max = Math.max(...data, 1);

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height, width: '100%' }}>
      {data.map((value, i) => (
        <Box
          key={i}
          sx={{
            flex: 1,
            height: `${Math.max((value / max) * 100, 2)}%`,
            backgroundColor: color,
            borderRadius: '2px 2px 0 0',
          }}
        />
      ))}
    </Box>
  );
}

export default MiniBarChart;
