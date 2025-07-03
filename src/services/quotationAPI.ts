
import { supabase } from "@/integrations/supabase/client";

export interface Quotation {
  id: string;
  quote_number: string;
  provider_id: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  title: string;
  description?: string;
  subtotal: number;
  discount_amount: number;
  discount_percentage: number;
  tax_amount: number;
  tax_percentage: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';
  due_date?: string;
  valid_until?: string;
  notes?: string;
  terms_conditions?: string;
  created_at: string;
  updated_at: string;
  sent_at?: string;
  accepted_at?: string;
  declined_at?: string;
}

export interface QuotationItem {
  id: string;
  quotation_id: string;
  item_name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  sort_order: number;
  created_at: string;
}

export interface CreateQuotationData {
  client_name: string;
  client_email?: string;
  client_phone?: string;
  title: string;
  description?: string;
  due_date?: string;
  valid_until?: string;
  notes?: string;
  terms_conditions?: string;
  items: {
    item_name: string;
    description?: string;
    quantity: number;
    unit_price: number;
  }[];
  discount_percentage?: number;
  tax_percentage?: number;
}

export const quotationAPI = {
  async getMyQuotations(): Promise<Quotation[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching quotations:', error);
      throw error;
    }
  },

  async getQuotationById(id: string): Promise<Quotation | null> {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching quotation:', error);
      throw error;
    }
  },

  async getQuotationItems(quotationId: string): Promise<QuotationItem[]> {
    try {
      const { data, error } = await supabase
        .from('quotation_items')
        .select('*')
        .eq('quotation_id', quotationId)
        .order('sort_order');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching quotation items:', error);
      throw error;
    }
  },

  async createQuotation(quotationData: CreateQuotationData): Promise<Quotation> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create the quotation
      const { data: quotation, error: quotationError } = await supabase
        .from('quotations')
        .insert({
          provider_id: user.id,
          client_name: quotationData.client_name,
          client_email: quotationData.client_email,
          client_phone: quotationData.client_phone,
          title: quotationData.title,
          description: quotationData.description,
          due_date: quotationData.due_date,
          valid_until: quotationData.valid_until,
          notes: quotationData.notes,
          terms_conditions: quotationData.terms_conditions,
          discount_percentage: quotationData.discount_percentage || 0,
          tax_percentage: quotationData.tax_percentage || 0,
        })
        .select()
        .single();

      if (quotationError) throw quotationError;

      // Create quotation items
      const items = quotationData.items.map((item, index) => ({
        quotation_id: quotation.id,
        item_name: item.item_name,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price,
        sort_order: index,
      }));

      const { error: itemsError } = await supabase
        .from('quotation_items')
        .insert(items);

      if (itemsError) throw itemsError;

      return quotation;
    } catch (error) {
      console.error('Error creating quotation:', error);
      throw error;
    }
  },

  async updateQuotationStatus(id: string, status: Quotation['status']): Promise<void> {
    try {
      const updateData: any = { status };
      
      if (status === 'sent') {
        updateData.sent_at = new Date().toISOString();
      } else if (status === 'accepted') {
        updateData.accepted_at = new Date().toISOString();
      } else if (status === 'declined') {
        updateData.declined_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('quotations')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating quotation status:', error);
      throw error;
    }
  },

  async deleteQuotation(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('quotations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting quotation:', error);
      throw error;
    }
  },

  async duplicateQuotation(id: string): Promise<Quotation> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get original quotation
      const originalQuotation = await this.getQuotationById(id);
      if (!originalQuotation) throw new Error('Quotation not found');

      // Get original items
      const originalItems = await this.getQuotationItems(id);

      // Create new quotation
      const newQuotationData: CreateQuotationData = {
        client_name: originalQuotation.client_name,
        client_email: originalQuotation.client_email,
        client_phone: originalQuotation.client_phone,
        title: `${originalQuotation.title} (Copy)`,
        description: originalQuotation.description,
        due_date: originalQuotation.due_date,
        valid_until: originalQuotation.valid_until,
        notes: originalQuotation.notes,
        terms_conditions: originalQuotation.terms_conditions,
        discount_percentage: originalQuotation.discount_percentage,
        tax_percentage: originalQuotation.tax_percentage,
        items: originalItems.map(item => ({
          item_name: item.item_name,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      };

      return await this.createQuotation(newQuotationData);
    } catch (error) {
      console.error('Error duplicating quotation:', error);
      throw error;
    }
  }
};
