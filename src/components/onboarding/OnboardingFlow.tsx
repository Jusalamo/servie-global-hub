import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, ChevronRight, Upload, User, Briefcase, Store, MapPin, Phone, Camera } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OnboardingFlowProps {
  onComplete: () => void;
  userRole: string;
}

export const OnboardingFlow = ({ onComplete, userRole }: OnboardingFlowProps) => {
  const { user, profile, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    city: profile?.city || '',
    country: profile?.country || '',
    business_name: profile?.business_name || '',
    avatar_url: profile?.avatar_url || '',
  });

  const totalSteps = userRole === 'client' ? 3 : 4;
  const progress = (step / totalSteps) * 100;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user.id}-${Date.now()}.${fileExt}`;
      
      const { error } = await supabase.storage.from('avatars').upload(filePath, file);
      if (error) throw error;
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      handleInputChange('avatar_url', data.publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          bio: formData.bio,
          city: formData.city,
          country: formData.country,
          business_name: formData.business_name,
          avatar_url: formData.avatar_url,
        })
        .eq('id', user.id);

      if (error) throw error;
      
      await refreshProfile();
      toast.success('Profile updated successfully');
      setStep(prev => prev + 1);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Welcome to Servie! 🎉</h2>
              <p className="text-muted-foreground mt-2">Let's complete your profile to get started</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-servie/20">
                  <AvatarImage src={imagePreview || formData.avatar_url} />
                  <AvatarFallback className="text-xl bg-servie/10">
                    {formData.first_name?.[0] || <User />}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 bg-servie text-white p-2 rounded-full cursor-pointer hover:bg-servie-600 transition-colors">
                  <Camera className="h-4 w-4" />
                  <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} />
                </label>
              </div>
              <p className="text-sm text-muted-foreground">Upload a profile picture</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> Phone Number
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 234 567 8900"
              />
            </div>

            <Button
              className="w-full bg-servie hover:bg-servie-600"
              onClick={() => setStep(2)}
              disabled={!formData.first_name || !formData.last_name}
            >
              Continue <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Where are you located?</h2>
              <p className="text-muted-foreground mt-2">Help us connect you with local services</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> City
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Lagos"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Nigeria"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Tell us about yourself</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="A brief introduction..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                className="flex-1 bg-servie hover:bg-servie-600"
                onClick={() => userRole === 'client' ? handleSaveProfile() : setStep(3)}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Continue'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        );

      case 3:
        if (userRole === 'client') {
          return <SiteTour onComplete={onComplete} userRole={userRole} />;
        }
        
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">
                {userRole === 'seller' ? 'Setup Your Shop' : 'Business Details'}
              </h2>
              <p className="text-muted-foreground mt-2">
                {userRole === 'seller' 
                  ? 'Configure your online store'
                  : 'Tell clients about your services'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business_name" className="flex items-center gap-2">
                  {userRole === 'seller' ? <Store className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
                  {userRole === 'seller' ? 'Shop Name' : 'Business Name'}
                </Label>
                <Input
                  id="business_name"
                  value={formData.business_name}
                  onChange={(e) => handleInputChange('business_name', e.target.value)}
                  placeholder={userRole === 'seller' ? 'My Amazing Shop' : 'ABC Services'}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button
                className="flex-1 bg-servie hover:bg-servie-600"
                onClick={handleSaveProfile}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Continue'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        );

      case 4:
        return <SiteTour onComplete={onComplete} userRole={userRole} />;

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Complete Your Profile</CardTitle>
            <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

interface SiteTourProps {
  onComplete: () => void;
  userRole: string;
}

const SiteTour = ({ onComplete, userRole }: SiteTourProps) => {
  const [tourStep, setTourStep] = useState(0);

  const tourSteps = [
    {
      title: 'Welcome to Servie! 🎉',
      description: 'Your all-in-one marketplace for services and products in Africa.',
      icon: '🏠',
    },
    {
      title: 'Browse Services',
      description: 'Find professional services from verified providers - from home cleaning to tech support.',
      icon: '🔍',
    },
    {
      title: 'Shop Products',
      description: 'Explore unique products from local sellers with secure checkout.',
      icon: '🛒',
    },
    {
      title: 'Your Dashboard',
      description: userRole === 'client' 
        ? 'Track your bookings, manage favorites, and view order history.'
        : userRole === 'seller'
        ? 'Manage products, process orders, and track your earnings.'
        : 'Manage services, handle bookings, and grow your business.',
      icon: '📊',
    },
    {
      title: "You're All Set!",
      description: 'Start exploring and make the most of Servie. Happy browsing!',
      icon: '✨',
    },
  ];

  const currentTourStep = tourSteps[tourStep];
  const isLastStep = tourStep === tourSteps.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 text-center"
    >
      <div className="text-6xl mb-4">{currentTourStep.icon}</div>
      <h2 className="text-2xl font-bold">{currentTourStep.title}</h2>
      <p className="text-muted-foreground">{currentTourStep.description}</p>

      <div className="flex justify-center gap-2 py-4">
        {tourSteps.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === tourStep ? 'bg-servie' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      <div className="flex gap-3">
        {tourStep > 0 && (
          <Button variant="outline" onClick={() => setTourStep(prev => prev - 1)} className="flex-1">
            Back
          </Button>
        )}
        <Button
          className={`flex-1 ${isLastStep ? 'bg-servie hover:bg-servie-600' : ''}`}
          variant={isLastStep ? 'default' : 'default'}
          onClick={() => {
            if (isLastStep) {
              onComplete();
            } else {
              setTourStep(prev => prev + 1);
            }
          }}
        >
          {isLastStep ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Get Started
            </>
          ) : (
            <>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default OnboardingFlow;
