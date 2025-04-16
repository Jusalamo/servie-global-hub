
import { LucideIcon } from 'lucide-react';

// Apple Pay Icon component
export const AppleIcon: LucideIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 7c-3 0-5 2-5 5s2 5 5 5c1 0 2-.5 3-1" />
      <path d="M9 7c-3 0-5 2-5 5" />
      <path d="M14.5 6.5c1-1 2.5-1 3.5-1s2.5 0 3.5 1c.5 .5 1.5 2 1.5 4 0 3-2 5-3 6-.5 .5-1.5 2-2 2.5-.5-.5-1.5-2-2-2.5-1-1-3-3-3-6 0-2 1-3.5 1.5-4z" />
    </svg>
  );
};

export default AppleIcon;
