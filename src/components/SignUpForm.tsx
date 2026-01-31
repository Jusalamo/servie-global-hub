import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
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
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  first_name: z.string().min(2, { message: "First name must be at least 2 characters" }),
  last_name: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
  role: z.enum(["client", "provider", "seller"]).default("client"),
  // Additional fields for provider/seller
	business_name: z.string().optional(),
  business_description: z.string().optional(),
  phone_number: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).superRefine((data, ctx) => {
  // Enforce required business fields for seller/provider to prevent incomplete accounts
  // and to ensure seller slug generation has a stable source.
  if ((data.role === "seller" || data.role === "provider") && !data.business_name?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["business_name"],
      message: data.role === "seller" ? "Shop name is required" : "Business name is required",
    });
  }
});

type FormValues = z.infer<typeof formSchema>;

const SignUpForm = ({ selectedRole = "client" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Convert selectedRole to the correct type to avoid TypeScript errors
  const typedSelectedRole: "client" | "provider" | "seller" = 
    (selectedRole === "provider" || selectedRole === "seller") 
      ? selectedRole 
      : "client";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
      role: typedSelectedRole,
      // Additional fields initialized
      business_name: "",
      business_description: "",
      phone_number: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (!data.email || !data.password) {
        toast.error("Email and password are required");
        setIsLoading(false);
        return;
      }

      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        setIsLoading(false);
        return;
      }

      // Seller/Provider require business name
      if ((data.role === 'seller' || data.role === 'provider') && !data.business_name?.trim()) {
        toast.error(data.role === 'seller' ? 'Shop name is required' : 'Business name is required');
        setIsLoading(false);
        return;
      }

      // Create the user account - pass snake_case keys matching DB trigger expectations
      const { error } = await signUp(data.email, data.password, {
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        role: data.role,
        business_name: data.business_name?.trim() || '',
        business_description: data.business_description?.trim() || '',
        phone: data.phone_number?.trim() || '',
      });

      if (error) {
        // Provide user-friendly error messages based on common issues
        const errorMessage = error.message?.toLowerCase() || '';
        
        if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
          toast.error("This email is already registered. Please sign in instead.");
        } else if (errorMessage.includes('invalid email')) {
          toast.error("Please enter a valid email address.");
        } else if (errorMessage.includes('password')) {
          toast.error("Password must be at least 8 characters long.");
        } else if (errorMessage.includes('database') || errorMessage.includes('saving') || errorMessage.includes('constraint')) {
          toast.error("Account creation failed. Please check your information and try again.");
          console.error('Database error during signup:', error);
        } else if (errorMessage.includes('rate limit')) {
          toast.error("Too many attempts. Please wait a moment and try again.");
        } else {
          toast.error(error.message || "Unable to create account. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      toast.success("Account created! Please check your email to verify your account.");
      // Send user to the email confirmation instructions page.
      navigate("/confirm-email", { replace: true });
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const showBusinessFields = typedSelectedRole === "provider" || typedSelectedRole === "seller";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showBusinessFields && (
          <>
            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{typedSelectedRole === "provider" ? "Business Name" : "Shop Name"}</FormLabel>
                  <FormControl>
                    <Input placeholder={typedSelectedRole === "provider" ? "ABC Services" : "My Shop"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 234 567 8900" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="business_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {typedSelectedRole === "provider" ? "Business Description" : "Shop Description"}
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={
                        typedSelectedRole === "provider" 
                          ? "Tell us about your services..." 
                          : "Describe your shop and products..."
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormDescription>
                Password must be at least 8 characters long.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          defaultValue={typedSelectedRole}
          render={({ field }) => (
            <input type="hidden" {...field} />
          )}
        />

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I agree to the{" "}
                  <Link to="/terms-conditions" className="text-servie hover:underline">
                    Terms and Conditions
                  </Link>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
