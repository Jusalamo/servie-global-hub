
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TestAuthBypass = () => {
  const { bypassAuth, isAuthenticated, userRole, signOut } = useAuth();

  if (isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Current User</CardTitle>
          <CardDescription>Logged in as: {userRole}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={signOut} variant="outline" className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Testing Authentication</CardTitle>
        <CardDescription>
          Choose a role to test the dashboard functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={() => bypassAuth('client')} 
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          Test as Client
        </Button>
        <Button 
          onClick={() => bypassAuth('provider')} 
          className="w-full bg-green-500 hover:bg-green-600"
        >
          Test as Provider
        </Button>
        <Button 
          onClick={() => bypassAuth('seller')} 
          className="w-full bg-purple-500 hover:bg-purple-600"
        >
          Test as Seller
        </Button>
      </CardContent>
    </Card>
  );
};

export default TestAuthBypass;
