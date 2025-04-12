
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./ui/ThemeToggle"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const scrollToSection = (sectionId: string) => {
    // Close the mobile menu if it's open
    if (isMenuOpen) {
      setIsMenuOpen(false)
    }

    // If we're on the home page, scroll to the section
    if (window.location.pathname === '/') {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // If we're not on the home page, navigate to the home page with the section as a hash
      navigate(`/#${sectionId}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-servie">Servie</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          <button 
            onClick={() => scrollToSection('services')} 
            className="text-sm font-medium transition-colors hover:text-servie"
          >
            Services
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')} 
            className="text-sm font-medium transition-colors hover:text-servie"
          >
            How It Works
          </button>
          <button 
            onClick={() => scrollToSection('testimonials')} 
            className="text-sm font-medium transition-colors hover:text-servie"
          >
            Testimonials
          </button>
          <button 
            onClick={() => scrollToSection('become-provider')} 
            className="text-sm font-medium transition-colors hover:text-servie"
          >
            Become a Provider
          </button>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="rounded-full" asChild>
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button className="rounded-full bg-servie hover:bg-servie-600" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto bg-background p-6 pb-32 shadow-lg animate-in slide-in-from-top lg:hidden">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('services')}
                className="text-lg font-medium"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-lg font-medium"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="text-lg font-medium"
              >
                Testimonials
              </button>
              <button 
                onClick={() => scrollToSection('become-provider')}
                className="text-lg font-medium"
              >
                Become a Provider
              </button>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" className="w-full rounded-full" asChild>
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button className="w-full rounded-full bg-servie hover:bg-servie-600" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
                <div className="flex justify-center py-2">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
