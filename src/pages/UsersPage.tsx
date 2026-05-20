import { useState } from 'react';
import { Stack, Tab, Tabs, Typography } from '@mui/material';
import UsersList from '@/components/users/UsersList';
import RolesList from '@/components/roles/RolesList';

export default function UsersPage() {
  const [tab, setTab] = useState(0);

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h1">Usuarios</Typography>
        <Typography variant="body1" color="text.secondary">
          Gestioná los usuarios de tu cuenta y consultá los roles disponibles.
        </Typography>
      </Stack>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 'auto' }}>
        <Tab label="Usuarios" />
        <Tab label="Roles" />
      </Tabs>

      {tab === 0 ? <UsersList /> : <RolesList />}
    </Stack>
  );
}
