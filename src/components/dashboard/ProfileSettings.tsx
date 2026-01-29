
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Upload, Camera, Check, X, Loader2, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { LocalizationSettings } from './LocalizationSettings';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  bio: string;
  profileImage: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  professionalInfo?: {
    title: string;
    company: string;
    experience: string;
    skills: string[];
    certifications: string[];
  };
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacySettings: {
    profileVisibility: 'public' | 'private' | 'contacts';
    showEmail: boolean;
    showPhone: boolean;
  };
}

interface ProfileSettingsProps {
  userRole?: string; // 'provider', 'client', 'seller'
}

const ProfileSettings = ({ userRole = 'client' }: ProfileSettingsProps) => {
  const { user, profile: authProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
    bio: '',
    profileImage: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
    },
    professionalInfo: {
      title: '',
      company: '',
      experience: '',
      skills: [],
      certifications: [],
    },
    notificationPreferences: {
      email: true,
      push: true,
      sms: false,
    },
    privacySettings: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
    },
  });

  // Load user profile data from AuthContext
  useEffect(() => {
    if (authProfile && user) {
      setProfile(prev => ({
        ...prev,
        firstName: authProfile.first_name || '',
        lastName: authProfile.last_name || '',
        email: user.email || '',
        phone: authProfile.phone || '',
        address: {
          street: authProfile.address || '',
          city: authProfile.city || '',
          state: authProfile.state || '',
          zip: authProfile.postal_code || '',
          country: authProfile.country || '',
        },
        bio: authProfile.bio || '',
        profileImage: authProfile.avatar_url || '',
        professionalInfo: {
          title: userRole === 'provider' ? 'Service Provider' : userRole === 'seller' ? 'Product Seller' : 'Client',
          company: authProfile.business_name || '',
          experience: '',
          skills: [],
          certifications: [],
        },
      }));
    }
  }, [authProfile, user, userRole]);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Mock function to handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setNewProfileImage(file);

      toast.success("Image ready to be saved with your profile");
    } catch (error) {
      console.error("Error preparing image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const saveProfile = async () => {
    setSavingProfile(true);

    try {
      // If there's a new profile image, upload it
      if (newProfileImage) {
        try {
          const userId = user?.id || 'anonymous';
          const fileExt = newProfileImage.name.split('.').pop();
          const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;

          const { error } = await supabase.storage
            .from('avatars')
            .upload(filePath, newProfileImage);

          if (error) throw error;
          
          // Get the public URL
          const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
          
          // Update profile with new image URL
          setProfile(prev => ({
            ...prev,
            profileImage: data.publicUrl
          }));
          
          setNewProfileImage(null);
          setImagePreview(null);
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Failed to upload image. Your other profile changes were saved.");
        }
      }

      // Update the user profile in the database
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone: profile.phone || null,
          bio: profile.bio || null,
          avatar_url: profile.profileImage || null,
          address: profile.address.street || null,
          city: profile.address.city || null,
          state: profile.address.state || null,
          postal_code: profile.address.zip || null,
          country: profile.address.country || null,
          whatsapp: profile.phone || null
        })
        .eq('id', user?.id);

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Error updating profile:", error);
    } finally {
      setSavingProfile(false);
    }
  };

  const updateProfileField = (
    field: string, 
    value: any, 
    nestedField: string | null = null, 
    nestedSubField: string | null = null
  ) => {
    setProfile(prev => {
      if (nestedField && nestedSubField) {
        // Handle double nested objects
        const nestedObj = prev[nestedField as keyof UserProfile] as Record<string, any>;
        if (nestedObj) {
          return {
            ...prev,
            [nestedField]: {
              ...nestedObj,
              [nestedSubField]: {
                ...(nestedObj[nestedSubField] as Record<string, any>),
                [field]: value
              }
            }
          };
        }
      } else if (nestedField) {
        // Handle single nested objects
        const nestedObj = prev[nestedField as keyof UserProfile] as Record<string, any>;
        if (nestedObj) {
          return {
            ...prev,
            [nestedField]: {
              ...nestedObj,
              [field]: value
            }
          };
        }
      }
      
      // Default case - direct field update
      return {
        ...prev,
        [field]: value
      };
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 md:grid-cols-5 h-auto">
          <TabsTrigger value="general" className="px-3 py-2 text-xs sm:text-sm">General</TabsTrigger>
          <TabsTrigger value="address" className="px-3 py-2 text-xs sm:text-sm">Address</TabsTrigger>
          <TabsTrigger value="localization" className="px-3 py-2 text-xs sm:text-sm">Language</TabsTrigger>
          <TabsTrigger value="privacy" className="px-3 py-2 text-xs sm:text-sm">Privacy</TabsTrigger>
          {(userRole === 'provider' || userRole === 'seller') && (
            <TabsTrigger value="professional" className="px-3 py-2 text-xs sm:text-sm">Professional</TabsTrigger>
          )}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information and profile picture.</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button 
                        onClick={saveProfile} 
                        className="bg-servie hover:bg-servie-600"
                        disabled={savingProfile}
                      >
                        {savingProfile ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-2 border-border">
                      <AvatarImage 
                        src={imagePreview || profile.profileImage} 
                        alt={`${profile.firstName} ${profile.lastName}`} 
                      />
                      <AvatarFallback className="text-2xl">
                        {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    {isEditing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                        <label htmlFor="profile-image" className="flex flex-col items-center justify-center cursor-pointer w-full h-full rounded-full">
                          {uploadingImage ? (
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                          ) : (
                            <>
                              <Camera className="h-8 w-8 text-white" />
                              <span className="text-xs text-white mt-1">Change</span>
                            </>
                          )}
                          <input 
                            id="profile-image" 
                            type="file" 
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-4 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={profile.firstName}
                          onChange={(e) => updateProfileField('firstName', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={profile.lastName}
                          onChange={(e) => updateProfileField('lastName', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={profile.email}
                          onChange={(e) => updateProfileField('email', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={profile.phone}
                          onChange={(e) => updateProfileField('phone', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />
                
                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => updateProfileField('bio', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                
                <Separator />
                
                {/* Social Links */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sm">Social Media Links</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label 
                        htmlFor="facebook" 
                        className="flex items-center gap-2"
                      >
                        <Facebook className="h-4 w-4" /> Facebook
                      </Label>
                      <Input 
                        id="facebook"
                        value={profile.socialLinks.facebook}
                        onChange={(e) => updateProfileField('facebook', e.target.value, 'socialLinks')}
                        disabled={!isEditing}
                        placeholder="https://facebook.com/username"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label 
                        htmlFor="twitter" 
                        className="flex items-center gap-2"
                      >
                        <Twitter className="h-4 w-4" /> Twitter
                      </Label>
                      <Input 
                        id="twitter"
                        value={profile.socialLinks.twitter}
                        onChange={(e) => updateProfileField('twitter', e.target.value, 'socialLinks')}
                        disabled={!isEditing}
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label 
                        htmlFor="instagram" 
                        className="flex items-center gap-2"
                      >
                        <Instagram className="h-4 w-4" /> Instagram
                      </Label>
                      <Input 
                        id="instagram"
                        value={profile.socialLinks.instagram}
                        onChange={(e) => updateProfileField('instagram', e.target.value, 'socialLinks')}
                        disabled={!isEditing}
                        placeholder="https://instagram.com/username"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label 
                        htmlFor="linkedin" 
                        className="flex items-center gap-2"
                      >
                        <Linkedin className="h-4 w-4" /> LinkedIn
                      </Label>
                      <Input 
                        id="linkedin"
                        value={profile.socialLinks.linkedin}
                        onChange={(e) => updateProfileField('linkedin', e.target.value, 'socialLinks')}
                        disabled={!isEditing}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Localization Tab - Language & Currency */}
          <TabsContent value="localization" className="space-y-6">
            <LocalizationSettings />
          </TabsContent>

          <TabsContent value="address" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Address Information</CardTitle>
                    <CardDescription>Update your address and location details.</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>Edit Address</Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button 
                        onClick={saveProfile} 
                        className="bg-servie hover:bg-servie-600"
                        disabled={savingProfile}
                      >
                        {savingProfile ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input 
                    id="street"
                    value={profile.address.street}
                    onChange={(e) => updateProfileField('street', e.target.value, 'address')}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city"
                      value={profile.address.city}
                      onChange={(e) => updateProfileField('city', e.target.value, 'address')}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input 
                      id="state"
                      value={profile.address.state}
                      onChange={(e) => updateProfileField('state', e.target.value, 'address')}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zip">Postal/ZIP Code</Label>
                    <Input 
                      id="zip"
                      value={profile.address.zip}
                      onChange={(e) => updateProfileField('zip', e.target.value, 'address')}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select 
                      disabled={!isEditing}
                      value={profile.address.country}
                      onValueChange={(value) => updateProfileField('country', value, 'address')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                          <SelectItem value="Nigeria">Nigeria</SelectItem>
                          <SelectItem value="South Africa">South Africa</SelectItem>
                          <SelectItem value="Ghana">Ghana</SelectItem>
                          <SelectItem value="Kenya">Kenya</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>Manage your privacy preferences and notification settings.</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>Edit Settings</Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button 
                        onClick={saveProfile} 
                        className="bg-servie hover:bg-servie-600"
                        disabled={savingProfile}
                      >
                        {savingProfile ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Profile Visibility</h3>
                  <div className="space-y-2">
                    <Label htmlFor="profileVisibility">Who can see your profile?</Label>
                    <Select 
                      disabled={!isEditing}
                      value={profile.privacySettings.profileVisibility}
                      onValueChange={(value: 'public' | 'private' | 'contacts') => 
                        updateProfileField('profileVisibility', value, 'privacySettings')
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Everyone (Public)</SelectItem>
                        <SelectItem value="contacts">Only Contacts</SelectItem>
                        <SelectItem value="private">Only Me (Private)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Contact Information Privacy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="showEmail">Show Email Address</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow others to see your email address on your profile
                        </p>
                      </div>
                      <Switch
                        id="showEmail"
                        checked={profile.privacySettings.showEmail}
                        onCheckedChange={(checked) => 
                          updateProfileField('showEmail', checked, 'privacySettings')
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="showPhone">Show Phone Number</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow others to see your phone number on your profile
                        </p>
                      </div>
                      <Switch
                        id="showPhone"
                        checked={profile.privacySettings.showPhone}
                        onCheckedChange={(checked) => 
                          updateProfileField('showPhone', checked, 'privacySettings')
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates and alerts via email
                        </p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={profile.notificationPreferences.email}
                        onCheckedChange={(checked) => 
                          updateProfileField('email', checked, 'notificationPreferences')
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive real-time push notifications
                        </p>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={profile.notificationPreferences.push}
                        onCheckedChange={(checked) => 
                          updateProfileField('push', checked, 'notificationPreferences')
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="smsNotifications">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive important updates via text message
                        </p>
                      </div>
                      <Switch
                        id="smsNotifications"
                        checked={profile.notificationPreferences.sms}
                        onCheckedChange={(checked) => 
                          updateProfileField('sms', checked, 'notificationPreferences')
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {(userRole === 'provider' || userRole === 'seller') && (
            <TabsContent value="professional" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Professional Information</CardTitle>
                      <CardDescription>Update your professional profile and credentials.</CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)}>Edit Information</Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                        <Button 
                          onClick={saveProfile} 
                          className="bg-servie hover:bg-servie-600"
                          disabled={savingProfile}
                        >
                          {savingProfile ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title</Label>
                      <Input 
                        id="title"
                        value={profile.professionalInfo?.title || ''}
                        onChange={(e) => updateProfileField('title', e.target.value, 'professionalInfo')}
                        disabled={!isEditing}
                        placeholder="e.g. Senior Plumber, Interior Designer"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company">Company/Business Name</Label>
                      <Input 
                        id="company"
                        value={profile.professionalInfo?.company || ''}
                        onChange={(e) => updateProfileField('company', e.target.value, 'professionalInfo')}
                        disabled={!isEditing}
                        placeholder="Your business name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input 
                      id="experience"
                      value={profile.professionalInfo?.experience || ''}
                      onChange={(e) => updateProfileField('experience', e.target.value, 'professionalInfo')}
                      disabled={!isEditing}
                      placeholder="e.g. 5 years"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="skills">Professional Skills</Label>
                    <Textarea 
                      id="skills"
                      value={(profile.professionalInfo?.skills || []).join(', ')}
                      onChange={(e) => updateProfileField(
                        'skills', 
                        e.target.value.split(',').map(skill => skill.trim()).filter(Boolean),
                        'professionalInfo'
                      )}
                      disabled={!isEditing}
                      placeholder="Enter skills separated by commas"
                    />
                    <p className="text-xs text-muted-foreground">Separate each skill with a comma</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="certifications">Certifications & Qualifications</Label>
                    <Textarea 
                      id="certifications"
                      value={(profile.professionalInfo?.certifications || []).join(', ')}
                      onChange={(e) => updateProfileField(
                        'certifications', 
                        e.target.value.split(',').map(cert => cert.trim()).filter(Boolean),
                        'professionalInfo'
                      )}
                      disabled={!isEditing}
                      placeholder="Enter certifications separated by commas"
                    />
                    <p className="text-xs text-muted-foreground">Separate each certification with a comma</p>
                  </div>
                  
                  {/* Upload certificate documents section */}
                  <div className="space-y-3">
                    <Label>Certificate Documents</Label>
                    
                    <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center">
                      <div className="mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="font-medium">Upload Documents</h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                          Drag and drop your certification documents or click to browse files.
                        </p>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        disabled={!isEditing}
                      >
                        Browse Files
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Supported formats: PDF, JPG, PNG (Max 5MB)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default ProfileSettings;
