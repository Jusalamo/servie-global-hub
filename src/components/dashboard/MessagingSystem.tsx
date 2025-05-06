
import React, { useState, useEffect } from 'react';
import { User, Send, Search, Image, Paperclip, ChevronLeft, MoreVertical, Check, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Mock data for conversations
const mockConversations = [
  {
    id: '1',
    recipient: {
      id: 'user1',
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      lastSeen: '2023-05-15T10:30:00',
      online: true,
    },
    lastMessage: {
      content: 'Hi there! I was wondering if you could help me with my booking.',
      timestamp: '2023-05-15T10:30:00',
      read: false,
      sender: 'user1'
    },
    unreadCount: 2
  },
  {
    id: '2',
    recipient: {
      id: 'user2',
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      lastSeen: '2023-05-14T18:45:00',
      online: false,
    },
    lastMessage: {
      content: 'Thanks for your quick response. The service was excellent!',
      timestamp: '2023-05-14T18:45:00',
      read: true,
      sender: 'currentUser'
    },
    unreadCount: 0
  },
  {
    id: '3',
    recipient: {
      id: 'user3',
      name: 'Emma Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      lastSeen: '2023-05-15T09:15:00',
      online: true,
    },
    lastMessage: {
      content: 'I need to reschedule our appointment for next week.',
      timestamp: '2023-05-15T09:15:00',
      read: false,
      sender: 'user3'
    },
    unreadCount: 1
  }
];

// Mock data for messages in a conversation
const mockMessages = [
  {
    id: 'm1',
    content: 'Hi, I was wondering about the cleaning service you offer.',
    timestamp: '2023-05-15T09:00:00',
    sender: 'user1',
    status: 'read'
  },
  {
    id: 'm2',
    content: 'Hello! Sure, I offer regular home cleaning services including dusting, vacuuming, and bathroom cleaning.',
    timestamp: '2023-05-15T09:05:00',
    sender: 'currentUser',
    status: 'read'
  },
  {
    id: 'm3',
    content: 'That sounds great! How much do you charge per hour?',
    timestamp: '2023-05-15T09:10:00',
    sender: 'user1',
    status: 'read'
  },
  {
    id: 'm4',
    content: 'My rate is $30 per hour, with a minimum of 2 hours per session.',
    timestamp: '2023-05-15T09:15:00',
    sender: 'currentUser',
    status: 'read'
  },
  {
    id: 'm5',
    content: 'Do you provide your own cleaning supplies?',
    timestamp: '2023-05-15T10:30:00',
    sender: 'user1',
    status: 'delivered'
  }
];

// Template messages for providers
const messageTemplates = [
  "Thank you for your inquiry. I'll get back to you shortly.",
  "Your booking has been confirmed for the requested date and time.",
  "I need to reschedule our appointment. Are you available at an alternative time?",
  "Your payment has been successfully received. Thank you!",
  "Please provide more details about your requirements so I can assist you better."
];

interface MessagingSystemProps {
  userRole?: string; // 'provider', 'client', 'seller'
}

const MessagingSystem = ({ userRole = 'provider' }: MessagingSystemProps) => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState(mockConversations);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();
  
  const filteredConversations = conversations.filter(conv => 
    conv.recipient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const currentConversation = conversations.find(conv => conv.id === selectedConversation);
  
  useEffect(() => {
    // Mark messages as read when conversation is selected
    if (selectedConversation) {
      setConversations(prevConvs => 
        prevConvs.map(conv => 
          conv.id === selectedConversation 
            ? { ...conv, unreadCount: 0, lastMessage: { ...conv.lastMessage, read: true } } 
            : conv
        )
      );
    }
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // Create new message
    const newMsg = {
      id: `m${Date.now()}`,
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: 'currentUser',
      status: 'sent'
    };
    
    // Add message to current conversation
    setMessages(prev => [...prev, newMsg]);
    
    // Update last message in conversations list
    setConversations(prevConvs => 
      prevConvs.map(conv => 
        conv.id === selectedConversation 
          ? { 
              ...conv, 
              lastMessage: { 
                content: newMessage, 
                timestamp: new Date().toISOString(),
                read: true,
                sender: 'currentUser'
              } 
            } 
          : conv
      )
    );
    
    // Clear input
    setNewMessage('');
    
    // Simulate message being delivered
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMsg.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 1000);
    
    // Simulate message being read
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMsg.id ? { ...msg, status: 'read' } : msg
        )
      );
    }, 2000);
    
    // Simulate typing indicator from recipient
    setTimeout(() => {
      setIsTyping(true);
      
      // Simulate reply after typing
      setTimeout(() => {
        setIsTyping(false);
        
        // Add reply message
        const recipientId = currentConversation?.recipient.id;
        const replyMsg = {
          id: `m${Date.now() + 1}`,
          content: "Thanks for your message. I'll respond in detail shortly.",
          timestamp: new Date().toISOString(),
          sender: recipientId || 'unknown',
          status: 'read'
        };
        
        setMessages(prev => [...prev, replyMsg]);
        
        // Update conversation last message
        setConversations(prevConvs => 
          prevConvs.map(conv => 
            conv.id === selectedConversation 
              ? { 
                  ...conv, 
                  lastMessage: { 
                    content: replyMsg.content, 
                    timestamp: replyMsg.timestamp,
                    read: false,
                    sender: recipientId || 'unknown'
                  },
                  unreadCount: conv.unreadCount + 1
                } 
              : conv
          )
        );
      }, 3000);
    }, 1000);
    
    toast.success("Message sent successfully!");
  };
  
  const handleSelectTemplate = (template: string) => {
    setNewMessage(template);
    setShowTemplates(false);
  };
  
  const handleFileUpload = () => {
    // This would normally open a file picker
    toast.info("File upload functionality will be available soon.");
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <div className="flex h-[calc(100vh-200px)] border rounded-lg overflow-hidden">
      {/* Left sidebar - Conversations */}
      <div className={`w-full md:w-80 border-r bg-background flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedConversation === conversation.id ? 'bg-muted' : ''
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.recipient.avatar} alt={conversation.recipient.name} />
                      <AvatarFallback>{conversation.recipient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.recipient.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">{conversation.recipient.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(conversation.lastMessage.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage.sender === 'currentUser' && 'You: '}
                      {conversation.lastMessage.content}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <Badge variant="destructive" className="rounded-full px-2 py-1 h-5 min-w-[20px] flex items-center justify-center">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No conversations found
            </div>
          )}
        </div>
      </div>
      
      {/* Right side - Chat */}
      <div className={`flex-1 flex flex-col ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
        {selectedConversation && currentConversation ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="mr-2 md:hidden"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-9 w-9 mr-2">
                  <AvatarImage src={currentConversation.recipient.avatar} />
                  <AvatarFallback>{currentConversation.recipient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{currentConversation.recipient.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {currentConversation.recipient.online ? (
                      <span className="text-green-500">Online</span>
                    ) : (
                      `Last seen ${new Date(currentConversation.recipient.lastSeen).toLocaleString()}`
                    )}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Contact</DropdownMenuItem>
                  <DropdownMenuItem>Search in Conversation</DropdownMenuItem>
                  <DropdownMenuItem>Clear Messages</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Block Contact</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Chat messages */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-4">
              {messages.map((message) => {
                const isSender = message.sender === 'currentUser';
                
                return (
                  <div key={message.id} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-lg p-3 ${
                      isSender 
                        ? 'bg-servie text-white rounded-br-none' 
                        : 'bg-muted rounded-bl-none'
                    }`}>
                      <p>{message.content}</p>
                      <div className={`flex items-center justify-end text-xs mt-1 ${
                        isSender ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        {formatTime(message.timestamp)}
                        {isSender && (
                          <span className="ml-1">
                            {message.status === 'sent' && <Clock className="h-3 w-3" />}
                            {message.status === 'delivered' && <Check className="h-3 w-3" />}
                            {message.status === 'read' && (
                              <div className="flex">
                                <Check className="h-3 w-3" />
                                <Check className="h-3 w-3 -ml-1" />
                              </div>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 rounded-bl-none">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Chat input */}
            <div className="p-4 border-t">
              {showTemplates && userRole === 'provider' && (
                <div className="mb-3 p-2 bg-muted rounded-lg max-h-32 overflow-y-auto">
                  <p className="text-xs text-muted-foreground mb-1">Quick responses:</p>
                  <div className="space-y-1">
                    {messageTemplates.map((template, i) => (
                      <button
                        key={i}
                        className="text-sm p-1 hover:bg-primary/10 rounded w-full text-left"
                        onClick={() => handleSelectTemplate(template)}
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-end gap-2">
                <Textarea
                  placeholder="Type a message..."
                  className="min-h-10 max-h-28"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <div className="flex flex-col gap-2">
                  {userRole === 'provider' && (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setShowTemplates(!showTemplates)}
                      title="Quick responses"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleFileUpload}
                    title="Upload image"
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleFileUpload}
                    title="Attach file"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button 
                    className="bg-servie hover:bg-servie-600" 
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Send className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
            <p className="text-center text-muted-foreground max-w-sm">
              Select a conversation from the list to start messaging or create a new message.
            </p>
            <Button className="mt-4 bg-servie hover:bg-servie-600">
              Start New Conversation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingSystem;
