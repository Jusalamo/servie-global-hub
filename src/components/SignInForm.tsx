
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function SignInForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, userRole } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call signIn with email and password
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        toast.error(error.message || "Failed to sign in. Please check your credentials.");
        return;
      }
      
      toast.success("Successfully signed in!");
      
      // Navigate to dashboard or the page user was trying to access
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Failed to sign in. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Button variant="link" className="p-0" asChild>
            <a href="/forgot-password">Forgot password?</a>
          </Button>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={formData.password}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="rememberMe" 
          name="rememberMe"
          checked={formData.rememberMe}
          onCheckedChange={(checked) => 
            setFormData({...formData, rememberMe: checked === true})
          }
        />
        <Label htmlFor="rememberMe">Remember me</Label>
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
          "Sign in"
        )}
      </Button>
      
      <div className="text-sm text-center text-gray-500">
        <p>
          For testing, use any email. Add "provider" or "seller" to the email 
          to access those dashboards (e.g., user.provider@example.com)
        </p>
      </div>
    </form>
  );
}

export default SignInForm;
