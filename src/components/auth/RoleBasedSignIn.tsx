
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Loader2, Briefcase, ShoppingBag, User, Shield } from 'lucide-react';

type UserRole = "client" | "provider" | "seller" | "admin";

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const roleOptions: RoleOption[] = [
  {
    value: "client",
    label: "I'm a Client",
    description: "Book services and purchase products",
    icon: <User className="h-6 w-6" />,
    color: "bg-blue-500"
  },
  {
    value: "provider",
    label: "I'm a Service Provider",
    description: "Offer professional services",
    icon: <Briefcase className="h-6 w-6" />,
    color: "bg-green-500"
  },
  {
    value: "seller",
    label: "I'm a Seller",
    description: "Sell products in the marketplace",
    icon: <ShoppingBag className="h-6 w-6" />,
    color: "bg-purple-500"
  },
  {
    value: "admin",
    label: "I'm an Admin",
    description: "Manage platform operations",
    icon: <Shield className="h-6 w-6" />,
    color: "bg-red-500"
  }
];

export function RoleBasedSignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    if (!selectedRole) {
      toast.error("Please select your role first");
      return;
    }

    setIsLoading(true);

    try {
      // For development - simulate role-based authentication
      // In production, this would validate against the database
      const emailParts = formData.email.toLowerCase();
      let detectedRole: UserRole = "client";
      
      if (emailParts.includes("provider") || emailParts.includes("service")) {
        detectedRole = "provider";
      } else if (emailParts.includes("seller") || emailParts.includes("shop")) {
        detectedRole = "seller";
      } else if (emailParts.includes("admin")) {
        detectedRole = "admin";
      }

      // Check if selected role matches email pattern (for demo purposes)
      if (selectedRole !== detectedRole && selectedRole !== "client") {
        toast.error(`Email doesn't match selected role. Try an email with "${selectedRole}" in it.`);
        setIsLoading(false);
        return;
      }

      await signIn(formData.email, formData.password);
      
      toast.success(`Successfully signed in as ${selectedRole}!`);
      
      // Navigate based on role with proper redirect
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
      }, 100);
    } catch (error) {
      toast.error("Failed to sign in. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold dark:text-white">Choose Your Role</h2>
          <p className="text-muted-foreground dark:text-gray-400 mt-2">
            Select how you'll be using Servie
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roleOptions.map((role) => (
            <Card 
              key={role.value}
              className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-servie dark:bg-gray-800 dark:border-gray-700 dark:hover:border-servie"
              onClick={() => setSelectedRole(role.value)}
            >
              <CardHeader className="text-center">
                <div className={`w-12 h-12 ${role.color} text-white rounded-full flex items-center justify-center mx-auto mb-2`}>
                  {role.icon}
                </div>
                <CardTitle className="text-lg dark:text-white">{role.label}</CardTitle>
                <CardDescription className="dark:text-gray-400">{role.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const selectedRoleOption = roleOptions.find(r => r.value === selectedRole);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className={`w-16 h-16 ${selectedRoleOption?.color} text-white rounded-full flex items-center justify-center mx-auto mb-4`}>
          {selectedRoleOption?.icon}
        </div>
        <h2 className="text-2xl font-bold dark:text-white">Sign In</h2>
        <p className="text-muted-foreground dark:text-gray-400">
          {selectedRoleOption?.label} - {selectedRoleOption?.description}
        </p>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSelectedRole(null)}
          className="mt-2 dark:text-gray-400 dark:hover:text-white"
        >
          Change Role
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <Label htmlFor="password" className="dark:text-white">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={formData.password}
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
              Signing in...
            </>
          ) : (
            `Sign in as ${selectedRoleOption?.label}`
          )}
        </Button>
        
        <div className="text-sm text-center text-gray-500 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          <p className="font-medium">Demo Instructions:</p>
          <p>Use any password. Include your role in the email:</p>
          <ul className="mt-2 space-y-1">
            <li>• Provider: user.provider@example.com</li>
            <li>• Seller: user.seller@example.com</li>
            <li>• Admin: user.admin@example.com</li>
            <li>• Client: any other email</li>
          </ul>
        </div>
      </form>
    </div>
  );
}

export default RoleBasedSignIn;
