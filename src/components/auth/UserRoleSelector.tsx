
import React from "react";
import { Briefcase, ShoppingBag, User } from "lucide-react";
import { useTheme } from "../ui/ThemeProvider";

interface UserRoleSelectorProps {
  selectedRole: string;
  onChange: (role: "client" | "provider" | "seller") => void;
}

const UserRoleSelector: React.FC<UserRoleSelectorProps> = ({ selectedRole, onChange }) => {
  const { theme } = useTheme();
  
  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div 
        className={`p-6 rounded-lg border-2 cursor-pointer transition-all card-hover ${
          selectedRole === 'client' 
            ? 'border-servie bg-servie/10' 
            : 'border-border hover:border-servie/50'
        }`}
        onClick={() => onChange('client')}
      >
        <div className="flex flex-col items-center text-center space-y-3">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            selectedRole === 'client' ? 'bg-servie text-white' : 'bg-muted'
          }`}>
            <User size={28} />
          </div>
          <h3 className="font-medium text-lg">Client</h3>
          <p className="text-muted-foreground text-sm">
            Find services, hire professionals, and purchase products
          </p>
          
          {selectedRole === 'client' && (
            <div className="text-servie animate-fade-in">Selected</div>
          )}
        </div>
      </div>
      
      <div 
        className={`p-6 rounded-lg border-2 cursor-pointer transition-all card-hover ${
          selectedRole === 'provider' 
            ? 'border-servie bg-servie/10' 
            : 'border-border hover:border-servie/50'
        }`}
        onClick={() => onChange('provider')}
      >
        <div className="flex flex-col items-center text-center space-y-3">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            selectedRole === 'provider' ? 'bg-servie text-white' : 'bg-muted'
          }`}>
            <Briefcase size={28} />
          </div>
          <h3 className="font-medium text-lg">Service Provider</h3>
          <p className="text-muted-foreground text-sm">
            Offer your professional services and grow your business
          </p>
          
          {selectedRole === 'provider' && (
            <div className="text-servie animate-fade-in">Selected</div>
          )}
        </div>
      </div>
      
      <div 
        className={`p-6 rounded-lg border-2 cursor-pointer transition-all card-hover ${
          selectedRole === 'seller' 
            ? 'border-servie bg-servie/10' 
            : 'border-border hover:border-servie/50'
        }`}
        onClick={() => onChange('seller')}
      >
        <div className="flex flex-col items-center text-center space-y-3">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            selectedRole === 'seller' ? 'bg-servie text-white' : 'bg-muted'
          }`}>
            <ShoppingBag size={28} />
          </div>
          <h3 className="font-medium text-lg">Seller</h3>
          <p className="text-muted-foreground text-sm">
            List and sell products in our marketplace
          </p>
          
          {selectedRole === 'seller' && (
            <div className="text-servie animate-fade-in">Selected</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRoleSelector;
