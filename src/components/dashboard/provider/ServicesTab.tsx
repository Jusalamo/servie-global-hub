
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Eye, MoreHorizontal, MapPin, Star, Package } from "lucide-react";
import { services } from "@/data/mockData";

const ServicesTab = () => {
  const [userServices] = useState(services.slice(0, 5)); // Show first 5 services as user's services

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Services</h2>
        <Button className="bg-servie hover:bg-servie-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid gap-6">
        {userServices.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {service.location}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                      {service.rating} ({service.reviewCount} reviews)
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={service.featured ? "default" : "secondary"}>
                    {service.featured ? "Featured" : "Active"}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {service.description}
              </p>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-servie">
                  ${service.price}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {userServices.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No services yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first service to attract clients.
            </p>
            <Button className="bg-servie hover:bg-servie-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Service
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServicesTab;
