export type DocumentType =
  | 'quotation'
  | 'invoice'
  | 'receipt'
  | 'deposit_slip'
  | 'payment_voucher'
  | 'credit_note'
  | 'delivery_note';

export type DocumentStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'archived';

export interface LineItem {
  id?: string;
  item_name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  sort_order?: number;
}

export interface FinancialDocument {
  id: string;
  provider_id: string;
  client_id?: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  client_address?: string;
  document_type: DocumentType;
  document_number: string;
  title: string;
  description?: string;
  issue_date: string;
  due_date?: string;
  valid_until?: string;
  currency: string;
  subtotal: number;
  tax_percentage: number;
  tax_amount: number;
  discount_percentage: number;
  discount_amount: number;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  status: DocumentStatus;
  line_items: LineItem[];
  notes?: string;
  terms_conditions?: string;
  payment_instructions?: string;
  payment_method?: string;
  related_document_id?: string;
  created_at: string;
  updated_at: string;
  sent_at?: string;
  viewed_at?: string;
  paid_at?: string;
}

export interface DocumentTemplate {
  id: string;
  provider_id: string;
  template_name: string;
  document_type: DocumentType;
  template_data: Record<string, any>;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  quotation: 'Quotation',
  invoice: 'Invoice',
  receipt: 'Receipt',
  deposit_slip: 'Deposit Slip',
  payment_voucher: 'Payment Voucher',
  credit_note: 'Credit Note',
  delivery_note: 'Delivery Note',
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  viewed: 'Viewed',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
  archived: 'Archived',
};

export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD - US Dollar', symbol: '$' },
  { value: 'NAD', label: 'NAD - Namibian Dollar', symbol: 'N$' },
  { value: 'NGN', label: 'NGN - Nigerian Naira', symbol: '₦' },
  { value: 'ZAR', label: 'ZAR - South African Rand', symbol: 'R' },
  { value: 'EUR', label: 'EUR - Euro', symbol: '€' },
  { value: 'GBP', label: 'GBP - British Pound', symbol: '£' },
];
