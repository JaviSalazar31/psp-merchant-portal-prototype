import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

/**
 * Pantalla bloqueante /review-pending: solo accesible si user está en 'pending_review'.
 */
export function ReviewGuard({ children }: { children: ReactNode }) {
  const user = useAuthStore(s => s.user);

  if (!user) return <Navigate to="/login" replace />;
  if (user.onboardingStatus === 'approved') return <Navigate to="/home" replace />;
  if (user.onboardingStatus !== 'pending_review') {
    return <Navigate to="/onboarding/step-1" replace />;
  }

  return <>{children}</>;
}

export default ReviewGuard;
