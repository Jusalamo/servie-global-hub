
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-96 -right-96 w-[800px] h-[800px] rounded-full bg-servie/5 dark:bg-servie/10"></div>
        <div className="absolute top-1/4 -left-96 w-[800px] h-[800px] rounded-full bg-servie/10 dark:bg-servie/5"></div>
      </div>
      
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Find Expert Services for Any Task
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Connect with skilled professionals across Africa and globally. Get quotes, book services, and get things done - all in one platform.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for any service..."
                  className="pl-10 rounded-full w-full"
                />
              </div>
              <Button size="lg" className="rounded-full bg-servie hover:bg-servie-600">
                Search
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span>Popular:</span>
              <a href="#" className="underline hover:text-servie">Home Cleaning</a>
              <a href="#" className="underline hover:text-servie">Web Development</a>
              <a href="#" className="underline hover:text-servie">Electrical Repairs</a>
              <a href="#" className="underline hover:text-servie">Tutoring</a>
            </div>
          </div>
          <div className="mx-auto flex items-center justify-center">
            <div className="aspect-video overflow-hidden rounded-2xl border bg-muted p-2">
              <img
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3"
                width={600}
                height={400}
                alt="Handshake between a service provider and client"
                className="aspect-video object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
