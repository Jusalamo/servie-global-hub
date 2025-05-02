
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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

const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  price: z.number().min(1, { message: "Price must be at least $1" }),
  category: z.string().min(1, { message: "Please select a category" }),
  stock: z.number().min(0, { message: "Stock cannot be negative" }),
  sku: z.string().optional(),
  weight: z.number().min(0, { message: "Weight cannot be negative" }).optional(),
  dimensions: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  freeShipping: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

const categories = [
  { id: "electronics", name: "Electronics" },
  { id: "clothing", name: "Clothing & Apparel" },
  { id: "home", name: "Home & Garden" },
  { id: "beauty", name: "Beauty & Personal Care" },
  { id: "sports", name: "Sports & Outdoors" },
  { id: "books", name: "Books & Media" },
  { id: "toys", name: "Toys & Games" },
  { id: "jewelry", name: "Jewelry & Accessories" },
  { id: "health", name: "Health & Wellness" },
  { id: "food", name: "Food & Grocery" }
];

export default function AddProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<{ id: string, file: File | null, preview: string }[]>([
    { id: "1", file: null, preview: "" }
  ]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 29.99,
      category: "",
      stock: 10,
      sku: "",
      weight: 0,
      dimensions: "",
      featured: false,
      published: true,
      freeShipping: false,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to save the product
      console.log("Product data:", data);
      console.log("Images:", images.filter(img => img.file !== null));
      
      toast.success("Product added successfully!");
      form.reset();
      setImages([{ id: "1", file: null, preview: "" }]);
    } catch (error) {
      toast.error("Failed to add product. Please try again.");
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
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Premium Bluetooth Headphones" {...field} />
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
                    placeholder="Describe your product in detail" 
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      step="0.01" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0}
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="SKU123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight in lbs (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0} 
                      step="0.01" 
                      placeholder="0.0"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="dimensions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dimensions (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 10 x 5 x 3 inches" {...field} />
                </FormControl>
                <FormDescription>
                  Format: Length x Width x Height
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <FormLabel>Product Images</FormLabel>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map(img => (
                <Card key={img.id} className="overflow-hidden">
                  <CardContent className="p-0 relative">
                    {img.preview ? (
                      <>
                        <img 
                          src={img.preview} 
                          alt="Product preview" 
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Feature Product</FormLabel>
                    <FormDescription>
                      Show this product on the homepage
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Publish Product</FormLabel>
                    <FormDescription>
                      Make product visible in store
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="freeShipping"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Free Shipping</FormLabel>
                    <FormDescription>
                      Offer free shipping for this product
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Product...
              </>
            ) : (
              "Add Product"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
