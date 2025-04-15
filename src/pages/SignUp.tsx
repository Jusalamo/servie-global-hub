import { useState, useEffect } from "react"
import { Link, useLocation, Navigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, CheckCircle } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useAuth } from "@/context/AuthContext"

type UserRole = "client" | "provider"

export default function SignUp() {
  const location = useLocation();
  const { signUp, isAuthenticated } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>("client")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Set default tab based on URL parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab === 'provider') {
      setUserRole('provider');
    }
  }, [location]);

  // Password strength indicators
  const requirements = [
    { text: "At least 8 characters", regex: /.{8,}/ },
    { text: "At least one uppercase letter", regex: /[A-Z]/ },
    { text: "At least one digit", regex: /[0-9]/ },
    { text: "At least one special character", regex: /[^A-Za-z0-9]/ }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    })

    // Clear errors for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else {
      const failedRequirements = requirements.filter(
        req => !req.regex.test(formData.password)
      )
      
      if (failedRequirements.length > 0) {
        newErrors.password = "Password doesn't meet all requirements"
      }
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match"
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        await signUp({
          email: formData.email, 
          password: formData.password, 
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: userRole
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight">
              Join Servie
            </h2>
            <p className="mt-2 text-muted-foreground">
              Create your account to get started
            </p>
          </div>
          
          <Tabs value={userRole} onValueChange={(value) => setUserRole(value as UserRole)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="client">I need services</TabsTrigger>
              <TabsTrigger value="provider">I provide services</TabsTrigger>
            </TabsList>
            
            <TabsContent value="client" className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? "border-destructive" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? "border-destructive" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? "border-destructive" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={errors.password ? "border-destructive pr-10" : "pr-10"}
                      disabled={isSubmitting}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      disabled={isSubmitting}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                  
                  <div className="mt-2 space-y-2">
                    {requirements.map((req, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle 
                          size={16} 
                          className={req.regex.test(formData.password) 
                            ? "text-green-500" 
                            : "text-muted-foreground"} 
                        />
                        <span className={req.regex.test(formData.password) 
                          ? "text-green-500" 
                          : "text-muted-foreground"}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type={showPassword ? "text" : "password"} 
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={errors.confirmPassword ? "border-destructive" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-servie focus:ring-servie"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <Label 
                      htmlFor="agreeToTerms" 
                      className="font-medium text-foreground"
                    >
                      I agree to the{" "}
                      <a href="#" className="text-servie hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-servie hover:underline">
                        Privacy Policy
                      </a>
                    </Label>
                    {errors.agreeToTerms && (
                      <p className="text-sm text-destructive">{errors.agreeToTerms}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Button 
                    type="submit" 
                    className="w-full bg-servie hover:bg-servie-600 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing up..." : "Sign up"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="provider" className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? "border-destructive" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? "border-destructive" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? "border-destructive" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={errors.password ? "border-destructive pr-10" : "pr-10"}
                      disabled={isSubmitting}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      disabled={isSubmitting}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                  
                  <div className="mt-2 space-y-2">
                    {requirements.map((req, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle 
                          size={16} 
                          className={req.regex.test(formData.password) 
                            ? "text-green-500" 
                            : "text-muted-foreground"} 
                        />
                        <span className={req.regex.test(formData.password) 
                          ? "text-green-500" 
                          : "text-muted-foreground"}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type={showPassword ? "text" : "password"} 
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={errors.confirmPassword ? "border-destructive" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-servie focus:ring-servie"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <Label 
                      htmlFor="agreeToTerms" 
                      className="font-medium text-foreground"
                    >
                      I agree to the{" "}
                      <a href="#" className="text-servie hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-servie hover:underline">
                        Privacy Policy
                      </a>
                    </Label>
                    {errors.agreeToTerms && (
                      <p className="text-sm text-destructive">{errors.agreeToTerms}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Button 
                    type="submit" 
                    className="w-full bg-servie hover:bg-servie-600 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing up..." : "Sign up as a Provider"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                disabled={isSubmitting}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.522 0-10 4.478-10 10s4.478 10 10 10c5.523 0 10-4.478 10-10 0-0.617-0.056-1.225-0.166-1.817h-9.834z"></path>
                </svg>
                Google
              </button>
              
              <button
                type="button"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                disabled={isSubmitting}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.641c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z"></path>
                </svg>
                Facebook
              </button>
            </div>
          </div>
          
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="font-medium text-servie hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
