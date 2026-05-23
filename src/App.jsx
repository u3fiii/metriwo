import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TrustedBrands from './components/TrustedBrands'
import FeatureTabs from './components/FeatureTabs'
import PlatformsSection from './components/PlatformsSection'
import CtaSection from './components/CtaSection'
import PricingSection from './components/PricingSection'
import Footer from './components/Footer'
import CustomScrollbar from './components/CustomScrollbar'
import PageBackground from './components/ui/PageBackground'
import DotBackground from './components/ui/DotBackground'

export default function App() {
  return (
    <>
      <PageBackground />
      <DotBackground />
      <div className="relative z-[1] min-h-screen text-zinc-900">
        <Navbar />
        <main className="relative z-[1]">
          <Hero />
          <TrustedBrands />
          <FeatureTabs />
          <PlatformsSection />
          <PricingSection />
          <CtaSection />
        </main>
        <Footer />
        <CustomScrollbar />
      </div>
    </>
  )
}
