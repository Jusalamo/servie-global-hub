
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Eye, Trash2 } from 'lucide-react';
import { services } from '@/data/mockData';

const ServicesTab = () => {
  const [myServices, setMyServices] = useState(services.slice(0, 3)); // Mock user's services

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Services</h2>
        <Button className="bg-servie hover:bg-servie-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {myServices.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">You haven't created any services yet.</p>
            <Button className="bg-servie hover:bg-servie-600">
              Create Your First Service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {myServices.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <img 
                      src={service.imageUrl} 
                      alt={service.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {service.title}
                        {service.featured && <Badge className="bg-yellow-500">Featured</Badge>}
                      </CardTitle>
                      <p className="text-muted-foreground mt-2">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Price:</span> ${service.price}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {service.category}
                  </div>
                  <div>
                    <span className="font-medium">Rating:</span> {service.rating}/5
                  </div>
                  <div>
                    <span className="font-medium">Reviews:</span> {service.reviewCount}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesTab;
