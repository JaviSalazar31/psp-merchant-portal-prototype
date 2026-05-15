import { Box } from '@mui/material';
import { colors } from '@/theme/tokens';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
}

export function Sparkline({
  data,
  width = 120,
  height = 36,
  color = colors.pwReqMet,
  fillColor,
}: SparklineProps) {
  if (data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1 || 1);

  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y] as const;
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const areaD = `${pathD} L${width},${height} L0,${height} Z`;

  const fill = fillColor ?? `${color}22`; // alpha sutil

  return (
    <Box component="svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} sx={{ display: 'block' }}>
      <path d={areaD} fill={fill} />
      <path d={pathD} fill="none" stroke={color} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
    </Box>
  );
}

export default Sparkline;
