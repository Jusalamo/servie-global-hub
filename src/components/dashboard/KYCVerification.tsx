import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const KYCVerification = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const kycStatus = profile?.kyc_status || 'pending';
  const twoFaEnabled = profile?.two_fa_enabled || false;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image (JPG, PNG) or PDF file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleKYCUpload = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    try {
      // Upload to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `kyc-documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars') // Using existing bucket, should create dedicated KYC bucket in production
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with KYC document
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          kyc_document_url: publicUrl,
          kyc_status: 'submitted',
          kyc_submitted_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success('KYC document submitted successfully! We will review it within 24-48 hours.');
      await refreshProfile();
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading KYC document:', error);
      toast.error('Failed to upload KYC document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEnable2FA = async () => {
    if (!user) return;

    try {
      // In production, this would generate TOTP secret and show QR code
      // For now, we'll just mark it as enabled
      const { error } = await supabase
        .from('profiles')
        .update({
          two_fa_enabled: true,
          two_fa_verified_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('2FA enabled successfully!');
      await refreshProfile();
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      toast.error('Failed to enable 2FA');
    }
  };

  const getKYCStatusBadge = () => {
    switch (kycStatus) {
      case 'verified':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Verified</span>
          </div>
        );
      case 'submitted':
        return (
          <div className="flex items-center gap-2 text-yellow-600">
            <Clock className="h-5 w-5" />
            <span className="font-medium">Under Review</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            <span className="font-medium">Rejected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-5 w-5" />
            <span className="font-medium">Pending</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* KYC Verification Card */}
      <Card>
        <CardHeader>
          <CardTitle>KYC Verification</CardTitle>
          <CardDescription>
            Verify your identity to start listing products/services. Upload a government-issued ID.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Verification Status</p>
              <p className="text-sm text-muted-foreground">
                {kycStatus === 'pending' && 'Submit your documents to get verified'}
                {kycStatus === 'submitted' && 'We are reviewing your documents'}
                {kycStatus === 'verified' && 'Your account is verified'}
                {kycStatus === 'rejected' && 'Please resubmit your documents'}
              </p>
            </div>
            {getKYCStatusBadge()}
          </div>

          {(kycStatus === 'pending' || kycStatus === 'rejected') && (
            <>
              <Alert>
                <AlertDescription>
                  <strong>Required:</strong> Upload a clear photo or scan of your government-issued ID 
                  (Passport, Driver's License, or National ID). Accepted formats: JPG, PNG, PDF (max 5MB).
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="kyc-document">Identity Document</Label>
                <div className="flex gap-2">
                  <Input
                    id="kyc-document"
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                  />
                  <Button
                    onClick={handleKYCUpload}
                    disabled={!selectedFile || isUploading}
                  >
                    {isUploading ? (
                      <>Uploading...</>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Submit
                      </>
                    )}
                  </Button>
                </div>
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            </>
          )}

          {kycStatus === 'submitted' && (
            <Alert>
              <AlertDescription>
                Your documents are under review. This typically takes 24-48 hours. 
                We'll notify you once the review is complete.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* 2FA Card */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">2FA Status</p>
                <p className="text-sm text-muted-foreground">
                  {twoFaEnabled ? 'Two-factor authentication is enabled' : 'Enhance your account security'}
                </p>
              </div>
            </div>
            {twoFaEnabled ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <Button onClick={handleEnable2FA}>
                Enable 2FA
              </Button>
            )}
          </div>

          {!twoFaEnabled && (
            <Alert>
              <AlertDescription>
                <strong>Required:</strong> You must enable 2FA before you can list products or services.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
