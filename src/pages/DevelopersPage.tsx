import { useState } from 'react';
import { Card, CardContent, Stack, Tab, Tabs, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ApiKeysList from '@/components/settings/ApiKeysList';
import WebhooksList from '@/components/settings/WebhooksList';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme/tokens';

/**
 * Módulo /developers — unifica API Keys y Canales de notificación en una sola vista con tabs.
 * Sólo disponible una vez que el comercio fue aprobado por Backoffice.
 */
export default function DevelopersPage() {
  const user = useAuthStore(s => s.user);
  const [tab, setTab] = useState(0);

  if (!user) return null;

  const header = (
    <Stack spacing={0.5}>
      <Typography variant="h1">Desarrolladores</Typography>
      <Typography variant="body1" color="text.secondary">
        Credenciales de integración y canales de notificación de tu comercio.
      </Typography>
    </Stack>
  );

  if (user.onboardingStatus !== 'approved') {
    return (
      <Stack spacing={3}>
        {header}
        <Card>
          <CardContent sx={{ paddingY: 6 }}>
            <Stack spacing={1.5} alignItems="center" sx={{ textAlign: 'center' }}>
              <LockOutlinedIcon sx={{ fontSize: 44, color: colors.textMuted }} />
              <Typography variant="h4">Módulo no disponible todavía</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460 }}>
                Las herramientas para desarrolladores van a estar disponibles una vez que tu
                comercio sea aprobado por nuestro equipo.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      {header}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 'auto' }}>
        <Tab label="API Keys" />
        <Tab label="Canales de notificación" />
      </Tabs>
      {tab === 0 ? <ApiKeysList /> : <WebhooksList />}
    </Stack>
  );
}
