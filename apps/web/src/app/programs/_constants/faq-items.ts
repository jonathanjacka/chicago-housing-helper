export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How do I apply for subsidized housing?',
    answer: 'Start by completing our eligibility questionnaire to see which programs you may qualify for. Each program has its own application process - some are online through the CHA website, others require in-person applications. We\'ll show you the specific steps for each program you\'re eligible for.',
  },
  {
    question: 'What income level do I need to qualify?',
    answer: 'Programs have different income limits based on your household size. For example, a family of 4 earning around $50,000/year would likely qualify for many programs. The key number is your \"percentage of AMI\" (Area Median Income) - most programs accept households at 30-80% of AMI. Our questionnaire will calculate this for you and show exactly which programs match your situation.',
  },
  {
    question: 'How long are the waitlists?',
    answer: 'Waitlist times vary significantly. Some programs have waitlists of several years, while others (especially newer Project-Based Voucher properties) may have shorter wait times. We show you which programs currently have open waitlists so you can prioritize those.',
  },
  {
    question: 'Can I apply to multiple programs at once?',
    answer: 'Yes! We recommend applying to all programs you\'re eligible for to increase your chances. There\'s no penalty for being on multiple waitlists, and you can accept whichever opportunity comes first.',
  },
  {
    question: 'What documents do I need?',
    answer: 'Most programs require proof of identity, income verification (pay stubs, tax returns), and proof of Chicago residency. We have a document checklist feature that shows you exactly what you\'ll need for your situation.',
  },
  {
    question: 'I have bad credit or an eviction history. Can I still qualify?',
    answer: 'It depends on the program and circumstances. Some programs are more flexible than others. Criminal background and eviction history may affect eligibility, but each case is reviewed individually. We encourage you to still apply and be honest on your application.',
  },
];
