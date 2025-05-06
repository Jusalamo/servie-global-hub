
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, Bell, Mail, SmartphoneIcon, CheckCheck, Clock, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationPreference {
  id: string;
  type: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'message' | 'payment' | 'system' | 'promotion';
  read: boolean;
  date: string;
}

// Mock notification preferences
const defaultNotificationPreferences: NotificationPreference[] = [
  {
    id: 'bookings',
    type: 'Booking Updates',
    description: 'Notifications about booking confirmations, changes, and reminders',
    email: true,
    push: true,
    sms: false,
  },
  {
    id: 'messages',
    type: 'Messages',
    description: 'Notifications when you receive new messages',
    email: true,
    push: true,
    sms: false,
  },
  {
    id: 'payments',
    type: 'Payment Updates',
    description: 'Notifications about payment confirmations and receipts',
    email: true,
    push: true,
    sms: true,
  },
  {
    id: 'promotions',
    type: 'Promotions & Offers',
    description: 'Marketing messages about deals and special offers',
    email: false,
    push: false,
    sms: false,
  },
  {
    id: 'system',
    type: 'System Updates',
    description: 'Important information about your account and the platform',
    email: true,
    push: false,
    sms: false,
  },
];

// Mock notification history
const defaultNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Booking Confirmed',
    message: 'Your booking for Home Cleaning on May 15 has been confirmed.',
    type: 'booking',
    read: true,
    date: '2023-05-10T14:30:00',
  },
  {
    id: 'notif-2',
    title: 'New Message',
    message: 'You have received a new message from Sarah Johnson.',
    type: 'message',
    read: true,
    date: '2023-05-09T10:15:00',
  },
  {
    id: 'notif-3',
    title: 'Payment Success',
    message: 'Your payment of $85.00 for Home Cleaning was successful.',
    type: 'payment',
    read: true,
    date: '2023-05-08T16:45:00',
  },
  {
    id: 'notif-4',
    title: 'Special Offer',
    message: 'Get 20% off your next booking! Use code SPRING20.',
    type: 'promotion',
    read: false,
    date: '2023-05-07T09:30:00',
  },
  {
    id: 'notif-5',
    title: 'Account Security',
    message: 'We noticed a login from a new device. Was this you?',
    type: 'system',
    read: false,
    date: '2023-05-06T22:10:00',
  },
  {
    id: 'notif-6',
    title: 'Booking Reminder',
    message: 'Reminder: You have a booking for Plumbing Service tomorrow at 2:00 PM.',
    type: 'booking',
    read: false,
    date: '2023-05-05T08:00:00',
  },
];

const NotificationsSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreference[]>(defaultNotificationPreferences);
  const [notifications, setNotifications] = useState<NotificationItem[]>(defaultNotifications);
  const [selectedTab, setSelectedTab] = useState('preferences');
  const [saving, setSaving] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleTogglePreference = (prefId: string, channel: 'email' | 'push' | 'sms', value: boolean) => {
    setPreferences(prev => 
      prev.map(pref => 
        pref.id === prefId 
          ? { ...pref, [channel]: value } 
          : pref
      )
    );
  };
  
  const handleSavePreferences = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast.success('Notification preferences saved successfully');
    }, 1000);
  };
  
  const handleMarkAsRead = (notifId?: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notifId 
          ? notif.id === notifId 
            ? { ...notif, read: true } 
            : notif
          : { ...notif, read: true }
      )
    );
    
    if (notifId) {
      toast.success('Notification marked as read');
    } else {
      toast.success('All notifications marked as read');
    }
  };
  
  const handleDeleteNotification = (notifId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notifId));
    toast.success('Notification deleted');
  };
  
  const handleClearAllNotifications = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    } else if (diffDays === 1) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' }) + ' ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-4 w-4" />;
      case 'message':
        return <MessageIcon className="h-4 w-4" />;
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
      case 'system':
        return <AlertIcon className="h-4 w-4" />;
      case 'promotion':
        return <TagIcon className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-100 text-blue-800';
      case 'message':
        return 'bg-green-100 text-green-800';
      case 'payment':
        return 'bg-purple-100 text-purple-800';
      case 'system':
        return 'bg-amber-100 text-amber-800';
      case 'promotion':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const filteredNotifications = filterType === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filterType);

  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="preferences" className="px-5">
              Preferences
            </TabsTrigger>
            <TabsTrigger value="notifications" className="px-5 relative">
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-1 bg-servie hover:bg-servie">{unreadCount}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          {selectedTab === 'preferences' ? (
            <Button 
              onClick={handleSavePreferences}
              disabled={saving}
              className="bg-servie hover:bg-servie-600"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save Preferences
                </>
              )}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleMarkAsRead()}
                disabled={!notifications.some(n => !n.read)}
              >
                <CheckCheck className="mr-1 h-4 w-4" />
                Mark All Read
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClearAllNotifications}
                disabled={notifications.length === 0}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Clear All
              </Button>
            </div>
          )}
        </div>
        
        <TabsContent value="preferences" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how and when you'd like to be notified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Notification Type</TableHead>
                    <TableHead className="w-[100px] text-center">Email</TableHead>
                    <TableHead className="w-[100px] text-center">Push</TableHead>
                    <TableHead className="w-[100px] text-center">SMS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preferences.map((pref) => (
                    <TableRow key={pref.id}>
                      <TableCell className="align-middle">
                        <div>
                          <div className="font-medium">{pref.type}</div>
                          <div className="text-sm text-muted-foreground">
                            {pref.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Switch
                            id={`${pref.id}-email`}
                            checked={pref.email}
                            onCheckedChange={(checked) => 
                              handleTogglePreference(pref.id, 'email', checked)
                            }
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Switch
                            id={`${pref.id}-push`}
                            checked={pref.push}
                            onCheckedChange={(checked) => 
                              handleTogglePreference(pref.id, 'push', checked)
                            }
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Switch
                            id={`${pref.id}-sms`}
                            checked={pref.sms}
                            onCheckedChange={(checked) => 
                              handleTogglePreference(pref.id, 'sms', checked)
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">Delivery Methods</h3>
                
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Receive notifications to your email address
                        </div>
                        <div className="text-sm font-medium">
                          john.doe@example.com <Button variant="link" className="h-auto p-0 text-servie">Change</Button>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.some(p => p.email)}
                        onCheckedChange={(checked) => {
                          setPreferences(prev => 
                            prev.map(pref => ({ ...pref, email: checked }))
                          );
                        }}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Bell className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Push Notifications</div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Receive real-time notifications on your device
                        </div>
                        <div className="text-sm font-medium">
                          This browser and mobile app
                        </div>
                      </div>
                      <Switch
                        checked={preferences.some(p => p.push)}
                        onCheckedChange={(checked) => {
                          setPreferences(prev => 
                            prev.map(pref => ({ ...pref, push: checked }))
                          );
                        }}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <SmartphoneIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">SMS Notifications</div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Receive text messages for important updates
                        </div>
                        <div className="text-sm font-medium">
                          (555) 123-4567 <Button variant="link" className="h-auto p-0 text-servie">Change</Button>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.some(p => p.sms)}
                        onCheckedChange={(checked) => {
                          setPreferences(prev => 
                            prev.map(pref => ({ ...pref, sms: checked }))
                          );
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notification Center
                </CardTitle>
                
                <div className="flex items-center gap-2">
                  <Select
                    value={filterType}
                    onValueChange={(value) => {
                      setFiltering(true);
                      setFilterType(value);
                      setTimeout(() => setFiltering(false), 300);
                    }}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Notifications</SelectItem>
                      <SelectItem value="booking">Bookings</SelectItem>
                      <SelectItem value="message">Messages</SelectItem>
                      <SelectItem value="payment">Payments</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="promotion">Promotions</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      setFiltering(true);
                      setTimeout(() => {
                        setFilterType('all');
                        setFiltering(false);
                      }, 300);
                    }}
                    title="Refresh notifications"
                    disabled={filtering}
                  >
                    <RefreshCw className={`h-4 w-4 ${filtering ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
              <CardDescription>
                Stay updated with your latest notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredNotifications.length > 0 ? (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border rounded-lg ${!notification.read ? 'bg-muted/50' : ''}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}>
                          {getTypeIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`font-medium ${!notification.read ? 'text-servie' : ''}`}>
                              {notification.title}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(notification.date)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleMarkAsRead(notification.id)}
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleDeleteNotification(notification.id)}
                            title="Delete notification"
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <Bell className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">No notifications</h3>
                  <p className="text-muted-foreground">
                    You don't have any notifications at the moment
                  </p>
                </div>
              )}
            </CardContent>
            {filteredNotifications.length > 5 && (
              <CardFooter className="flex justify-center border-t pt-4">
                <Button variant="outline">View More</Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Icons
const Calendar = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const MessageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CreditCard = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

const AlertIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" x2="12" y1="9" y2="13" />
    <line x1="12" x2="12.01" y1="17" y2="17" />
  </svg>
);

const TagIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </svg>
);

export default NotificationsSettings;
