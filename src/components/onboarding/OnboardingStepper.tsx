import { Box, Stack, Typography, LinearProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { colors } from '@/theme/tokens';

export interface StepDef {
  id: 1 | 2 | 3 | 4 | 5;
  label: string;
}

interface OnboardingStepperProps {
  steps: StepDef[];
  currentStep: 1 | 2 | 3 | 4 | 5;
  completedSteps: number[];
}

export function OnboardingStepper({ steps, currentStep, completedSteps }: OnboardingStepperProps) {
  const currentMeta = steps.find(s => s.id === currentStep);

  return (
    <>
      {/* Compacto SM/XS */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, paddingX: 2, paddingY: 1.5 }}>
        <Stack spacing={1}>
          <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600 }}>
            Paso {currentStep} de {steps.length} · {currentMeta?.label}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(currentStep / steps.length) * 100}
            sx={{
              height: 6,
              borderRadius: 999,
              backgroundColor: colors.borderDefault,
              '& .MuiLinearProgress-bar': { backgroundColor: colors.brandPrimary },
            }}
          />
        </Stack>
      </Box>

      {/* Horizontal MD+ */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          backgroundColor: colors.bgCard,
          paddingY: 2,
          paddingX: 4,
        }}
      >
        <Stack direction="row" spacing={0} alignItems="flex-start" justifyContent="space-between">
          {steps.map((step, idx) => {
            const isCompleted = completedSteps.includes(step.id);
            const isActive = step.id === currentStep;
            const isPending = !isCompleted && !isActive;

            const circleBg = isCompleted || isActive ? colors.brandPrimary : colors.bgCard;
            const circleBorder = isCompleted || isActive ? colors.brandPrimary : colors.borderStrong;
            const circleColor = isCompleted || isActive ? colors.brandDarkest : colors.textSecondary;

            const showLineRight = idx < steps.length - 1;
            const nextCompleted = showLineRight && completedSteps.includes(step.id);

            return (
              <Stack
                key={step.id}
                spacing={0.75}
                alignItems="center"
                sx={{ flex: 1, minWidth: 0, position: 'relative' }}
              >
                {showLineRight && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 14,
                      left: '50%',
                      right: '-50%',
                      height: 2,
                      borderTop: nextCompleted
                        ? `2px solid ${colors.brandPrimary}`
                        : `2px dashed ${colors.borderStrong}`,
                      zIndex: 0,
                    }}
                  />
                )}
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: circleBg,
                    border: `2px solid ${circleBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: circleColor,
                    fontSize: 13,
                    fontWeight: 700,
                    zIndex: 1,
                    boxShadow: isActive ? '0 0 0 4px rgba(124, 255, 69, 0.18)' : 'none',
                    transition: 'box-shadow 120ms ease',
                  }}
                >
                  {isCompleted ? <CheckIcon sx={{ fontSize: 16 }} /> : step.id}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: isActive ? 600 : 500,
                    color: isPending ? colors.textSecondary : colors.textPrimary,
                    textAlign: 'center',
                    paddingX: 0.5,
                    lineHeight: 1.3,
                  }}
                >
                  {step.label}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Box>
    </>
  );
}

export default OnboardingStepper;
