import {
  HeroSection,
  TrustSignals,
  HowItWorks,
  ProgramsPreview,
  CTASection,
  Footer,
} from './_home/_components';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <TrustSignals />
      <HowItWorks />
      <ProgramsPreview />
      <CTASection />
      <Footer />
    </main>
  );
}
