
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const OurStory = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-r from-purple-600 to-servie text-white py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Our Story</h1>
              <p className="text-lg md:text-xl opacity-90">
                How Servie grew from an idea to a platform connecting thousands
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="space-y-12">
                <div>
                  <div className="flex items-center mb-4">
                    <div className="bg-servie text-white h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <h2 className="text-2xl font-bold ml-3">The Beginning (2023)</h2>
                  </div>
                  <p className="pl-11">
                    Servie began with a simple observation: despite the abundance of skilled service providers in Africa, connecting them with potential clients remained a challenge. Our founders, themselves entrepreneurs who had struggled to find reliable services, set out to create a platform that would bridge this gap and provide opportunities for skilled professionals to showcase their expertise.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-4">
                    <div className="bg-servie text-white h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <h2 className="text-2xl font-bold ml-3">Early Challenges</h2>
                  </div>
                  <p className="pl-11">
                    Like any startup, we faced numerous challenges. Building trust between service providers and clients was our biggest hurdle. We implemented a rigorous verification process and review system to ensure quality and reliability. Technology barriers in some regions meant we had to develop solutions that worked across various devices and internet connection speeds.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-4">
                    <div className="bg-servie text-white h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <h2 className="text-2xl font-bold ml-3">Growth & Expansion</h2>
                  </div>
                  <p className="pl-11">
                    By focusing on user experience and building a platform that truly addressed the needs of both service providers and clients, Servie began to grow rapidly. What started in a single city quickly expanded to multiple countries. Our marketplace for service-related products was added to complement the service offerings, creating a comprehensive ecosystem.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-4">
                    <div className="bg-servie text-white h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <h2 className="text-2xl font-bold ml-3">Community Impact</h2>
                  </div>
                  <p className="pl-11">
                    Beyond business metrics, we measure our success by the impact we've had on communities. Servie has helped thousands of service providers grow their businesses, many of whom had previously struggled to market their skills effectively. For clients, access to reliable services has improved quality of life and supported local economies.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-4">
                    <div className="bg-servie text-white h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold">5</div>
                    <h2 className="text-2xl font-bold ml-3">Where We Are Today</h2>
                  </div>
                  <p className="pl-11">
                    Today, Servie stands as a leading platform connecting service providers and clients across multiple countries. We've built a diverse community of professionals offering everything from home services to specialized professional consulting. Our commitment to quality, trust, and supporting local talent remains unwavering as we continue to grow.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-4">
                    <div className="bg-servie text-white h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold">6</div>
                    <h2 className="text-2xl font-bold ml-3">Looking Forward</h2>
                  </div>
                  <p className="pl-11">
                    Our journey is just beginning. We're constantly innovating and expanding our platform to better serve our users. Our vision is to become the go-to platform for services across Africa and beyond, creating economic opportunities and facilitating access to quality services for all.
                  </p>
                </div>
              </div>
              
              <div className="mt-16 p-6 border rounded-lg bg-muted/50">
                <h3 className="text-xl font-semibold mb-3">Join Us on Our Journey</h3>
                <p>
                  Whether you're a skilled professional looking to grow your business or someone in need of quality services, we invite you to be part of the Servie community. Together, we're reimagining how services are discovered, delivered, and experienced.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OurStory;
