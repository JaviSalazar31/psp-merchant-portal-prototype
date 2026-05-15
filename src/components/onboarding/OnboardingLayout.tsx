import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
import { Box, Button, Card, Stack } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SendIcon from '@mui/icons-material/Send';
import WizardHeader from './WizardHeader';
import OnboardingStepper, { type StepDef } from './OnboardingStepper';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { colors } from '@/theme/tokens';

const STEPS: StepDef[] = [
  { id: 1, label: 'Datos de la Empresa' },
  { id: 2, label: 'Dirección Comercial' },
  { id: 3, label: 'Información Bancaria' },
  { id: 4, label: 'Contactos y Escalaciones' },
  { id: 5, label: 'Documentos' },
  { id: 6, label: 'Enviar para revisión' },
];

interface FooterProps {
  onBack?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  isLastStep?: boolean;
  submitting?: boolean;
}

export function WizardFooter({
  onBack,
  onContinue,
  continueLabel,
  continueDisabled,
  isLastStep,
  submitting,
}: FooterProps) {
  const showBack = !!onBack;
  return (
    <Stack
      direction={{ xs: 'column-reverse', sm: 'row' }}
      spacing={1.5}
      justifyContent={showBack ? 'space-between' : 'flex-end'}
      sx={{ paddingTop: 2 }}
    >
      {showBack && (
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon fontSize="small" />}
          onClick={onBack}
          sx={{ minWidth: 140 }}
        >
          Atrás
        </Button>
      )}
      <Button
        variant="contained"
        color="primary"
        endIcon={
          isLastStep ? <SendIcon fontSize="small" /> : <ArrowForwardIcon fontSize="small" />
        }
        onClick={onContinue}
        disabled={continueDisabled || submitting}
        sx={{ minWidth: 180 }}
      >
        {continueLabel ?? (isLastStep ? 'Enviar para revisión' : 'Continuar')}
      </Button>
    </Stack>
  );
}

export function OnboardingLayout({ children }: { children?: ReactNode }) {
  const location = useLocation();
  const goToStep = useOnboardingStore(s => s.goToStep);
  const currentStep = useOnboardingStore(s => s.currentStep);
  const step1Data = useOnboardingStore(s => s.step1Data);
  const step2Data = useOnboardingStore(s => s.step2Data);
  const step3Data = useOnboardingStore(s => s.step3Data);
  const step4Data = useOnboardingStore(s => s.step4Data);
  const step5Data = useOnboardingStore(s => s.step5Data);

  const urlStep = useMemo<1 | 2 | 3 | 4 | 5 | 6>(() => {
    const match = location.pathname.match(/\/onboarding\/step-(\d)/);
    const n = match ? Number(match[1]) : 1;
    if (n >= 1 && n <= 6) return n as 1 | 2 | 3 | 4 | 5 | 6;
    return 1;
  }, [location.pathname]);

  useEffect(() => {
    if (urlStep !== currentStep) goToStep(urlStep);
  }, [urlStep, currentStep, goToStep]);

  // Tracking de qué steps ya tienen data → marcamos completados.
  const completedSteps: number[] = [];
  if (step1Data) completedSteps.push(1);
  if (step2Data) completedSteps.push(2);
  if (step3Data) completedSteps.push(3);
  if (step4Data) completedSteps.push(4);
  if (step5Data) completedSteps.push(5);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.bgPage, display: 'flex', flexDirection: 'column' }}>
      <WizardHeader />
      <OnboardingStepper steps={STEPS} currentStep={urlStep} completedSteps={completedSteps} />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          paddingX: { xs: 2, sm: 3, md: 4 },
          paddingY: { xs: 3, md: 5 },
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: { md: 800, lg: 760, xl: 820 },
            padding: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {children ?? <Outlet />}
        </Card>
      </Box>
    </Box>
  );
}

export default OnboardingLayout;
