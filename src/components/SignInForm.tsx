
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export function SignInForm() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

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
      // In a real implementation, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call signIn with email and password
      await signIn(formData.email, formData.password);
      
      toast.success("Successfully signed in!");
      
      // Navigate to dashboard based on user role
      if (formData.email.includes('provider')) {
        navigate('/dashboard/provider');
      } else if (formData.email.includes('seller')) {
        navigate('/dashboard/seller');
      } else {
        navigate('/dashboard/client');
      }
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
        {isLoading ? "Signing in..." : "Sign in"}
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
