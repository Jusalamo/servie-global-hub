
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
    <div className="bg-background border-b border-border">
      <div className="container mx-auto py-2 px-3 sm:px-4">
        <nav className="flex items-center text-xs sm:text-sm text-muted-foreground overflow-x-auto">
          {allCrumbs.map((crumb, index) => {
            const isLast = index === allCrumbs.length - 1;
            
            return (
              <div key={crumb.label + index} className="flex items-center flex-shrink-0">
                {index === 0 ? (
                  <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-3 w-3 mx-1 sm:mx-2 flex-shrink-0" />
                )}
                
                {!isLast && crumb.href ? (
                  <Link to={crumb.href} className="hover:text-primary transition-colors whitespace-nowrap truncate max-w-[150px] sm:max-w-none">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={`whitespace-nowrap truncate max-w-[150px] sm:max-w-none ${isLast ? "font-medium text-foreground" : ""}`}>
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
