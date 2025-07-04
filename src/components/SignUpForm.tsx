
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type UserRole = "client" | "provider" | "seller" | "admin";

interface SignUpFormProps {
  selectedRole: UserRole;
}

export default function SignUpForm({ selectedRole }: SignUpFormProps) {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await signUp(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: selectedRole
      });
      
      toast.success(`Account created successfully as ${selectedRole}!`);
      
      // Navigate based on role after successful signup
      setTimeout(() => {
        switch (selectedRole) {
          case "provider":
            navigate("/dashboard/provider?tab=overview", { replace: true });
            break;
          case "seller":
            navigate("/dashboard/seller?tab=overview", { replace: true });
            break;
          case "admin":
            navigate("/dashboard/admin", { replace: true });
            break;
          default:
            navigate("/dashboard/client", { replace: true });
        }
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="dark:text-white">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={handleInputChange}
            className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="dark:text-white">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={handleInputChange}
            className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="dark:text-white">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          placeholder={`e.g., john.${selectedRole}@example.com`}
          className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone" className="dark:text-white">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="dark:text-white">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={formData.password}
          onChange={handleInputChange}
          className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="dark:text-white">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
      </div>
      
      <Button
        type="submit"
        className="w-full bg-servie hover:bg-servie-600"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          `Create ${selectedRole} account`
        )}
      </Button>
      
      <div className="text-sm text-center text-gray-500 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
        <p className="font-medium">Demo Instructions:</p>
        <p>Use any valid email and password to create your {selectedRole} account.</p>
        <p>You'll be redirected to your personalized dashboard after signup.</p>
      </div>
    </form>
  );
}
