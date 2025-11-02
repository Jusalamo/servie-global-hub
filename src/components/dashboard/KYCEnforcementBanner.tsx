import { AlertCircle, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const KYCEnforcementBanner = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  // Don't show banner if KYC is verified and 2FA is enabled
  if (profile?.kyc_status === 'verified' && profile?.two_fa_enabled) {
    return null;
  }
  
  const isKYCPending = profile?.kyc_status !== 'verified';
  const is2FAPending = !profile?.two_fa_enabled;
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        <Shield className="h-5 w-5" />
        Verification Required
      </AlertTitle>
      <AlertDescription className="space-y-3">
        <p>
          To ensure platform security and trust, all sellers must complete the following before listing products:
        </p>
        <ul className="list-disc list-inside space-y-1">
          {isKYCPending && (
            <li>
              <strong>KYC Verification:</strong> Submit your identity documentation for verification
            </li>
          )}
          {is2FAPending && (
            <li>
              <strong>Two-Factor Authentication (2FA):</strong> Enable 2FA to secure your account
            </li>
          )}
        </ul>
        <div className="flex gap-2 mt-4">
          <Button 
            size="sm" 
            onClick={() => {
              const tab = isKYCPending ? 'security' : 'settings';
              navigate(`/dashboard/seller?tab=${tab}`);
            }}
            className="bg-servie hover:bg-servie-600"
          >
            Complete Verification Now
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
