
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User, Edit, Save } from "lucide-react";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  avatarUrl: string;
}

export default function ProfileEdit() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    avatarUrl: ""
  });

  useEffect(() => {
    // In a real app, we would fetch the profile data from the API
    // For now, we'll just populate with user data from auth context
    if (user) {
      setProfileData({
        firstName: user.user_metadata?.first_name || "",
        lastName: user.user_metadata?.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: "",
        bio: "",
        avatarUrl: user.user_metadata?.avatar_url || ""
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, we would update the profile in the database
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast.success("Profile updated successfully!");
      // Navigate back to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Cancel
        </Button>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={profileData.avatarUrl} alt="User avatar" />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center">
                <Button type="button" variant="outline" size="sm" className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" />
                  Change Avatar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleChange}
                  disabled
                />
                <p className="text-sm text-muted-foreground">Email cannot be changed</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={profileData.address}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={profileData.bio}
                  onChange={handleChange}
                  placeholder="Tell us a bit about yourself"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-servie hover:bg-servie-600" disabled={isLoading}>
                {isLoading ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="account">
          <div className="space-y-6">
            <div className="p-6 bg-muted rounded-md">
              <h3 className="text-lg font-medium mb-4">Account Security</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                
                <Button className="bg-servie hover:bg-servie-600">Change Password</Button>
              </div>
            </div>
            
            <div className="p-6 bg-muted rounded-md">
              <h3 className="text-lg font-medium mb-4">Delete Account</h3>
              <p className="text-muted-foreground mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preferences">
          <div className="space-y-6">
            <div className="p-6 bg-muted rounded-md">
              <h3 className="text-lg font-medium mb-4">Language & Region</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select 
                    id="language"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="en">English (US)</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="zh">Chinese (Simplified)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select 
                    id="currency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="usd">USD ($)</option>
                    <option value="eur">EUR (€)</option>
                    <option value="gbp">GBP (£)</option>
                    <option value="jpy">JPY (¥)</option>
                    <option value="cad">CAD ($)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-muted rounded-md">
              <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive emails about your account activity</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Marketing Emails</h4>
                    <p className="text-sm text-muted-foreground">Receive emails about new features and offers</p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button className="bg-servie hover:bg-servie-600">Save Preferences</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
