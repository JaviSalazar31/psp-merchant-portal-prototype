import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import OnboardingRejectedScreen from '@/components/onboarding/OnboardingRejectedScreen';
import { useAuthStore } from '@/stores/authStore';

/**
 * Solo permite acceso al wizard si user.onboardingStatus es 'not_started' o 'in_progress'.
 * Si está approved → /home. Si pending_review → /review-pending.
 * Si rejected → mostramos la pantalla de "necesita correcciones" en lugar del wizard.
 */
export function OnboardingGuard({ children }: { children: ReactNode }) {
  const user = useAuthStore(s => s.user);

  if (!user) return <Navigate to="/login" replace />;
  if (user.onboardingStatus === 'approved') return <Navigate to="/home" replace />;
  if (user.onboardingStatus === 'pending_review') return <Navigate to="/review-pending" replace />;
  if (user.onboardingStatus === 'rejected') return <OnboardingRejectedScreen />;

  return <>{children}</>;
}

export default OnboardingGuard;
