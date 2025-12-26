import { OnboardingFormData } from '@/types/onboarding';

interface StepProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onBack?: () => void;
}

export function HouseholdStep({ formData, updateFormData, onNext }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tell us about your household
        </h2>
        <p className="text-gray-600">
          This helps us find programs that match your family size.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Number of Adults (18+)</label>
          <select
            className="form-input"
            value={formData.numAdults}
            onChange={(e) => updateFormData({ numAdults: parseInt(e.target.value) })}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Number of Children (under 18)</label>
          <select
            className="form-input"
            value={formData.numChildren}
            onChange={(e) => updateFormData({ numChildren: parseInt(e.target.value) })}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-700">
          <strong>Total household size:</strong> {formData.householdSize}{' '}
          {formData.householdSize === 1 ? 'person' : 'people'}
        </p>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.hasSenior}
            onChange={(e) => updateFormData({ hasSenior: e.target.checked })}
            className="w-5 h-5 rounded-sm border-gray-300 text-chicago-blue-600 focus:ring-chicago-blue-500"
          />
          <span>Someone in my household is 62 years or older</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.hasDisabled}
            onChange={(e) => updateFormData({ hasDisabled: e.target.checked })}
            className="w-5 h-5 rounded-sm border-gray-300 text-chicago-blue-600 focus:ring-chicago-blue-500"
          />
          <span>Someone in my household has a disability</span>
        </label>
      </div>

      <div className="flex justify-end">
        <button onClick={onNext} className="btn-primary">
          Continue
        </button>
      </div>
    </div>
  );
}

export function IncomeStep({ formData, updateFormData, onNext, onBack }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What is your household income?
        </h2>
        <p className="text-gray-600">
          Enter your total annual household income before taxes.
        </p>
      </div>

      <div>
        <label className="form-label">Annual Household Income</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            className="form-input pl-8"
            placeholder="35000"
            value={formData.annualIncome || ''}
            onChange={(e) => updateFormData({ annualIncome: parseInt(e.target.value) || 0 })}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Include wages, benefits, Social Security, and any other income.
        </p>
      </div>

      <div className="bg-chicago-blue-50 rounded-lg p-4 text-sm">
        <p className="text-chicago-blue-800">
          <strong>Why we ask:</strong> Most housing programs have income limits based
          on a percentage of the Area Median Income (AMI). We use this to match you
          with programs you may qualify for.
        </p>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="btn-secondary">Back</button>
        <button onClick={onNext} disabled={!formData.annualIncome} className="btn-primary">
          Continue
        </button>
      </div>
    </div>
  );
}

export function EligibilityStep({ formData, updateFormData, onNext, onBack }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          A few more questions
        </h2>
        <p className="text-gray-600">
          These help us give you accurate eligibility information.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasChaDebt}
              onChange={(e) => updateFormData({ hasChaDebt: e.target.checked })}
              className="w-5 h-5 mt-0.5 rounded-sm border-gray-300 text-chicago-blue-600 focus:ring-chicago-blue-500"
            />
            <div>
              <span className="font-medium">
                I owe money to CHA or another housing program
              </span>
              <p className="text-sm text-gray-500 mt-1">
                Outstanding debt must usually be paid before qualifying for new assistance.
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="btn-secondary">Back</button>
        <button onClick={onNext} className="btn-primary">Continue</button>
      </div>
    </div>
  );
}

interface ReviewStepProps extends StepProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ReviewStep({ formData, onBack, onSubmit, isSubmitting }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review your information
        </h2>
        <p className="text-gray-600">
          Make sure everything looks correct before we find your matches.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Household</h3>
          <ul className="text-gray-700 space-y-1">
            <li>
              {formData.householdSize}{' '}
              {formData.householdSize === 1 ? 'person' : 'people'} (
              {formData.numAdults} adult{formData.numAdults !== 1 && 's'}
              {formData.numChildren > 0 &&
                `, ${formData.numChildren} child${formData.numChildren !== 1 ? 'ren' : ''}`}
              )
            </li>
            {formData.hasSenior && <li>• Includes senior (62+)</li>}
            {formData.hasDisabled && <li>• Includes person with disability</li>}
          </ul>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Income</h3>
          <p className="text-gray-700">
            ${formData.annualIncome.toLocaleString()} per year
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Eligibility</h3>
          <ul className="text-gray-700 space-y-1">
            <li>
              {formData.hasChaDebt
                ? '• Has outstanding CHA debt'
                : '• No outstanding CHA debt'}
            </li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="btn-secondary">Back</button>
        <button onClick={onSubmit} disabled={isSubmitting} className="btn-warm">
          {isSubmitting ? 'Finding matches...' : 'See My Matches'}
        </button>
      </div>
    </div>
  );
}
