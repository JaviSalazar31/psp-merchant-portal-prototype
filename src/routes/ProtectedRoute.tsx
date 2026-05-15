import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

/**
 * Rutas internas que requieren onboardingStatus === 'approved'.
 * Si no hay sesión → /login. Si pending_review → /review-pending.
 * Para los otros estados → wizard.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore(s => s.user);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (user.onboardingStatus === 'pending_review') return <Navigate to="/review-pending" replace />;
  if (user.onboardingStatus !== 'approved') {
    return <Navigate to={`/onboarding/step-${user.currentOnboardingStep}`} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
