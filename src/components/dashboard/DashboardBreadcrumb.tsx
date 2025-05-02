
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

type BreadcrumbItem = {
  label: string;
  path?: string;
};

interface DashboardBreadcrumbProps {
  items: BreadcrumbItem[];
  userRole: string;
}

const DashboardBreadcrumb = ({ items, userRole }: DashboardBreadcrumbProps) => {
  const dashboardPath = `/dashboard/${userRole}`;
  
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6 overflow-x-auto pb-1 border-b border-border">
      <Link 
        to={dashboardPath}
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4 mr-1" />
        <span>Dashboard</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/60" />
          {item.path ? (
            <Link 
              to={item.path} 
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default DashboardBreadcrumb;
