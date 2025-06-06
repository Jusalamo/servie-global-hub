
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_profile?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  last_message?: string;
  last_message_at: string;
  created_at: string;
  other_participant?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  unread_count: number;
}

class MessagingAPI {
  private getConversationId(userId1: string, userId2: string): string {
    // Create consistent conversation ID regardless of participant order
    return [userId1, userId2].sort().join('-');
  }

  async createOrGetConversation(otherUserId: string): Promise<string> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const conversationId = this.getConversationId(user.id, otherUserId);
      return conversationId;
    } catch (error) {
      console.error('Error creating/getting conversation:', error);
      throw error;
    }
  }

  async sendMessage(receiverId: string, content: string): Promise<Message> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Use notifications table for basic messaging
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: receiverId,
          title: 'New Message',
          message: content,
          type: 'message',
          data: {
            sender_id: user.id,
            receiver_id: receiverId,
            conversation_id: this.getConversationId(user.id, receiverId)
          }
        })
        .select()
        .single();

      if (error) throw error;

      // Transform notification to message format
      const message: Message = {
        id: data.id,
        sender_id: user.id,
        receiver_id: receiverId,
        content: content,
        is_read: data.is_read || false,
        created_at: data.created_at || new Date().toISOString()
      };

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getMessages(conversationId: string, limit: number = 50): Promise<Message[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get messages from notifications table
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          profiles!notifications_user_id_fkey(first_name, last_name, avatar_url)
        `)
        .eq('type', 'message')
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) throw error;

      // Transform notifications to messages
      const messages: Message[] = (data || []).map(notification => ({
        id: notification.id,
        sender_id: notification.data?.sender_id || '',
        receiver_id: notification.data?.receiver_id || notification.user_id || '',
        content: notification.message,
        is_read: notification.is_read || false,
        created_at: notification.created_at || new Date().toISOString(),
        sender_profile: notification.profiles ? {
          first_name: notification.profiles.first_name || '',
          last_name: notification.profiles.last_name || '',
          avatar_url: notification.profiles.avatar_url || undefined
        } : undefined
      }));

      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async getConversations(): Promise<Conversation[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get message notifications for this user
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          profiles!notifications_user_id_fkey(id, first_name, last_name, avatar_url)
        `)
        .eq('type', 'message')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by conversation and create conversation objects
      const conversationMap = new Map<string, Conversation>();
      
      (data || []).forEach(notification => {
        const senderId = notification.data?.sender_id;
        const receiverId = notification.data?.receiver_id || notification.user_id;
        
        if (!senderId || !receiverId) return;
        
        const conversationId = this.getConversationId(senderId, receiverId);
        const otherUserId = senderId === user.id ? receiverId : senderId;
        
        if (!conversationMap.has(conversationId)) {
          conversationMap.set(conversationId, {
            id: conversationId,
            participant_1: user.id,
            participant_2: otherUserId,
            last_message: notification.message,
            last_message_at: notification.created_at || new Date().toISOString(),
            created_at: notification.created_at || new Date().toISOString(),
            other_participant: notification.profiles ? {
              id: notification.profiles.id,
              first_name: notification.profiles.first_name || '',
              last_name: notification.profiles.last_name || '',
              avatar_url: notification.profiles.avatar_url || undefined
            } : undefined,
            unread_count: 0
          });
        }
      });

      return Array.from(conversationMap.values());
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  async markMessagesAsRead(conversationId: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('type', 'message')
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  async searchUsers(query: string): Promise<any[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, role')
        .neq('id', user.id) // Exclude current user
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }
}

export const messagingAPI = new MessagingAPI();
