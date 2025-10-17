import { ReactNode } from "react";
import AIAssistant from "@/components/dashboard/AIAssistant";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export default function DashboardLayout({ children, sidebar }: DashboardLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] min-h-screen w-full">
      {sidebar}
      <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {children}
        </div>
      </div>
      <AIAssistant />
    </div>
  );
}
