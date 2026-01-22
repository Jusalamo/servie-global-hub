import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read_at?: string;
  created_at: string;
  updated_at: string;
  sender_profile?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

export interface Conversation {
  id: string;
  participant_one: string;
  participant_two: string;
  created_at: string;
  updated_at: string;
  last_message_at?: string;
  last_message?: string;
  last_message_sender?: string;
  unread_count?: number;
  other_participant?: {
    id: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    role?: string;
  };
}

export class RealTimeMessagingAPI {
  async createOrGetConversation(otherUserId: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Ensure consistent ordering for unique constraint
    const [participantOne, participantTwo] = [user.id, otherUserId].sort();

    // Try to find existing conversation
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('participant_one', participantOne)
      .eq('participant_two', participantTwo)
      .single();

    if (existingConversation) {
      return existingConversation.id;
    }

    // Create new conversation
    const { data: newConversation, error } = await supabase
      .from('conversations')
      .insert({
        participant_one: participantOne,
        participant_two: participantTwo,
      })
      .select('id')
      .single();

    if (error) throw error;
    return newConversation.id;
  }

  async sendMessage(receiverId: string, content: string): Promise<Message> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const conversationId = await this.createOrGetConversation(receiverId);

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        receiver_id: receiverId,
        content: content,
      })
      .select('*')
      .single();

    if (error) throw error;
    return message;
  }

  async getMessages(conversationId: string, limit: number = 50): Promise<Message[]> {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return messages || [];
  }

  async getConversations(): Promise<Conversation[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`participant_one.eq.${user.id},participant_two.eq.${user.id}`)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Enhance conversations with participant info and unread count
    const enhancedConversations = await Promise.all(
      (conversations || []).map(async (conversation) => {
        const otherParticipantId = 
          conversation.participant_one === user.id 
            ? conversation.participant_two 
            : conversation.participant_one;

        // Get other participant's profile
        const { data: otherProfile } = await supabase
          .from('user_directory')
          .select('id, first_name, last_name, avatar_url, role')
          .eq('id', otherParticipantId)
          .single();

        // Get unread message count
        const { count: unreadCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conversation.id)
          .eq('receiver_id', user.id)
          .is('read_at', null);

        return {
          ...conversation,
          other_participant: otherProfile,
          unread_count: unreadCount || 0,
        };
      })
    );

    return enhancedConversations;
  }

  async markMessagesAsRead(conversationId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('receiver_id', user.id)
      .is('read_at', null);

    if (error) throw error;
  }

  async searchUsers(query: string): Promise<any[]> {
    const { data: users, error } = await supabase
      .from('user_directory')
      .select('id, first_name, last_name, avatar_url, role')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
      .limit(10);

    if (error) throw error;
    return users || [];
  }

  // Real-time subscription setup
  subscribeToMessages(conversationId: string, onMessage: (message: Message) => void) {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          // Fetch the complete message with sender profile
          const { data: message } = await supabase
            .from('messages')
            .select('*')
            .eq('id', payload.new.id)
            .single();

          if (message) {
            onMessage(message as Message);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  async subscribeToConversations(onConversationUpdate: (conversation: any) => void) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return () => {};

    const channel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        (payload) => {
          const conversation = payload.new as any;
          // Only notify if user is a participant
          if (conversation?.participant_one === user.id || conversation?.participant_two === user.id) {
            onConversationUpdate(conversation);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}

export const realTimeMessagingAPI = new RealTimeMessagingAPI();