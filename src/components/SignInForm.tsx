import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SignInForm() {
  const { signIn } = useAuth();
  const { t } = useTranslation();
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
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        // Handle email not confirmed error
        if (error.message?.includes('Email not confirmed')) {
          toast.error('Please confirm your email address before signing in. Check your inbox for the confirmation link.');
        } else {
          toast.error(error.message || "Invalid email or password. Please try again.");
        }
        return;
      }
      
      toast.success("Successfully signed in!");
      // Success will be handled by AuthContext and navigation will happen automatically
      // via the auth state change in useAuthRedirect hook
    } catch (error) {
      toast.error("An error occurred during sign in. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">{t('email_label', 'Email')}</Label>
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
          <Label htmlFor="password">{t('password_label', 'Password')}</Label>
          <Button variant="link" className="p-0" asChild>
            <a href="/forgot-password">{t('forgot_password', 'Forgot password?')}</a>
          </Button>
        </div>
        <PasswordInput
          id="password"
          name="password"
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
        <Label htmlFor="rememberMe">{t('remember_me', 'Remember me')}</Label>
      </div>
      <Button
        type="submit"
        className="w-full bg-servie hover:bg-servie-600"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('signing_in', 'Signing in...')}
          </>
        ) : (
          t('signIn', 'Sign in')
        )}
      </Button>
      
    </form>
  );
}

export default SignInForm;