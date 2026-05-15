import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

/**
 * Solo permite acceso al wizard si user.onboardingStatus es 'not_started', 'in_progress' o 'rejected'.
 * Si está approved → /home. Si pending_review → /review-pending.
 */
export function OnboardingGuard({ children }: { children: ReactNode }) {
  const user = useAuthStore(s => s.user);

  if (!user) return <Navigate to="/login" replace />;
  if (user.onboardingStatus === 'approved') return <Navigate to="/home" replace />;
  if (user.onboardingStatus === 'pending_review') return <Navigate to="/review-pending" replace />;

  return <>{children}</>;
}

export default OnboardingGuard;
