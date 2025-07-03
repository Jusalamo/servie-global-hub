
import { supabase } from "@/integrations/supabase/client";

export interface FinancialTransaction {
  id: string;
  user_id: string;
  type: 'earning' | 'expense';
  category: 'service_booking' | 'product_sale' | 'commission' | 'refund' | 'withdrawal' | 'other';
  amount: number;
  description?: string;
  reference_id?: string;
  reference_type?: string;
  status: 'pending' | 'completed' | 'cancelled';
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export interface EarningsSummary {
  id: string;
  user_id: string;
  total_earnings: number;
  total_expenses: number;
  monthly_earnings: number;
  monthly_expenses: number;
  weekly_earnings: number;
  weekly_expenses: number;
  last_updated: string;
  created_at: string;
}

export const financialAPI = {
  async getEarningsSummary(): Promise<EarningsSummary | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('earnings_summary')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as EarningsSummary;
    } catch (error) {
      console.error('Error fetching earnings summary:', error);
      return null;
    }
  },

  async getTransactions(limit = 50): Promise<FinancialTransaction[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as FinancialTransaction[];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  async createTransaction(transaction: Omit<FinancialTransaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<FinancialTransaction> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('financial_transactions')
        .insert({
          ...transaction,
          user_id: user.id,
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data as FinancialTransaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<FinancialTransaction[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('transaction_date', startDate)
        .lte('transaction_date', endDate)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      return (data || []) as FinancialTransaction[];
    } catch (error) {
      console.error('Error fetching transactions by date range:', error);
      throw error;
    }
  }
};
