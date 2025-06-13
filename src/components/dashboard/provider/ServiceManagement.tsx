
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { serviceAPI } from "@/services/supabaseAPI";
import { Pencil, Trash2, Plus, Eye } from "lucide-react";
import AddServiceForm from "./AddServiceForm";

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await serviceAPI.getMyServices();
      setServices(data);
    } catch (error) {
      toast.error("Failed to load services");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    try {
      await serviceAPI.deleteService(id);
      toast.success("Service deleted successfully");
      loadServices();
    } catch (error) {
      toast.error("Failed to delete service");
      console.error(error);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await serviceAPI.updateService(id, { status: newStatus });
      toast.success(`Service ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      loadServices();
    } catch (error) {
      toast.error("Failed to update service status");
      console.error(error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading services...</div>;
  }

  if (showAddForm || editingService) {
    return (
      <AddServiceForm
        service={editingService}
        onSuccess={() => {
          setShowAddForm(false);
          setEditingService(null);
          loadServices();
        }}
        onCancel={() => {
          setShowAddForm(false);
          setEditingService(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Services</h2>
        <Button onClick={() => setShowAddForm(true)} className="bg-servie hover:bg-servie-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">You haven't created any services yet.</p>
            <Button onClick={() => setShowAddForm(true)} className="bg-servie hover:bg-servie-600">
              Create Your First Service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {services.map((service: any) => (
            <Card key={service.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {service.title}
                      <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                        {service.status}
                      </Badge>
                      {service.featured && <Badge className="bg-yellow-500">Featured</Badge>}
                    </CardTitle>
                    <p className="text-muted-foreground mt-2">{service.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(service.id, service.status)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingService(service)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-700"
                    >
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
                    <span className="font-medium">Location:</span> {service.location || 'Remote'}
                  </div>
                  <div>
                    <span className="font-medium">Response Time:</span> {service.response_time || 'Standard'}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {new Date(service.created_at).toLocaleDateString()}
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

export default ServiceManagement;
