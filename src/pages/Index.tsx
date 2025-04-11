
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import ServiceCategories from "@/components/ServiceCategories"
import HowItWorks from "@/components/HowItWorks"
import Testimonials from "@/components/Testimonials"
import ProviderCTA from "@/components/ProviderCTA"
import Footer from "@/components/Footer"

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <ServiceCategories />
        <HowItWorks />
        <Testimonials />
        <ProviderCTA />
      </main>
      <Footer />
    </div>
  )
}

export default Index
