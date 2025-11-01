import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Payment configuration
export const PAYMENT_CONFIG = {
  PLATFORM_COMMISSION_RATE: 0.09, // 9%
  PSP_VARIABLE_RATE: 0.039, // 3.9%
  PSP_FIXED_FEE: 0.30, // $0.30
  ESCROW_THRESHOLD_AMOUNT: 500, // $500
  ESCROW_THRESHOLD_DURATION: 7, // 7 days
  ESCROW_MIN_TRANSACTIONS: 5
};

export interface PaymentIntent {
  order_id: string;
  buyer_id: string;
  seller_id: string;
  gross_amount: number;
  currency: string;
  payment_method: string;
  idempotency_key?: string;
}

export interface PaymentSplit {
  platform_commission: number;
  psp_fee: number;
  seller_payout: number;
}

/**
 * Calculate payment splits (Platform 9%, PSP 3.9% + $0.30, remainder to seller)
 */
export function calculatePaymentSplit(grossAmount: number): PaymentSplit {
  const platformCommission = grossAmount * PAYMENT_CONFIG.PLATFORM_COMMISSION_RATE;
  const pspFee = (grossAmount * PAYMENT_CONFIG.PSP_VARIABLE_RATE) + PAYMENT_CONFIG.PSP_FIXED_FEE;
  const sellerPayout = grossAmount - platformCommission - pspFee;

  return {
    platform_commission: Math.round(platformCommission * 100) / 100,
    psp_fee: Math.round(pspFee * 100) / 100,
    seller_payout: Math.round(sellerPayout * 100) / 100
  };
}

/**
 * Check if order qualifies for escrow protection
 */
export async function shouldUseEscrow(
  grossAmount: number, 
  serviceDuration: number, 
  sellerId: string
): Promise<boolean> {
  // Check amount threshold
  if (grossAmount >= PAYMENT_CONFIG.ESCROW_THRESHOLD_AMOUNT) return true;
  
  // Check duration threshold
  if (serviceDuration >= PAYMENT_CONFIG.ESCROW_THRESHOLD_DURATION) return true;
  
  // Check seller transaction count
  const { count } = await supabase
    .from('payment_transactions')
    .select('*', { count: 'exact', head: true })
    .eq('seller_id', sellerId)
    .eq('status', 'completed');
  
  if ((count || 0) < PAYMENT_CONFIG.ESCROW_MIN_TRANSACTIONS) return true;
  
  return false;
}

/**
 * Create payment transaction with idempotency
 */
export async function createPaymentTransaction(intent: PaymentIntent): Promise<any> {
  const idempotencyKey = intent.idempotency_key || `payment-${uuidv4()}`;
  
  // Check for existing transaction with same idempotency key
  const { data: existingKey } = await supabase
    .from('idempotency_keys')
    .select('*')
    .eq('idempotency_key', idempotencyKey)
    .eq('request_type', 'payment')
    .single();
  
  if (existingKey && existingKey.status === 'completed') {
    // Return existing transaction
    return existingKey.response_payload;
  }
  
  // Calculate splits
  const split = calculatePaymentSplit(intent.gross_amount);
  
  try {
    // Store idempotency key (processing state)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    await supabase.from('idempotency_keys').insert({
      idempotency_key: idempotencyKey,
      user_id: user.id,
      request_type: 'payment',
      status: 'processing',
      request_payload: intent as any
    });
    
    // Create payment transaction
    const { data: transaction, error: txError } = await supabase
      .from('payment_transactions')
      .insert({
        order_id: intent.order_id,
        user_id: intent.buyer_id,
        seller_id: intent.seller_id,
        amount: intent.gross_amount,
        currency: intent.currency,
        payment_gateway: 'stripe', // Default, can be dynamic based on region
        payment_method: intent.payment_method,
        platform_commission: split.platform_commission,
        seller_payout: split.seller_payout,
        status: 'pending'
      })
      .select()
      .single();
    
    if (txError) throw txError;
    
    // Create payment split record
    await supabase.from('payment_splits').insert({
      transaction_id: transaction.id,
      order_id: intent.order_id,
      seller_id: intent.seller_id,
      gross_amount: intent.gross_amount,
      platform_commission: split.platform_commission,
      psp_fee: split.psp_fee,
      seller_payout: split.seller_payout,
      currency: intent.currency,
      split_status: 'pending'
    });
    
    // Update idempotency key (completed)
    await supabase
      .from('idempotency_keys')
      .update({
        status: 'completed',
        response_payload: transaction
      })
      .eq('idempotency_key', idempotencyKey);
    
    return transaction;
  } catch (error) {
    // Update idempotency key (failed)
    await supabase
      .from('idempotency_keys')
      .update({ status: 'failed' })
      .eq('idempotency_key', idempotencyKey);
    
    throw error;
  }
}

/**
 * Create escrow transaction for high-value/risky orders
 */
export async function createEscrowTransaction(
  orderId: string,
  buyerId: string,
  sellerId: string,
  amount: number,
  releaseDays: number = 7
): Promise<any> {
  const releaseDate = new Date();
  releaseDate.setDate(releaseDate.getDate() + releaseDays);
  
  const { data, error } = await supabase
    .from('escrow_transactions')
    .insert({
      order_id: orderId,
      buyer_id: buyerId,
      seller_id: sellerId,
      amount,
      currency: 'USD',
      escrow_status: 'pending',
      release_date: releaseDate.toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Process escrow release (buyer confirms delivery)
 */
export async function releaseEscrow(escrowId: string): Promise<void> {
  const { error } = await supabase
    .from('escrow_transactions')
    .update({
      escrow_status: 'released',
      released_at: new Date().toISOString()
    })
    .eq('id', escrowId);
  
  if (error) throw error;
}

/**
 * Refund escrow (dispute resolution)
 */
export async function refundEscrow(escrowId: string, reason: string): Promise<void> {
  const { error } = await supabase
    .from('escrow_transactions')
    .update({
      escrow_status: 'refunded',
      refunded_at: new Date().toISOString(),
      dispute_reason: reason
    })
    .eq('id', escrowId);
  
  if (error) throw error;
}

/**
 * Get regional PSPs based on country
 */
export function getRegionalPSPs(countryCode: string): string[] {
  const pspMap: Record<string, string[]> = {
    'NG': ['paystack', 'flutterwave', 'stripe'],
    'KE': ['mpesa', 'flutterwave', 'stripe'],
    'ZA': ['paystack', 'stripe', 'paypal'],
    'GH': ['paystack', 'flutterwave', 'stripe'],
    'US': ['stripe', 'paypal', 'square'],
    'GB': ['stripe', 'paypal'],
    'DEFAULT': ['stripe', 'paypal']
  };
  
  return pspMap[countryCode] || pspMap['DEFAULT'];
}
