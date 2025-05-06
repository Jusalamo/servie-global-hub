
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbProps {
  additionalCrumbs?: BreadcrumbItem[];
}

const Breadcrumb = ({ additionalCrumbs = [] }: BreadcrumbProps) => {
  const allCrumbs = [
    { label: "Home", href: "/" },
    ...additionalCrumbs
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto py-2 px-4">
        <nav className="flex items-center text-sm text-muted-foreground">
          {allCrumbs.map((crumb, index) => {
            const isLast = index === allCrumbs.length - 1;
            
            return (
              <div key={crumb.label + index} className="flex items-center">
                {index === 0 ? (
                  <Home className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronRight className="h-3 w-3 mx-2 flex-shrink-0" />
                )}
                
                {!isLast && crumb.href ? (
                  <Link to={crumb.href} className="hover:text-servie transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={isLast ? "font-medium text-foreground" : ""}>
                    {crumb.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;
