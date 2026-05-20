import { Box, Stack, Typography, LinearProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CloseIcon from '@mui/icons-material/Close';
import { colors } from '@/theme/tokens';

export interface StepDef {
  id: 1 | 2 | 3 | 4 | 5 | 6;
  label: string;
}

interface OnboardingStepperProps {
  steps: StepDef[];
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  /** Pasos completados (datos guardados). Marcados con palomita verde. */
  completedSteps: number[];
  /** Pasos iniciados pero incompletos (datos parciales). Marcados con reloj ámbar. */
  startedSteps?: number[];
  /** Pasos con errores de validación. Marcados con cruz roja. */
  errorSteps?: number[];
}

type StepState = 'completed' | 'active' | 'started' | 'error' | 'pending';

function resolveState(
  stepId: number,
  currentStep: number,
  completedSteps: number[],
  startedSteps: number[],
  errorSteps: number[],
): StepState {
  if (errorSteps.includes(stepId)) return 'error';
  if (completedSteps.includes(stepId)) return 'completed';
  if (stepId === currentStep) return 'active';
  if (startedSteps.includes(stepId)) return 'started';
  return 'pending';
}

export function OnboardingStepper({
  steps,
  currentStep,
  completedSteps,
  startedSteps = [],
  errorSteps = [],
}: OnboardingStepperProps) {
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
            const state = resolveState(step.id, currentStep, completedSteps, startedSteps, errorSteps);

            const circleStyles = (() => {
              switch (state) {
                case 'completed':
                  return {
                    bg: colors.brandPrimary,
                    border: colors.brandPrimary,
                    color: colors.brandDarkest,
                  };
                case 'active':
                  return {
                    bg: colors.brandPrimary,
                    border: colors.brandPrimary,
                    color: colors.brandDarkest,
                  };
                case 'started':
                  return {
                    bg: colors.bannerWarning.bg,
                    border: colors.bannerWarning.fg,
                    color: colors.bannerWarning.fg,
                  };
                case 'error':
                  return {
                    bg: colors.bannerError.bg,
                    border: colors.bannerError.fg,
                    color: colors.bannerError.fg,
                  };
                default:
                  return {
                    bg: colors.bgCard,
                    border: colors.borderStrong,
                    color: colors.textSecondary,
                  };
              }
            })();

            const labelColor =
              state === 'pending' ? colors.textSecondary : colors.textPrimary;

            const icon = (() => {
              if (state === 'completed') return <CheckIcon sx={{ fontSize: 16 }} />;
              if (state === 'started') return <HourglassEmptyIcon sx={{ fontSize: 14 }} />;
              if (state === 'error') return <CloseIcon sx={{ fontSize: 16 }} />;
              return step.id;
            })();

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
                    backgroundColor: circleStyles.bg,
                    border: `2px solid ${circleStyles.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: circleStyles.color,
                    fontSize: 13,
                    fontWeight: 700,
                    zIndex: 1,
                    boxShadow: state === 'active' ? '0 0 0 4px rgba(124, 255, 69, 0.18)' : 'none',
                    transition: 'box-shadow 120ms ease',
                  }}
                >
                  {icon}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: state === 'active' ? 600 : 500,
                    color: labelColor,
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
