
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Plus, Search, MoreVertical } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "client" | "provider" | "seller";
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: "client" | "provider" | "seller";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

interface MessagingSystemProps {
  userRole: "client" | "provider" | "seller";
}

const MessagingSystem = ({ userRole }: MessagingSystemProps) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewConversation, setShowNewConversation] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: "conv-1",
        participantId: "user-1",
        participantName: "Sarah Johnson",
        participantRole: userRole === "client" ? "provider" : "client",
        lastMessage: "Thanks for the excellent service!",
        lastMessageTime: "2 hours ago",
        unreadCount: 1,
        messages: [
          {
            id: "msg-1",
            senderId: "user-1",
            senderName: "Sarah Johnson",
            senderRole: userRole === "client" ? "provider" : "client",
            content: "Hi, I'm interested in your services. Could you provide more details?",
            timestamp: "10:30 AM",
            read: true
          },
          {
            id: "msg-2",
            senderId: user?.id || "current-user",
            senderName: "You",
            senderRole: userRole,
            content: "Of course! I'd be happy to help. What specific service are you looking for?",
            timestamp: "10:45 AM",
            read: true
          },
          {
            id: "msg-3",
            senderId: "user-1",
            senderName: "Sarah Johnson",
            senderRole: userRole === "client" ? "provider" : "client",
            content: "Thanks for the excellent service!",
            timestamp: "2:15 PM",
            read: false
          }
        ]
      },
      {
        id: "conv-2",
        participantId: "user-2",
        participantName: "Mike Chen",
        participantRole: userRole === "client" ? "seller" : "client",
        lastMessage: "When will the order be shipped?",
        lastMessageTime: "1 day ago",
        unreadCount: 0,
        messages: [
          {
            id: "msg-4",
            senderId: "user-2",
            senderName: "Mike Chen",
            senderRole: userRole === "client" ? "seller" : "client",
            content: "When will the order be shipped?",
            timestamp: "Yesterday 3:20 PM",
            read: true
          }
        ]
      }
    ];
    setConversations(mockConversations);
  }, [userRole, user?.id]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || "current-user",
      senderName: "You",
      senderRole: userRole,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: newMessage,
              lastMessageTime: "Just now"
            }
          : conv
      )
    );

    setNewMessage("");
  };

  const handleStartNewConversation = () => {
    setShowNewConversation(true);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentConversation = conversations.find(conv => conv.id === selectedConversation);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Messages</h2>
        <Button onClick={handleStartNewConversation} className="button-group-horizontal">
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="consistent-card p-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation === conversation.id
                      ? "bg-servie/10 border-l-4 border-l-servie"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt={conversation.participantName} />
                        <AvatarFallback>
                          {conversation.participantName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">
                            {conversation.participantName}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {conversation.participantRole}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {conversation.lastMessageTime}
                        </p>
                      </div>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="destructive" className="h-5 w-5 rounded-full text-xs flex items-center justify-center">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          {currentConversation ? (
            <Card className="consistent-card p-0 flex flex-col h-full">
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={currentConversation.participantName} />
                    <AvatarFallback>
                      {currentConversation.participantName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{currentConversation.participantName}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {currentConversation.participantRole}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {currentConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === (user?.id || "current-user") ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.senderId === (user?.id || "current-user")
                          ? "bg-servie text-white"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderId === (user?.id || "current-user")
                            ? "text-white/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="resize-none"
                    rows={2}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} className="shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="consistent-card flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <p>Select a conversation to start messaging</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingSystem;
