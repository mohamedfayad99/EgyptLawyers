import { LanguageProvider } from '../contexts/LanguageContext';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import HowItWorks from '../components/landing/HowItWorks';
import Features from '../components/landing/Features';
import WhyJoin from '../components/landing/WhyJoin';
import DownloadCTA from '../components/landing/DownloadCTA';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <LanguageProvider>
      <main>
        <Navbar />
        <HeroSection />
        <HowItWorks />
        <Features />
        <WhyJoin />
        <DownloadCTA />
        <Footer />
      </main>
    </LanguageProvider>
  );
}
