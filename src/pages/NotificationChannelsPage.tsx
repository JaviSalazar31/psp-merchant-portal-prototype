import { Card, CardContent, Stack, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import WebhooksList from '@/components/settings/WebhooksList';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme/tokens';

/**
 * Página /notifications — canales de notificación del comercio.
 *
 * Módulo independiente del sidebar (decisión consolidada 18/05 con Tech Lead y
 * Arquitecto Frontend: el usuario administrativo no maneja APIs, por eso el
 * módulo Desarrolladores no va al portal; los canales de notificación quedan
 * accesibles directamente desde el menú lateral).
 *
 * En el prototipo coexiste con /developers para preservar validación visual,
 * pero ese módulo lleva un banner indicando que es vista interna de demo.
 */
export default function NotificationChannelsPage() {
  const user = useAuthStore(s => s.user);

  if (!user) return null;

  const header = (
    <Stack spacing={0.5}>
      <Typography variant="h1">Canales de notificación</Typography>
      <Typography variant="body1" color="text.secondary">
        Configurá los endpoints donde tu comercio va a recibir notificaciones de eventos del PSP.
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
                Vas a poder configurar tus canales de notificación una vez que tu comercio
                sea aprobado por nuestro equipo.
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
      <WebhooksList />
    </Stack>
  );
}
