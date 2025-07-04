
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DashboardBreadcrumbProps {
  items: BreadcrumbItem[];
  userRole: string;
}

const DashboardBreadcrumb = ({ items, userRole }: DashboardBreadcrumbProps) => {
  const getDashboardPath = () => {
    switch (userRole) {
      case 'admin':
        return '/dashboard/admin';
      case 'provider':
        return '/dashboard/provider';
      case 'seller':
        return '/dashboard/seller';
      default:
        return '/dashboard/client';
    }
  };

  return (
    <nav className="bg-gray-50 py-3 px-4 border-b">
      <div className="container mx-auto">
        <div className="flex items-center space-x-2 text-sm">
          <Link 
            to="/" 
            className="text-muted-foreground hover:text-servie flex items-center"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link 
            to={getDashboardPath()} 
            className="text-muted-foreground hover:text-servie"
          >
            Dashboard
          </Link>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              {item.href ? (
                <Link to={item.href} className="text-muted-foreground hover:text-servie">
                  {item.label}
                </Link>
              ) : (
                <span className="text-servie font-medium">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default DashboardBreadcrumb;
