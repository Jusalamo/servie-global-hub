
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProfileEdit() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.first_name || "",
    lastName: user?.user_metadata?.last_name || "",
    email: user?.email || "",
    phone: user?.user_metadata?.phone || "",
    address: user?.user_metadata?.address || "",
    city: user?.user_metadata?.city || "",
    state: user?.user_metadata?.state || "",
    zip: user?.user_metadata?.zip || "",
    bio: user?.user_metadata?.bio || "",
    jobTitle: user?.user_metadata?.job_title || "",
    company: user?.user_metadata?.company || "",
    website: user?.user_metadata?.website || "",
    twitter: user?.user_metadata?.twitter || "",
    linkedin: user?.user_metadata?.linkedin || "",
    instagram: user?.user_metadata?.instagram || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  if (!isAuthenticated) {
    navigate("/signin", { replace: true });
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real application, this would be an API call to update the user's profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Your new password and confirmation password don't match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real application, this would be an API call to update the user's password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-10">
        <div className="container max-w-5xl">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-muted mb-4">
                    {user?.user_metadata?.avatar_url ? (
                      <img 
                        src={user.user_metadata.avatar_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-semibold bg-servie text-white">
                        {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm">Change Photo</Button>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">{formData.firstName} {formData.lastName}</h3>
                  <p className="text-muted-foreground text-sm">{formData.email}</p>
                  <p className="text-muted-foreground text-sm">{formData.jobTitle}</p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate("/dashboard")}
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
            
            {/* Main content */}
            <div className="md:w-3/4">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold">Edit Profile</h1>
                  <p className="text-muted-foreground">Update your personal information and account settings</p>
                </div>
                
                <Tabs defaultValue="profile">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="profile" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First Name</Label>
                              <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="email">Email Address</Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                disabled
                              />
                              <p className="text-xs text-muted-foreground">
                                Contact support to change your email address
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="state">State/Province</Label>
                              <Input
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="zip">Zip/Postal Code</Label>
                              <Input
                                id="zip"
                                name="zip"
                                value={formData.zip}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                              id="bio"
                              name="bio"
                              rows={4}
                              value={formData.bio}
                              onChange={handleInputChange}
                              placeholder="Tell us about yourself..."
                            />
                          </div>
                          
                          <Button
                            type="submit"
                            className="bg-servie hover:bg-servie-600"
                            disabled={isLoading}
                          >
                            {isLoading ? "Saving..." : "Save Changes"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Professional Information</CardTitle>
                        <CardDescription>Share details about your professional background</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="jobTitle">Job Title</Label>
                              <Input
                                id="jobTitle"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleInputChange}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="company">Company</Label>
                              <Input
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                              id="website"
                              name="website"
                              type="url"
                              value={formData.website}
                              onChange={handleInputChange}
                              placeholder="https://yourwebsite.com"
                            />
                          </div>
                          
                          <Button
                            type="submit"
                            className="bg-servie hover:bg-servie-600"
                          >
                            Save Changes
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Social Profiles</CardTitle>
                        <CardDescription>Connect your social media accounts</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="twitter">Twitter</Label>
                            <Input
                              id="twitter"
                              name="twitter"
                              value={formData.twitter}
                              onChange={handleInputChange}
                              placeholder="@username"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input
                              id="linkedin"
                              name="linkedin"
                              value={formData.linkedin}
                              onChange={handleInputChange}
                              placeholder="linkedin.com/in/username"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="instagram">Instagram</Label>
                            <Input
                              id="instagram"
                              name="instagram"
                              value={formData.instagram}
                              onChange={handleInputChange}
                              placeholder="@username"
                            />
                          </div>
                          
                          <Button
                            type="submit"
                            className="bg-servie hover:bg-servie-600"
                          >
                            Save Changes
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="account" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Preferences</CardTitle>
                        <CardDescription>Manage your account settings</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="language">Language</Label>
                            <Select defaultValue="en">
                              <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="es">Spanish</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="de">German</SelectItem>
                                <SelectItem value="zh">Chinese</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="timezone">Time Zone</Label>
                            <Select defaultValue="est">
                              <SelectTrigger>
                                <SelectValue placeholder="Select timezone" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="est">Eastern Time (ET)</SelectItem>
                                <SelectItem value="cst">Central Time (CT)</SelectItem>
                                <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                                <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                                <SelectItem value="utc">Coordinated Universal Time (UTC)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select defaultValue="usd">
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="usd">US Dollar (USD)</SelectItem>
                                <SelectItem value="eur">Euro (EUR)</SelectItem>
                                <SelectItem value="gbp">British Pound (GBP)</SelectItem>
                                <SelectItem value="cad">Canadian Dollar (CAD)</SelectItem>
                                <SelectItem value="aud">Australian Dollar (AUD)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="marketing" defaultChecked />
                            <label htmlFor="marketing">Receive marketing emails</label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="notifications" defaultChecked />
                            <label htmlFor="notifications">Receive notification emails</label>
                          </div>
                          
                          <Button
                            type="submit"
                            className="bg-servie hover:bg-servie-600"
                          >
                            Save Preferences
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Connected Accounts</CardTitle>
                        <CardDescription>Link your accounts to enable additional features</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border rounded-md">
                            <div>
                              <p className="font-medium">Google</p>
                              <p className="text-sm text-muted-foreground">Not connected</p>
                            </div>
                            <Button variant="outline" className="ml-auto">Connect</Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border rounded-md">
                            <div>
                              <p className="font-medium">Facebook</p>
                              <p className="text-sm text-muted-foreground">Not connected</p>
                            </div>
                            <Button variant="outline" className="ml-auto">Connect</Button>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border rounded-md">
                            <div>
                              <p className="font-medium">Apple</p>
                              <p className="text-sm text-muted-foreground">Not connected</p>
                            </div>
                            <Button variant="outline" className="ml-auto">Connect</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="password" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>Update your password to keep your account secure</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type="password"
                              value={formData.currentPassword}
                              onChange={handleInputChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type="password"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                            />
                          </div>
                          
                          <Button
                            type="submit"
                            className="bg-servie hover:bg-servie-600"
                            disabled={isLoading}
                          >
                            {isLoading ? "Updating..." : "Update Password"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-red-300">
                      <CardHeader>
                        <CardTitle className="text-red-500">Danger Zone</CardTitle>
                        <CardDescription>Irreversible actions for your account</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium text-lg">Delete Account</h3>
                            <p className="text-sm text-muted-foreground">
                              Once you delete your account, there is no going back. This action cannot be undone.
                            </p>
                          </div>
                          <Button variant="destructive">Delete My Account</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
