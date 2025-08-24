import { ReactNode } from "react";
import { ServieBackground } from "@/components/ServieBackground";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ServieLayoutProps {
  children: ReactNode;
  showBackground?: boolean;
}

export const ServieLayout = ({ children, showBackground = false }: ServieLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-roboto">
      {showBackground && <ServieBackground />}
      <Header />
      <main className="flex-1 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};