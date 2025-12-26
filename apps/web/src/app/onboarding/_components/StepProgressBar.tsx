import { ONBOARDING_STEPS, OnboardingStep } from '@/types/onboarding';

interface StepProgressBarProps {
  currentStep: OnboardingStep;
}

export function StepProgressBar({ currentStep }: StepProgressBarProps) {
  const currentStepIndex = ONBOARDING_STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="bg-white border-b">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-2">
          {ONBOARDING_STEPS.map((s, i) => (
            <div
              key={s.key}
              className={`flex items-center ${i < ONBOARDING_STEPS.length - 1 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${i <= currentStepIndex
                    ? 'bg-chicago-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                  }`}
              >
                {i + 1}
              </div>
              {i < ONBOARDING_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${i < currentStepIndex ? 'bg-chicago-blue-500' : 'bg-gray-200'
                    }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          {ONBOARDING_STEPS.map((s) => (
            <span key={s.key} className="text-center">
              {s.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
