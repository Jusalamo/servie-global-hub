
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Image, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";

const serviceSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  price: z.number().min(5, { message: "Price must be at least $5" }),
  duration: z.number().min(15, { message: "Duration must be at least 15 minutes" }),
  location: z.string().min(1, { message: "Please specify a location" }),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const categories = [
  { id: "cleaning", name: "Cleaning" },
  { id: "home-repair", name: "Home Repair" },
  { id: "plumbing", name: "Plumbing" },
  { id: "electrical", name: "Electrical" },
  { id: "landscaping", name: "Landscaping" },
  { id: "beauty", name: "Beauty & Wellness" },
  { id: "tech", name: "Technology" },
  { id: "education", name: "Education" },
  { id: "design", name: "Design & Creative" },
  { id: "business", name: "Business Services" }
];

export default function AddServiceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<{ id: string, file: File | null, preview: string }[]>([
    { id: "1", file: null, preview: "" }
  ]);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: 50,
      duration: 60,
      location: "Remote",
    },
  });

  const onSubmit = async (data: ServiceFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to save the service
      console.log("Service data:", data);
      console.log("Images:", images.filter(img => img.file !== null));
      
      toast.success("Service added successfully!");
      form.reset();
      setImages([{ id: "1", file: null, preview: "" }]);
    } catch (error) {
      toast.error("Failed to add service. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImages(prev => prev.map(img => 
          img.id === id 
            ? { ...img, file, preview: reader.result as string } 
            : img
        ));
        
        // Add a new empty image slot if all current slots have images
        if (!images.some(img => img.file === null)) {
          setImages(prev => [...prev, { 
            id: Date.now().toString(), 
            file: null, 
            preview: "" 
          }]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => 
      prev.filter(img => img.id !== id || (prev.length <= 1 && img.id === id))
        .map(img => img.id === id ? { ...img, file: null, preview: "" } : img)
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Service</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Professional Web Design" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your service in detail" 
                    className="min-h-32"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Input 
                        type="number" 
                        min={5}
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                      <span className="min-w-[3rem] text-muted-foreground">${field.value}</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <Slider
                        min={15}
                        max={240}
                        step={15}
                        value={[field.value]}
                        onValueChange={values => field.onChange(values[0])}
                      />
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">15m</span>
                        <span className="text-sm">{field.value} minutes</span>
                        <span className="text-xs text-muted-foreground">4h</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Where will this service be provided?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Remote">Remote/Online</SelectItem>
                      <SelectItem value="Client">At Client's Location</SelectItem>
                      <SelectItem value="Provider">At My Location</SelectItem>
                      <SelectItem value="Mixed">Mixed/Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-3">
            <FormLabel>Service Images</FormLabel>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map(img => (
                <Card key={img.id} className="overflow-hidden">
                  <CardContent className="p-0 relative">
                    {img.preview ? (
                      <>
                        <img 
                          src={img.preview} 
                          alt="Service preview" 
                          className="w-full aspect-square object-cover" 
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2 h-8 w-8"
                          onClick={() => removeImage(img.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 cursor-pointer gap-2 border-2 border-dashed rounded-md bg-muted/50 border-muted-foreground/20">
                        <Image className="w-8 h-8 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Add Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(img.id, e)}
                        />
                      </label>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Upload up to 5 images. First image will be set as cover.
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Service...
              </>
            ) : (
              "Add Service"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
