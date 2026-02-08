
import { Link, Navigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"
import SignInForm from "@/components/SignInForm"
import UserRoleSelector from "@/components/auth/UserRoleSelector"
import { useState } from "react"

type UserRole = "client" | "provider" | "seller"

export default function SignIn() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const [selectedRole, setSelectedRole] = useState<UserRole>("client");
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <main className="flex-1 flex items-center justify-center py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-4 sm:space-y-8">
        <div className="text-center">
          <h2 className="mt-2 text-2xl sm:mt-6 sm:text-3xl font-bold tracking-tight whitespace-normal break-words">
            Welcome back
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground whitespace-normal">
            Sign in to access your account
          </p>
        </div>
        
        {/* Role Selection Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 bg-muted/50 p-3 sm:p-4 rounded-lg">
          <span className="text-xs sm:text-sm font-medium whitespace-normal break-words max-w-full">Account Type: {selectedRole}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowRoleSelector(!showRoleSelector)}
            className="whitespace-normal min-w-fit"
          >
            Change Role
          </Button>
        </div>

        {/* Role Selector */}
        {showRoleSelector && (
          <div className="animate-fade-in">
            <UserRoleSelector 
              selectedRole={selectedRole} 
              onChange={(role) => {
                setSelectedRole(role);
                setShowRoleSelector(false);
              }}
            />
          </div>
        )}
        
        <SignInForm />
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 bg-background text-muted-foreground whitespace-normal">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center items-center px-2 py-2 sm:px-4 border border-gray-300 shadow-sm text-xs sm:text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 whitespace-normal break-words"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.522 0-10 4.478-10 10s4.478 10 10 10c5.523 0 10-4.478 10-10 0-0.617-0.056-1.225-0.166-1.817h-9.834z"></path>
              </svg>
              <span className="truncate">Google</span>
            </button>
            
            <button
              type="button"
              className="w-full inline-flex justify-center items-center px-2 py-2 sm:px-4 border border-gray-300 shadow-sm text-xs sm:text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 whitespace-normal break-words"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.641c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z"></path>
            </svg>
            <span className="truncate">Facebook</span>
          </button>
        </div>
      </div>
      
      <p className="mt-4 sm:mt-8 text-center text-xs sm:text-sm text-muted-foreground whitespace-normal">
        Don't have an account yet?{" "}
        <Link to="/sign-up" className="font-medium text-servie hover:underline whitespace-nowrap">
          Sign up
        </Link>
      </p>
    </div>
  </main>
  )
}
