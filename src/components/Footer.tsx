
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react"

const categories = [
  "Home Services",
  "Professional Services",
  "Personal Care",
  "Events & Catering",
  "Transportation",
  "Education",
  "Health & Wellness",
  "Creative Services",
]

const company = [
  "About Us",
  "Careers",
  "Press",
  "Blog",
  "Partners",
  "Contact Us",
]

const support = [
  "Help Center",
  "Safety Center",
  "Community Guidelines",
  "Cookie Policy",
  "Privacy Policy",
  "Terms of Service",
]

export default function Footer() {
  return (
    <footer className="bg-muted dark:bg-muted/50 border-t">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-servie">Servie</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Connecting service providers with clients across Africa and globally. Find expert services for any task or become a provider to showcase your skills.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-servie">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-servie">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-servie">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-servie">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-lg">Categories</h3>
            <ul className="space-y-2">
              {categories.map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-servie">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-lg">Company</h3>
            <ul className="space-y-2">
              {company.map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-servie">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-lg">Support</h3>
            <ul className="space-y-2">
              {support.map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-servie">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Servie. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-servie">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-servie">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
