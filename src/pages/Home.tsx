
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Users, ShoppingBag, Briefcase } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-servie to-servie-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Welcome to Servie</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Connect with service providers and discover amazing products across Africa
            </p>
            <div className="space-x-4">
              <Link to="/services">
                <Button size="lg" variant="secondary">
                  Browse Services
                </Button>
              </Link>
              <Link to="/shop">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-servie">
                  Shop Products
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Servie?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Briefcase className="h-12 w-12 text-servie mx-auto mb-4" />
                  <CardTitle className="text-center">Quality Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    Connect with verified service providers across various categories
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <ShoppingBag className="h-12 w-12 text-servie mx-auto mb-4" />
                  <CardTitle className="text-center">Amazing Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    Discover unique products from local sellers and artisans
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-12 w-12 text-servie mx-auto mb-4" />
                  <CardTitle className="text-center">Trusted Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    Join thousands of satisfied customers and service providers
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
