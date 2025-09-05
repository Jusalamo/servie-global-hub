import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreVertical,
  UserPlus,
  MessageSquare,
  Clock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { realTimeMessagingAPI, type Message, type Conversation } from '@/services/realTimeMessagingAPI';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface RealTimeMessagingProps {
  userRole?: string;
  initialConversationId?: string;
  initialReceiverId?: string;
}

export default function RealTimeMessaging({ 
  userRole = 'client',
  initialConversationId,
  initialReceiverId
}: RealTimeMessagingProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [searchUsers, setSearchUsers] = useState<any[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Load conversations on mount
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  // Handle initial conversation or receiver
  useEffect(() => {
    if (initialConversationId) {
      setSelectedConversation(initialConversationId);
    } else if (initialReceiverId && user) {
      // Create or get conversation with the specified receiver
      realTimeMessagingAPI.createOrGetConversation(initialReceiverId)
        .then((conversationId) => {
          setSelectedConversation(conversationId);
        })
        .catch((error) => {
          console.error('Error creating conversation:', error);
          toast.error('Failed to start conversation');
        });
    }
  }, [initialConversationId, initialReceiverId, user]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
      markMessagesAsRead(selectedConversation);
      
      // Set up real-time subscription
      const unsubscribe = realTimeMessagingAPI.subscribeToMessages(
        selectedConversation,
        (newMessage) => {
          setMessages(prev => [...prev, newMessage]);
          scrollToBottom();
          
          // Mark as read if user is the receiver
          if (newMessage.receiver_id === user?.id) {
            markMessagesAsRead(selectedConversation);
          }
        }
      );
      
      unsubscribeRef.current = unsubscribe;
      
      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }
      };
    }
  }, [selectedConversation, user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const data = await realTimeMessagingAPI.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Failed to load conversations');
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const data = await realTimeMessagingAPI.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const markMessagesAsRead = async (conversationId: string) => {
    try {
      await realTimeMessagingAPI.markMessagesAsRead(conversationId);
      // Refresh conversations to update unread count
      loadConversations();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      setIsLoading(true);
      const selectedConv = conversations.find(c => c.id === selectedConversation);
      if (!selectedConv) return;

      const receiverId = selectedConv.participant_one === user.id 
        ? selectedConv.participant_two 
        : selectedConv.participant_one;

      const message = await realTimeMessagingAPI.sendMessage(receiverId, newMessage.trim());
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      loadConversations(); // Refresh conversations list
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const searchUsersForNewConversation = async (query: string) => {
    if (query.length < 2) {
      setSearchUsers([]);
      return;
    }

    try {
      const users = await realTimeMessagingAPI.searchUsers(query);
      // Filter out current user
      const filteredUsers = users.filter(u => u.id !== user?.id);
      setSearchUsers(filteredUsers);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const startNewConversation = async (otherUserId: string) => {
    try {
      const conversationId = await realTimeMessagingAPI.createOrGetConversation(otherUserId);
      setSelectedConversation(conversationId);
      setShowNewConversation(false);
      setUserSearchTerm('');
      setSearchUsers([]);
      loadConversations();
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Failed to start conversation');
    }
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.other_participant?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.other_participant?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.last_message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConvData = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r bg-muted/20">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Messages</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowNewConversation(!showNewConversation)}
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
          
          {showNewConversation && (
            <div className="mb-3">
              <Input
                placeholder="Search users..."
                value={userSearchTerm}
                onChange={(e) => {
                  setUserSearchTerm(e.target.value);
                  searchUsersForNewConversation(e.target.value);
                }}
                className="mb-2"
              />
              {searchUsers.length > 0 && (
                <div className="max-h-32 overflow-y-auto border rounded p-2 bg-background">
                  {searchUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                      onClick={() => startNewConversation(user.id)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${
                selectedConversation === conversation.id ? 'bg-muted' : ''
              }`}
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={conversation.other_participant?.avatar_url} />
                  <AvatarFallback>
                    {conversation.other_participant?.first_name?.[0]}
                    {conversation.other_participant?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">
                      {conversation.other_participant?.first_name} {conversation.other_participant?.last_name}
                    </p>
                    {conversation.unread_count! > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {conversation.unread_count}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.last_message || 'No messages yet'}
                  </p>
                  {conversation.last_message_at && (
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(conversation.last_message_at), 'MMM d, p')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation && selectedConvData ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedConvData.other_participant?.avatar_url} />
                  <AvatarFallback>
                    {selectedConvData.other_participant?.first_name?.[0]}
                    {selectedConvData.other_participant?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">
                    {selectedConvData.other_participant?.first_name} {selectedConvData.other_participant?.last_name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedConvData.other_participant?.role}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Video className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwnMessage = message.sender_id === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          isOwnMessage
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 opacity-50" />
                          <span className="text-xs opacity-50">
                            {format(new Date(message.created_at), 'p')}
                          </span>
                          {isOwnMessage && message.read_at && (
                            <span className="text-xs opacity-50">✓✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isLoading}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}