import CompanyProfile from '@/components/settings/CompanyProfile';

/**
 * Pantalla /profile — "Información" del comercio (datos legales, dirección,
 * banco, contactos) heredados del onboarding y mostrados en sólo lectura.
 * Esto reemplazó al ex "Mi perfil" (datos personales del usuario), cuyo
 * contenido pasó a /account ("Mi cuenta").
 */
export default function ProfilePage() {
  return <CompanyProfile />;
}
