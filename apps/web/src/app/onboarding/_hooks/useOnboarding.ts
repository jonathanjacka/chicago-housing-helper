'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  OnboardingStep,
  OnboardingFormData,
  INITIAL_FORM_DATA,
  ONBOARDING_STEPS
} from '@/types/onboarding';

interface UseOnboardingReturn {
  step: OnboardingStep;
  setStep: (step: OnboardingStep) => void;
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
  isSubmitting: boolean;
  handleSubmit: () => Promise<void>;
  currentStepIndex: number;
  goNext: () => void;
  goBack: () => void;
  canContinue: boolean;
}

export function useOnboarding(): UseOnboardingReturn {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>('household');
  const [formData, setFormData] = useState<OnboardingFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = useCallback((updates: Partial<OnboardingFormData>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...updates };
      if ('numAdults' in updates || 'numChildren' in updates) {
        newData.householdSize = newData.numAdults + newData.numChildren;
      }
      return newData;
    });
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      sessionStorage.setItem('housingProfile', JSON.stringify(formData));
      router.push('/results');
    } catch (error) {
      console.error('Error saving profile:', error);
      setIsSubmitting(false);
    }
  };

  const currentStepIndex = ONBOARDING_STEPS.findIndex((s) => s.key === step);

  const goNext = useCallback(() => {
    const nextStep = ONBOARDING_STEPS[currentStepIndex + 1];
    if (nextStep) setStep(nextStep.key);
  }, [currentStepIndex]);

  const goBack = useCallback(() => {
    const prevStep = ONBOARDING_STEPS[currentStepIndex - 1];
    if (prevStep) setStep(prevStep.key);
  }, [currentStepIndex]);

  const canContinue = step !== 'income' || formData.annualIncome > 0;

  return {
    step,
    setStep,
    formData,
    updateFormData,
    isSubmitting,
    handleSubmit,
    currentStepIndex,
    goNext,
    goBack,
    canContinue,
  };
}
