
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, HelpCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center p-8 max-w-md">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-purple-500 animate-pulse">404</h1>
            <div className="h-2 bg-gradient-to-r from-purple-500 to-servie rounded-full my-6"></div>
          </div>
          
          <h2 className="text-2xl font-semibold mb-4">Page not found</h2>
          <p className="text-muted-foreground mb-8">
            We're sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/contact-support" className="flex items-center">
                <HelpCircle className="mr-2 h-4 w-4" />
                Contact Support
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="#" onClick={() => window.history.back()} className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 text-sm text-muted-foreground">
            <p>Need help finding something? Try searching or browsing our categories.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
