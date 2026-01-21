
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    
    // Clear errors when user types
    if (errors.email) {
      setErrors({});
    }
  }

  const validateForm = () => {
    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return false;
    } 
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Email is invalid" });
      return false;
    }
    
    return true;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here we would typically make an API call to send password reset email
      toast({
        title: "Reset link sent",
        description: "If an account exists with that email, you will receive a password reset link.",
      });
      
      setIsSubmitted(true);
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Reset your password
          </h2>
          <p className="mt-2 text-muted-foreground">
            {!isSubmitted ? 
              "Enter your email and we'll send you a link to reset your password" : 
              "Check your email for the reset link"
            }
          </p>
        </div>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                autoComplete="email"
                value={email}
                onChange={handleInputChange}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            
            <div>
              <Button type="submit" className="w-full bg-servie hover:bg-servie-600 text-white">
                Send reset link
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6 text-center">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm">
                If an account exists with that email address, you will receive a password reset link shortly.
              </p>
              <p className="text-sm mt-2">
                Please also check your spam folder if you don't see the email.
              </p>
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              className="mx-auto mt-4"
              onClick={() => setIsSubmitted(false)}
            >
              Try again
            </Button>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <Link to="/signin" className="inline-flex items-center text-sm font-medium text-servie hover:underline">
            <ArrowLeft size={16} className="mr-1" />
            Back to sign in
          </Link>
        </div>
    </div>
  </main>
  )
}
