
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { serviceAPI } from "@/services/serviceAPI";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";

interface AddServiceFormProps {
  service?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const AddServiceForm = ({ service, onSuccess, onCancel }: AddServiceFormProps) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: service?.title || "",
    description: service?.description || "",
    price: service?.price || "",
    location: service?.location || "",
    response_time: service?.response_time || "",
    service_city: service?.service_city || "",
    service_country: service?.service_country || ""
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      toast.success("Image selected successfully");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = service?.image_url || null;

      // Upload image if selected
      if (imageFile) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const fileExt = imageFile.name.split('.').pop();
        const filePath = `services/${user.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;

        // Save image URL to service_images table
        if (service?.id) {
          await supabase.from('service_images').insert({
            service_id: service.id,
            url: imageUrl,
            is_primary: true
          });
        }
      }

      const serviceData = {
        ...formData,
        price: parseFloat(formData.price),
        status: 'active'
      };

      if (service) {
        await serviceAPI.updateService(service.id, serviceData);
        toast.success("Service updated successfully");
      } else {
        const newService = await serviceAPI.createService(serviceData);
        
        // Save image for new service
        if (imageUrl && newService.id) {
          await supabase.from('service_images').insert({
            service_id: newService.id,
            url: imageUrl,
            is_primary: true
          });
        }
        
        toast.success("Service created successfully");
      }
      onSuccess();
    } catch (error) {
      toast.error("Failed to save service");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {service ? "Edit Service" : "Add New Service"}
        </h2>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Service Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="response_time">Response Time</Label>
              <Input
                id="response_time"
                value={formData.response_time}
                onChange={(e) => handleInputChange("response_time", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="service_city">Service City</Label>
                <Input
                  id="service_city"
                  value={formData.service_city}
                  onChange={(e) => handleInputChange("service_city", e.target.value)}
                  placeholder="e.g. Nairobi"
                />
              </div>

              <div>
                <Label htmlFor="service_country">Service Country</Label>
                <Input
                  id="service_country"
                  value={formData.service_country}
                  onChange={(e) => handleInputChange("service_country", e.target.value)}
                  placeholder="e.g. Kenya"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image">Service Image</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <div className="mt-4">
                    <label htmlFor="image" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium">
                        {imageFile ? imageFile.name : 'Choose an image'}
                      </span>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="bg-servie hover:bg-servie-600">
              {loading ? "Saving..." : service ? "Update Service" : "Create Service"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddServiceForm;
