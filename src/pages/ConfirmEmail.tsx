import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfirmEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription className="text-base">
            We've sent you an email with a confirmation link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              To complete your registration and activate your account, please:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the confirmation link in the email</li>
              <li>You'll be redirected to sign in</li>
            </ol>
            <p className="text-xs pt-2">
              The confirmation link will expire in 24 hours. If you don't receive 
              the email within a few minutes, please check your spam folder or 
              contact support.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button asChild className="w-full" variant="outline">
              <Link to="/signin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </Button>
            
            <p className="text-center text-xs text-muted-foreground">
              Didn't receive the email?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Try signing up again
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
