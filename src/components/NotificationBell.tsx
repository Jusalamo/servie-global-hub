
import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNotifications } from "@/context/NotificationContext";
import { formatDistanceToNow } from "date-fns";

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      // When opening, mark all as read after a delay
      setTimeout(() => {
        markAllAsRead();
      }, 3000);
    }
  };
  
  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    setIsOpen(false);
  };
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '🛍️';
      case 'booking':
        return '📅';
      case 'message':
        return '✉️';
      default:
        return '🔔';
    }
  };
  
  return (
    <div className="relative">
      <Button variant="ghost" onClick={toggleOpen} className="relative">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[1.25rem] min-h-[1.25rem] flex items-center justify-center bg-red-500 text-white"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>
      
      {isOpen && (
        <Card className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto shadow-lg z-50">
          <div className="p-3 flex justify-between items-center border-b">
            <h3 className="font-medium">Notifications</h3>
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => markAllAsRead()}
              >
                Mark all read
              </Button>
            )}
          </div>
          
          <div>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id}>
                  <div 
                    className={`p-3 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''}`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className="text-lg">{getIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{notification.title}</div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="text-xs text-muted-foreground mt-1">
                          {notification.createdAt && formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1"></div>
                      )}
                    </div>
                  </div>
                  <Separator />
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-2 text-center">
              <Button variant="ghost" size="sm" className="text-xs w-full" asChild>
                <a href="/dashboard/client">View all notifications</a>
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

export default NotificationBell;
