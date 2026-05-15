import { useMemo, useState } from 'react';
import { Box, Button, Card, Chip, Grid, Stack, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RolesIcon from '@mui/icons-material/Shield';
import ContextBanner from '@/components/common/ContextBanner';
import RoleDetailModal from './RoleDetailModal';
import { MOCK_ROLES, type MockRole } from '@/mocks/roles';
import { useUsersStore } from '@/stores/usersStore';
import { colors } from '@/theme/tokens';

const ROLE_ACCENTS: Record<string, string> = {
  Admin: '#FEE2E2',
  Operator: '#DBEAFE',
  Viewer: '#F3F4F6',
};

export function RolesList() {
  const users = useUsersStore(s => s.users);
  const [selected, setSelected] = useState<MockRole | null>(null);

  const usersByRole = useMemo(() => {
    return MOCK_ROLES.reduce<Record<string, number>>((acc, r) => {
      acc[r.key] = users.filter(u => u.role === r.key).length;
      return acc;
    }, {});
  }, [users]);

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h1">Roles</Typography>
        <Typography variant="body1" color="text.secondary">
          Estos son los roles disponibles en tu cuenta. Asignalos al crear o editar usuarios.
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        {MOCK_ROLES.map(r => (
          <Grid item xs={12} md={4} key={r.key}>
            <Card sx={{ padding: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Stack spacing={1.5} sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.25,
                        backgroundColor: ROLE_ACCENTS[r.key],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <RolesIcon sx={{ color: colors.brandDarkest, fontSize: 18 }} />
                    </Box>
                    <Typography variant="h4">{r.label}</Typography>
                  </Stack>
                  <Chip
                    label={`${usersByRole[r.key]} ${usersByRole[r.key] === 1 ? 'usuario' : 'usuarios'}`}
                    size="small"
                    sx={{
                      backgroundColor: colors.bgSubtle,
                      color: colors.textPrimary,
                      fontWeight: 600,
                    }}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {r.description}
                </Typography>

                <Stack spacing={0.5} sx={{ paddingY: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    Permisos principales
                  </Typography>
                  {r.shortPermissions.map(p => (
                    <Stack key={p} direction="row" spacing={0.75} alignItems="center">
                      <CheckCircleIcon sx={{ fontSize: 14, color: colors.pwReqMet }} />
                      <Typography variant="body2">{p}</Typography>
                    </Stack>
                  ))}
                </Stack>

                <Button variant="outlined" onClick={() => setSelected(r)} sx={{ alignSelf: 'flex-start' }}>
                  Ver detalle
                </Button>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ContextBanner variant="info">
        En esta primera versión los roles son fijos. Pronto vas a poder crear roles custom con permisos
        granulares.
      </ContextBanner>

      <RoleDetailModal role={selected} open={!!selected} onClose={() => setSelected(null)} />
    </Stack>
  );
}

export default RolesList;
