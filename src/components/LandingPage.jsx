import Navigation from './Navigation';
import HeroSection from './HeroSection';
import FeaturedGigsSection from './FeaturedGigsSection';
import CategoriesSection from './CategoriesSection';
import ActiveWorkersSection from './ActiveWorkersSection';
import CTASection from './CTASection';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen background">
      <Navigation />
      <HeroSection />
      <FeaturedGigsSection />
      <CategoriesSection />
      <ActiveWorkersSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
