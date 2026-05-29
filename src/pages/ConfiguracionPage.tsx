import { useState } from 'react';
import { Card, CardContent, Stack, Tab, Tabs, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import UsersList from '@/components/users/UsersList';
import WebhooksList from '@/components/settings/WebhooksList';
import ApiKeysList from '@/components/settings/ApiKeysList';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme/tokens';

/**
 * Página /configuracion — tres tabs:
 *   - Usuarios (gestión CRUD de usuarios del comercio)
 *   - Canales de notificación (webhooks / emails)
 *   - API Keys (credenciales de integración, sólo lectura)
 *
 * Roles NO vive acá: se movió al Centro de Seguridad como sección informativa,
 * porque es consultivo (no operativo) y conviene separarlo de configuración
 * administrativa.
 */

interface TabConfig {
  label: string;
  content: React.ReactNode;
}

export default function ConfiguracionPage() {
  const user = useAuthStore(s => s.user);
  const [tab, setTab] = useState(0);

  if (!user) return null;

  const header = (
    <Stack spacing={0.5}>
      <Typography variant="h1">Configuración</Typography>
      <Typography variant="body1" color="text.secondary">
        Gestioná los usuarios, canales de notificación y credenciales de integración de tu cuenta.
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
                Vas a poder configurar tu cuenta una vez que tu comercio sea aprobado por
                nuestro equipo.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    );
  }

  const TABS: TabConfig[] = [
    { label: 'Usuarios', content: <UsersList /> },
    { label: 'Canales de notificación', content: <WebhooksList /> },
    { label: 'API Keys', content: <ApiKeysList /> },
  ];

  return (
    <Stack spacing={3}>
      {header}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 'auto' }}>
        {TABS.map(t => (
          <Tab key={t.label} label={t.label} />
        ))}
      </Tabs>
      {TABS[tab].content}
    </Stack>
  );
}
