
import { ChevronRight, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DashboardBreadcrumbProps {
  items: BreadcrumbItem[];
  userRole: "client" | "provider" | "seller";
}

const DashboardBreadcrumb = ({ items, userRole }: DashboardBreadcrumbProps) => {
  const navigate = useNavigate();

  const getDashboardPath = () => {
    switch (userRole) {
      case "provider":
        return "/dashboard/provider?tab=overview";
      case "seller":
        return "/dashboard/seller?tab=overview";
      default:
        return "/dashboard/client";
    }
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleDashboardClick = () => {
    navigate(getDashboardPath());
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground p-4 bg-background border-b">
      <button
        onClick={handleHomeClick}
        className="flex items-center hover:text-servie transition-colors"
      >
        <Home className="h-4 w-4" />
      </button>
      
      <ChevronRight className="h-4 w-4" />
      
      <button
        onClick={handleDashboardClick}
        className="hover:text-servie transition-colors capitalize"
      >
        {userRole} Dashboard
      </button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link 
              to={item.href} 
              className="hover:text-servie transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default DashboardBreadcrumb;
