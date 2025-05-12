
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Bot, Send, User, Loader2, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { 
  generateAIResponse, 
  saveConversationHistory,
  loadConversationHistory,
  clearConversationHistory
} from "@/utils/AIAssistantService";

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Load conversation history on initial mount
  useEffect(() => {
    const savedHistory = loadConversationHistory();
    if (savedHistory && savedHistory.length > 0) {
      setMessages(savedHistory);
    } else {
      // Initialize with welcome message if no history
      setMessages([{
        id: '1',
        content: 'Hi, I\'m your Servie AI assistant. How can I help you today?',
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
  }, []);
  
  // Save conversation history when messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveConversationHistory(messages);
    }
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const response = await generateAIResponse(inputMessage, messages);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast.error("Couldn't get a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConversation = () => {
    clearConversationHistory();
    setMessages([{
      id: '1',
      content: 'Hi, I\'m your Servie AI assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }]);
    toast.success("Conversation history cleared");
  };
  
  return (
    <>
      {/* Chat button (fixed position) */}
      <Button
        onClick={() => setIsOpen(prev => !prev)}
        className={`fixed bottom-4 right-4 rounded-full p-3 ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-servie hover:bg-servie-600'} shadow-lg z-50`}
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </Button>
      
      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-80 md:w-96 shadow-xl z-50 border border-gray-200 max-h-[80vh] flex flex-col">
          <CardHeader className="bg-servie text-white py-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Servie AI Assistant
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-servie-600 p-1 h-auto" 
              onClick={handleClearConversation}
              title="Clear conversation"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-3 overflow-y-auto flex-grow max-h-[400px]">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      msg.sender === 'user' 
                        ? 'bg-servie text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      {msg.sender === 'ai' ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                      <span className="text-xs opacity-70">
                        {msg.sender === 'ai' ? 'AI Assistant' : 'You'}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-3 py-2 bg-gray-100 text-gray-800 rounded-bl-none">
                    <div className="flex items-center gap-1 mb-1">
                      <Bot className="h-3 w-3" />
                      <span className="text-xs opacity-70">AI Assistant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm">Thinking...</p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="p-2 border-t">
            <form onSubmit={handleSendMessage} className="w-full flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !inputMessage.trim()}
                className="bg-servie hover:bg-servie-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default AIAssistant;
