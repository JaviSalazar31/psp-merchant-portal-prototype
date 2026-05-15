import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore, type OnboardingStatus } from '@/stores/authStore';

/**
 * Wrap de rutas públicas (login/registro/etc).
 * Si el usuario ya está autenticado, redirigir según onboardingStatus.
 */
const REDIRECTS: Record<OnboardingStatus, string> = {
  not_started: '/onboarding/step-1',
  in_progress: '/onboarding',
  pending_review: '/review-pending',
  approved: '/home',
  rejected: '/onboarding/step-1',
};

interface PublicRouteProps {
  children: ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const user = useAuthStore(s => s.user);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  if (isAuthenticated && user) {
    const target = REDIRECTS[user.onboardingStatus] ?? '/home';
    if (user.onboardingStatus === 'in_progress') {
      return <Navigate to={`/onboarding/step-${user.currentOnboardingStep}`} replace />;
    }
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
}

export default PublicRoute;
