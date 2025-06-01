
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  id: string;
  conversation_id: string;
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
      
      // Check if conversation exists
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('id', conversationId)
        .single();

      if (existingConversation) {
        return conversationId;
      }

      // Create new conversation
      const { error } = await supabase
        .from('conversations')
        .insert({
          id: conversationId,
          participant_1: user.id,
          participant_2: otherUserId,
        });

      if (error) throw error;
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

      const conversationId = await this.createOrGetConversation(receiverId);

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          receiver_id: receiverId,
          content,
        })
        .select(`
          *,
          sender_profile:profiles!sender_id(first_name, last_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Update conversation's last message
      await supabase
        .from('conversations')
        .update({
          last_message: content,
          last_message_at: new Date().toISOString(),
        })
        .eq('id', conversationId);

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getMessages(conversationId: string, limit: number = 50): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender_profile:profiles!sender_id(first_name, last_name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async getConversations(): Promise<Conversation[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant_1_profile:profiles!participant_1(id, first_name, last_name, avatar_url),
          participant_2_profile:profiles!participant_2(id, first_name, last_name, avatar_url)
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Process conversations to add other participant info and unread count
      const processedConversations = await Promise.all(
        (data || []).map(async (conv) => {
          const otherParticipant = conv.participant_1 === user.id 
            ? conv.participant_2_profile 
            : conv.participant_1_profile;

          // Get unread message count
          const { count } = await supabase
            .from('messages')
            .select('id', { count: 'exact' })
            .eq('conversation_id', conv.id)
            .eq('receiver_id', user.id)
            .eq('is_read', false);

          return {
            ...conv,
            other_participant: otherParticipant,
            unread_count: count || 0,
          };
        })
      );

      return processedConversations;
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
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .eq('receiver_id', user.id)
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
