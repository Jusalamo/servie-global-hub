
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Mail className="h-8 w-8 text-servie mb-2" />
              <CardTitle>Email</CardTitle>
            </CardHeader>
            <CardContent>
              <p>support@servie.com</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Phone className="h-8 w-8 text-servie mb-2" />
              <CardTitle>Phone</CardTitle>
            </CardHeader>
            <CardContent>
              <p>+234 123 456 7890</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <MapPin className="h-8 w-8 text-servie mb-2" />
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Lagos, Nigeria</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
