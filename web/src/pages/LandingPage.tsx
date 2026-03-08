import { LanguageProvider } from '../contexts/LanguageContext';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import StatsBar from '../components/landing/StatsBar';
import HowItWorks from '../components/landing/HowItWorks';
import Features from '../components/landing/Features';
import WhyJoin from '../components/landing/WhyJoin';
import Testimonials from '../components/landing/Testimonials';
import JoinSteps from '../components/landing/JoinSteps';
import FAQ from '../components/landing/FAQ';
import DownloadCTA from '../components/landing/DownloadCTA';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <LanguageProvider>
      <main>
        <Navbar />
        <HeroSection />
        <StatsBar />
        <HowItWorks />
        <Features />
        <WhyJoin />
        <Testimonials />
        <JoinSteps />
        <FAQ />
        <DownloadCTA />
        <Footer />
      </main>
    </LanguageProvider>
  );
}
