'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useOnboarding } from './_hooks/useOnboarding';
import {
  StepProgressBar,
  HouseholdStep,
  IncomeStep,
  EligibilityStep,
  ReviewStep,
} from './_components';

export default function OnboardingPage() {
  const {
    step,
    formData,
    updateFormData,
    isSubmitting,
    handleSubmit,
    goNext,
    goBack,
  } = useOnboarding();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link href="/" className="text-chicago-blue-600 font-semibold inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <StepProgressBar currentStep={step} />

      {/* Form Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="card">
          {step === 'household' && (
            <HouseholdStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={goNext}
            />
          )}

          {step === 'income' && (
            <IncomeStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 'eligibility' && (
            <EligibilityStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 'review' && (
            <ReviewStep
              formData={formData}
              updateFormData={updateFormData}
              onNext={goNext}
              onBack={goBack}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </main>
  );
}
