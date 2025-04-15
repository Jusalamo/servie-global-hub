
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb as BreadcrumbUI,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from 'lucide-react';

interface BreadcrumbProps {
  additionalCrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

interface RouteMap {
  [key: string]: { label: string; parent?: string };
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ additionalCrumbs = [] }) => {
  const location = useLocation();
  
  // Define route mapping for breadcrumbs
  const routeMap: RouteMap = {
    '': { label: 'Home' },
    'categories': { label: 'Categories', parent: '' },
    'services': { label: 'Services', parent: 'categories' },
    'shop': { label: 'Shop', parent: '' },
    'cart': { label: 'Cart', parent: 'shop' },
    'dashboard': { label: 'Dashboard', parent: '' },
    'profile': { label: 'Profile', parent: '' },
    'signin': { label: 'Sign In', parent: '' },
    'signup': { label: 'Sign Up', parent: '' },
    'become-provider': { label: 'Become a Provider', parent: '' },
    'become-seller': { label: 'Become a Seller', parent: '' },
    'contact': { label: 'Contact', parent: '' },
  };
  
  // Split the path and remove empty strings
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // If there are no segments, we're on the home page
  if (pathSegments.length === 0) {
    return null; // Don't show breadcrumbs on the home page
  }
  
  // Build breadcrumb chain
  const breadcrumbs = [];
  let currentPath = '';
  
  // Always add Home
  breadcrumbs.push({
    label: 'Home',
    path: '/',
    isLast: false
  });
  
  // Add path segments
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    currentPath += `/${segment}`;
    
    // Use the route map if available, otherwise capitalize the segment
    const isLast = i === pathSegments.length - 1 && additionalCrumbs.length === 0;
    const segmentInfo = routeMap[segment] || { 
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    };
    
    breadcrumbs.push({
      label: segmentInfo.label,
      path: currentPath,
      isLast
    });
  }
  
  // Add additional custom breadcrumbs
  if (additionalCrumbs.length > 0) {
    additionalCrumbs.forEach((crumb, index) => {
      breadcrumbs.push({
        label: crumb.label,
        path: crumb.href || '#',
        isLast: index === additionalCrumbs.length - 1
      });
    });
  }
  
  return (
    <BreadcrumbUI className="px-4 py-2 md:px-6 lg:px-8">
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={crumb.path}>
                    {index === 0 ? (
                      <div className="flex items-center">
                        <Home className="w-4 h-4 mr-1" />
                        <span>{crumb.label}</span>
                      </div>
                    ) : (
                      crumb.label
                    )}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbUI>
  );
};

export default Breadcrumb;
