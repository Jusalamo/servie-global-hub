
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
import { Home, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BreadcrumbProps {
  additionalCrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  items?: Array<{
    label: string;
    href: string;
  }>;
}

interface RouteMap {
  [key: string]: { label: string; parent?: string };
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ additionalCrumbs = [], items }) => {
  const location = useLocation();
  const { t } = useTranslation();
  
  // If items are directly provided, use those instead of building from the route
  if (items && items.length > 0) {
    return (
      <BreadcrumbUI className="px-4 py-3 md:px-6 lg:px-8 bg-gray-50 border-b border-gray-100 dark:bg-gray-800 dark:border-gray-700 overflow-x-auto whitespace-nowrap">
        <BreadcrumbList className="flex-nowrap">
          {items.map((crumb, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem className="flex items-center">
                {index === items.length - 1 ? (
                  <BreadcrumbPage className="font-medium">{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.href} className="flex items-center hover:text-servie transition-colors">
                      {index === 0 ? (
                        <div className="flex items-center">
                          <Home className="w-4 h-4 mr-1" />
                          <span className="hidden md:inline">{crumb.label}</span>
                        </div>
                      ) : (
                        crumb.label
                      )}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < items.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </BreadcrumbUI>
    );
  }
  
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
    'contact-support': { label: 'Support', parent: '' },
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
    label: t('Home'),
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
      label: t(segmentInfo.label),
      path: currentPath,
      isLast
    });
  }
  
  // Add additional custom breadcrumbs
  if (additionalCrumbs.length > 0) {
    additionalCrumbs.forEach((crumb, index) => {
      breadcrumbs.push({
        label: t(crumb.label),
        path: crumb.href || '#',
        isLast: index === additionalCrumbs.length - 1
      });
    });
  }
  
  return (
    <BreadcrumbUI className="px-4 py-3 md:px-6 lg:px-8 bg-gray-50 border-b border-gray-100 dark:bg-gray-800 dark:border-gray-700 overflow-x-auto whitespace-nowrap">
      <BreadcrumbList className="flex-nowrap">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem className="flex items-center">
              {crumb.isLast ? (
                <BreadcrumbPage className="font-medium">{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={crumb.path} className="flex items-center hover:text-servie transition-colors">
                    {index === 0 ? (
                      <div className="flex items-center">
                        <Home className="w-4 h-4 mr-1" />
                        <span className="hidden md:inline">{crumb.label}</span>
                      </div>
                    ) : (
                      crumb.label
                    )}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbUI>
  );
};

export default Breadcrumb;
