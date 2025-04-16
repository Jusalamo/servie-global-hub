
import React, { forwardRef } from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export const AppleIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, className = '', ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`lucide lucide-apple ${className}`}
        ref={ref}
        {...props}
      >
        <path d="M12 20.94c1.5 0 2.75-.65 3.71-1.9a9.1 9.1 0 0 0 2.29-6.04c0-1.8-.67-3.29-2-4.42-1.33-1.13-2.67-1.58-4-1.58-1.16 0-2.28.42-3.37 1.25-.55-.96-1.15-1.7-1.8-2.21-.65-.51-1.49-.77-2.53-.77h-.05v1.5h.05c.7 0 1.31.19 1.84.58.53.39 1.01 1.05 1.44 2-.7.65-1.28 1.44-1.72 2.36-.44.92-.66 1.9-.66 2.94 0 1.71.7 3.37 2.11 4.97 1.41 1.6 2.83 2.32 4.27 2.32Z" />
        <path d="M9.5 13.5v-3" />
        <path d="M12.5 13.5v-3" />
      </svg>
    );
  }
);

AppleIcon.displayName = 'AppleIcon';
