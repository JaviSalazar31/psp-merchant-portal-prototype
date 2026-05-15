import type { NavigateFunction } from 'react-router-dom';
import type { AuthUser } from '@/stores/authStore';

export function redirectAfterLogin(navigate: NavigateFunction, user: AuthUser): void {
  switch (user.onboardingStatus) {
    case 'in_progress':
      navigate(`/onboarding/step-${user.currentOnboardingStep}`, { replace: true });
      return;
    case 'pending_review':
      navigate('/review-pending', { replace: true });
      return;
    case 'approved':
      navigate('/home', { replace: true });
      return;
    case 'not_started':
    case 'rejected':
      navigate('/onboarding/step-1', { replace: true });
      return;
  }
}
