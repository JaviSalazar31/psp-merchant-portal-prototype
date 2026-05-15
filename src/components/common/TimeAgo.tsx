import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';

interface TimeAgoProps extends Omit<TypographyProps, 'children'> {
  date: Date;
}

function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'hace unos segundos';
  const min = Math.floor(sec / 60);
  if (min < 60) return `hace ${min} ${min === 1 ? 'minuto' : 'minutos'}`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `hace ${hour} ${hour === 1 ? 'hora' : 'horas'}`;
  const days = Math.floor(hour / 24);
  if (days === 1) return 'ayer';
  if (days < 7) return `hace ${days} días`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  }
  const months = Math.floor(days / 30);
  return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
}

export function TimeAgo({ date, ...rest }: TimeAgoProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  return <Typography {...rest}>{formatRelative(date)}</Typography>;
}

export default TimeAgo;
