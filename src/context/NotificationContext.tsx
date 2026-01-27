
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "booking" | "message" | "system";
  isRead: boolean;
  createdAt: string;
  relatedId?: string; // ID of related order, booking, etc.
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "isRead">) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isRealtimeEnabled, setIsRealtimeEnabled] = useState(false);

  // Fetch notifications from database on mount when authenticated
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAuthenticated || !user?.id) {
        // Clear notifications when user logs out
        setNotifications([]);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (error) {
          console.error('Error fetching notifications:', error);
          return;
        }
        
        if (data) {
          const formattedNotifications: Notification[] = data.map((n: any) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type as Notification['type'],
            isRead: n.is_read,
            createdAt: n.created_at,
            relatedId: n.data?.related_id
          }));
          setNotifications(formattedNotifications);
        }
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };

    fetchNotifications();
  }, [isAuthenticated, user?.id]);

  // Update unreadCount when notifications change
  useEffect(() => {
    const count = notifications.filter(n => !n.isRead).length;
    setUnreadCount(count);
  }, [notifications]);

  // Setup realtime subscription to notifications table if authenticated
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    
    const setupRealtime = async () => {
      try {
        const channel = supabase.channel('public:notifications')
          .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'notifications',
            filter: `user_id=eq.${user.id}` 
          }, (payload) => {
            console.log('New notification received:', payload);
            const newNotification = payload.new as any;
            
            // Add notification to state
            setNotifications(prev => [
              {
                id: newNotification.id,
                title: newNotification.title,
                message: newNotification.message,
                type: newNotification.type,
                isRead: newNotification.is_read,
                createdAt: newNotification.created_at,
                relatedId: newNotification.related_id
              },
              ...prev
            ]);
            
            // Show toast for new notification
            toast(newNotification.title, {
              description: newNotification.message,
              action: {
                label: "View",
                onClick: () => markAsRead(newNotification.id)
              }
            });
          })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              setIsRealtimeEnabled(true);
              console.log('Realtime subscription active for notifications');
            }
          });

        return () => {
          channel.unsubscribe();
        };
      } catch (error) {
        console.error("Error setting up notification realtime:", error);
      }
    };

    setupRealtime();
  }, [isAuthenticated, user?.id]);

  // Function to mark a notification as read
  const markAsRead = async (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
    
    // If connected to Supabase, update the database
    if (isAuthenticated && user?.id) {
      try {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', id)
          .eq('user_id', user.id);
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  // Function to mark all notifications as read
  const markAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    
    // If connected to Supabase, update the database
    if (isAuthenticated && user?.id) {
      try {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('user_id', user.id)
          .eq('is_read', false);
      } catch (error) {
        console.error("Error marking all notifications as read:", error);
      }
    }
  };

  // Function to add a new notification
  const addNotification = (notification: Omit<Notification, "id" | "createdAt" | "isRead">) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      isRead: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast for new notification
    toast(newNotification.title, {
      description: newNotification.message
    });
    
    // If connected to Supabase, save to database
    if (isAuthenticated && user?.id) {
      try {
        supabase.from('notifications').insert({
          user_id: user.id,
          title: newNotification.title,
          message: newNotification.message,
          type: newNotification.type,
          is_read: false,
          related_id: newNotification.relatedId
        });
      } catch (error) {
        console.error("Error saving notification to database:", error);
      }
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markAsRead, 
      markAllAsRead,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook to use notification context
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
