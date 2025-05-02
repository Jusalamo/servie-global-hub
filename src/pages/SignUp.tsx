
import { useState, useEffect } from "react"
import { Link, useLocation, Navigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useAuth } from "@/context/AuthContext"
import UserRoleSelector from "@/components/auth/UserRoleSelector"
import SignUpForm from "@/components/SignUpForm"

type UserRole = "client" | "provider" | "seller"

export default function SignUp() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>("client")
  const [currentStep, setCurrentStep] = useState(1);
  const [formProgress, setFormProgress] = useState(0);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Set default role based on URL parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const role = searchParams.get('role');
    if (role === 'provider' || role === 'seller') {
      setUserRole(role as UserRole);
    }
  }, [location]);

  // Update form progress
  useEffect(() => {
    let progress = 0;
    
    if (currentStep === 1) {
      if (userRole) progress += 100;
    } else {
      progress = 100; // When on step 2, show full progress
    }
    
    setFormProgress(Math.min(100, Math.floor(progress)));
  }, [currentStep, userRole]);

  const handleNextStep = () => {
    if (userRole) {
      setCurrentStep(2);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight">
              Join Servie
            </h2>
            <p className="mt-2 text-muted-foreground">
              Create your account to get started
            </p>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-2 dark:bg-gray-700">
            <div 
              className="bg-servie h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${formProgress}%` }}
            ></div>
          </div>
          
          {/* Step indicator */}
          <div className="flex justify-between">
            <div className="text-sm">
              <span 
                className={`font-medium ${currentStep === 1 ? "text-servie" : "text-muted-foreground"}`}
              >
                Step 1: Choose Role
              </span>
            </div>
            <div className="text-sm">
              <span 
                className={`font-medium ${currentStep === 2 ? "text-servie" : "text-muted-foreground"}`}
              >
                Step 2: Account Details
              </span>
            </div>
          </div>
          
          {currentStep === 1 ? (
            <div className="animate-fade-in">
              <h3 className="text-xl font-medium text-center mb-4">Select your account type</h3>
              <UserRoleSelector 
                selectedRole={userRole} 
                onChange={role => setUserRole(role)}
              />
              
              <div className="flex justify-end mt-6">
                <Button 
                  className="bg-servie hover:bg-servie-600 text-white"
                  onClick={handleNextStep}
                >
                  Continue
                </Button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <SignUpForm selectedRole={userRole} />
            </div>
          )}
          
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
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.522 0-10 4.478-10 10s4.478 10 10 10c5.523 0 10-4.478 10-10 0-0.617-0.056-1.225-0.166-1.817h-9.834z"></path>
                </svg>
                Google
              </button>
              
              <button
                type="button"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
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
