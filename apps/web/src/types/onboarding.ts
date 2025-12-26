export type OnboardingStep = 'household' | 'income' | 'eligibility' | 'review';

export interface OnboardingFormData {
  householdSize: number;
  numAdults: number;
  numChildren: number;
  hasSenior: boolean;
  hasDisabled: boolean;
  annualIncome: number;
  hasChaDebt: boolean;
}

export const INITIAL_FORM_DATA: OnboardingFormData = {
  householdSize: 1,
  numAdults: 1,
  numChildren: 0,
  hasSenior: false,
  hasDisabled: false,
  annualIncome: 0,
  hasChaDebt: false,
};

export const ONBOARDING_STEPS: { key: OnboardingStep; title: string }[] = [
  { key: 'household', title: 'Household' },
  { key: 'income', title: 'Income' },
  { key: 'eligibility', title: 'Eligibility' },
  { key: 'review', title: 'Review' },
];
