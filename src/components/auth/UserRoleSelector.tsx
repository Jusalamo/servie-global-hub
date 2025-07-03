
import React from "react";
import { Briefcase, ShoppingBag, User, Shield } from "lucide-react";
import { useTheme } from "../ui/ThemeProvider";

interface UserRoleSelectorProps {
  selectedRole: string;
  onChange: (role: "client" | "provider" | "seller" | "admin") => void;
}

const UserRoleSelector: React.FC<UserRoleSelectorProps> = ({ selectedRole, onChange }) => {
  const { theme } = useTheme();
  
  const roles = [
    {
      value: "client" as const,
      label: "Client",
      title: "I'm a Client",
      description: "Find services, hire professionals, and purchase products",
      icon: User,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-50 dark:hover:bg-blue-900/20"
    },
    {
      value: "provider" as const,
      label: "Service Provider",
      title: "I'm a Service Provider", 
      description: "Offer your professional services and grow your business",
      icon: Briefcase,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-50 dark:hover:bg-green-900/20"
    },
    {
      value: "seller" as const,
      label: "Seller",
      title: "I'm a Seller",
      description: "List and sell products in our marketplace",
      icon: ShoppingBag,
      color: "bg-purple-500", 
      hoverColor: "hover:bg-purple-50 dark:hover:bg-purple-900/20"
    },
    {
      value: "admin" as const,
      label: "Admin",
      title: "I'm an Admin",
      description: "Manage platform operations and oversee all activities",
      icon: Shield,
      color: "bg-red-500",
      hoverColor: "hover:bg-red-50 dark:hover:bg-red-900/20"
    }
  ];
  
  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {roles.map((role) => {
        const IconComponent = role.icon;
        return (
          <div 
            key={role.value}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all card-hover ${
              selectedRole === role.value 
                ? 'border-servie bg-servie/10' 
                : `border-border ${role.hoverColor} hover:border-servie/50`
            }`}
            onClick={() => onChange(role.value)}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                selectedRole === role.value ? 'bg-servie text-white' : `${role.color} text-white`
              }`}>
                <IconComponent size={28} />
              </div>
              <h3 className="font-medium text-lg">{role.title}</h3>
              <p className="text-muted-foreground text-sm">
                {role.description}
              </p>
              
              {selectedRole === role.value && (
                <div className="text-servie animate-fade-in font-medium">✓ Selected</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserRoleSelector;
