
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./ui/ThemeToggle"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-servie">Servie</span>
          </a>
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
          <a href="#services" className="text-sm font-medium transition-colors hover:text-servie">
            Services
          </a>
          <a href="#how-it-works" className="text-sm font-medium transition-colors hover:text-servie">
            How It Works
          </a>
          <a href="#testimonials" className="text-sm font-medium transition-colors hover:text-servie">
            Testimonials
          </a>
          <a href="#become-provider" className="text-sm font-medium transition-colors hover:text-servie">
            Become a Provider
          </a>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="rounded-full">
              Sign In
            </Button>
            <Button className="rounded-full bg-servie hover:bg-servie-600">
              Sign Up
            </Button>
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto bg-background p-6 pb-32 shadow-lg animate-in slide-in-from-top lg:hidden">
            <div className="flex flex-col space-y-4">
              <a href="#services" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                Services
              </a>
              <a href="#how-it-works" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                How It Works
              </a>
              <a href="#testimonials" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                Testimonials
              </a>
              <a href="#become-provider" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                Become a Provider
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" className="w-full rounded-full">
                  Sign In
                </Button>
                <Button className="w-full rounded-full bg-servie hover:bg-servie-600">
                  Sign Up
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
