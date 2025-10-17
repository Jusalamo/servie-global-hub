import { FinancialDocument } from '@/types/financialDocuments';
import { format } from 'date-fns';

interface DocumentTemplateProps {
  document: FinancialDocument;
  companyInfo?: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
}

// Sales Invoice Template (For Clients)
export const SalesInvoiceTemplate = ({ document, companyInfo }: DocumentTemplateProps) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${document.document_number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #6366f1; }
    .header h1 { color: #6366f1; font-size: 32px; margin-bottom: 10px; }
    .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .info-block { flex: 1; }
    .info-block h3 { color: #6366f1; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; }
    .info-block p { margin: 5px 0; font-size: 14px; }
    .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
    .items-table th { background: #6366f1; color: white; padding: 12px; text-align: left; }
    .items-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    .items-table tr:hover { background: #f9fafb; }
    .totals { margin-top: 30px; text-align: right; }
    .totals table { margin-left: auto; min-width: 300px; }
    .totals td { padding: 8px 15px; }
    .total-row { font-size: 18px; font-weight: bold; background: #f3f4f6; }
    .notes { margin-top: 40px; padding: 20px; background: #f9fafb; border-radius: 8px; }
    .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #6b7280; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SALES INVOICE</h1>
      <p style="font-size: 18px; color: #6b7280;">Invoice #${document.document_number}</p>
    </div>

    <div class="info-section">
      <div class="info-block">
        <h3>From</h3>
        <p><strong>${companyInfo?.name || 'Servie Marketplace'}</strong></p>
        <p>${companyInfo?.address || ''}</p>
        <p>${companyInfo?.phone || ''}</p>
        <p>${companyInfo?.email || ''}</p>
      </div>
      <div class="info-block">
        <h3>Bill To</h3>
        <p><strong>${document.client_name}</strong></p>
        ${document.client_email ? `<p>${document.client_email}</p>` : ''}
        ${document.client_phone ? `<p>${document.client_phone}</p>` : ''}
        ${document.client_address ? `<p>${document.client_address}</p>` : ''}
      </div>
      <div class="info-block">
        <h3>Invoice Details</h3>
        <p><strong>Date:</strong> ${format(new Date(document.issue_date), 'MMM dd, yyyy')}</p>
        ${document.due_date ? `<p><strong>Due Date:</strong> ${format(new Date(document.due_date), 'MMM dd, yyyy')}</p>` : ''}
        <p><strong>Status:</strong> ${document.status.toUpperCase()}</p>
      </div>
    </div>

    <h2 style="color: #6366f1; margin: 30px 0 15px;">Invoice Items</h2>
    <table class="items-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Description</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${document.line_items.map(item => `
          <tr>
            <td><strong>${item.item_name}</strong></td>
            <td>${item.description || '-'}</td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: right;">${document.currency} ${Number(item.unit_price).toFixed(2)}</td>
            <td style="text-align: right;">${document.currency} ${Number(item.total_price).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals">
      <table>
        <tr>
          <td>Subtotal:</td>
          <td style="text-align: right;"><strong>${document.currency} ${Number(document.subtotal).toFixed(2)}</strong></td>
        </tr>
        ${document.discount_amount > 0 ? `
        <tr>
          <td>Discount (${document.discount_percentage}%):</td>
          <td style="text-align: right; color: #10b981;">-${document.currency} ${Number(document.discount_amount).toFixed(2)}</td>
        </tr>` : ''}
        ${document.tax_amount > 0 ? `
        <tr>
          <td>Tax (${document.tax_percentage}%):</td>
          <td style="text-align: right;">${document.currency} ${Number(document.tax_amount).toFixed(2)}</td>
        </tr>` : ''}
        <tr class="total-row">
          <td>TOTAL:</td>
          <td style="text-align: right;">${document.currency} ${Number(document.total_amount).toFixed(2)}</td>
        </tr>
        ${document.amount_paid > 0 ? `
        <tr>
          <td>Amount Paid:</td>
          <td style="text-align: right; color: #10b981;">${document.currency} ${Number(document.amount_paid).toFixed(2)}</td>
        </tr>
        <tr style="color: #ef4444; font-weight: bold;">
          <td>Balance Due:</td>
          <td style="text-align: right;">${document.currency} ${Number(document.balance_due).toFixed(2)}</td>
        </tr>` : ''}
      </table>
    </div>

    ${document.notes || document.terms_conditions || document.payment_instructions ? `
    <div class="notes">
      ${document.notes ? `<p><strong>Notes:</strong><br>${document.notes}</p>` : ''}
      ${document.payment_instructions ? `<p style="margin-top: 15px;"><strong>Payment Instructions:</strong><br>${document.payment_instructions}</p>` : ''}
      ${document.terms_conditions ? `<p style="margin-top: 15px;"><strong>Terms & Conditions:</strong><br>${document.terms_conditions}</p>` : ''}
    </div>` : ''}

    <div class="footer">
      <p>Thank you for your business!</p>
      <p>This is a computer-generated document. No signature required.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

// Payout Statement Template (For Sellers)
export const PayoutStatementTemplate = ({ document, companyInfo }: DocumentTemplateProps) => {
  const grossAmount = Number(document.total_amount);
  const platformCommission = grossAmount * 0.05; // 5% commission
  const netPayout = grossAmount - platformCommission;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payout Statement ${document.document_number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #10b981; }
    .header h1 { color: #10b981; font-size: 32px; margin-bottom: 10px; }
    .info-section { margin-bottom: 30px; padding: 20px; background: #f0fdf4; border-radius: 8px; }
    .info-section h3 { color: #10b981; margin-bottom: 15px; }
    .breakdown { margin: 30px 0; }
    .breakdown-table { width: 100%; border-collapse: collapse; }
    .breakdown-table td { padding: 15px; border-bottom: 1px solid #e5e7eb; }
    .breakdown-table tr:last-child td { border-bottom: none; }
    .highlight { background: #dcfce7; font-weight: bold; font-size: 18px; }
    .commission-note { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
    .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #6b7280; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>PAYOUT STATEMENT</h1>
      <p style="font-size: 18px; color: #6b7280;">Statement #${document.document_number}</p>
    </div>

    <div class="info-section">
      <h3>Seller Information</h3>
      <p><strong>${document.client_name}</strong></p>
      ${document.client_email ? `<p>Email: ${document.client_email}</p>` : ''}
      <p>Statement Date: ${format(new Date(document.issue_date), 'MMM dd, yyyy')}</p>
      ${document.due_date ? `<p>Payout Date: ${format(new Date(document.due_date), 'MMM dd, yyyy')}</p>` : ''}
    </div>

    <div class="breakdown">
      <h2 style="color: #10b981; margin-bottom: 20px;">Earnings Breakdown</h2>
      <table class="breakdown-table">
        <tr>
          <td><strong>Gross Sales Amount</strong></td>
          <td style="text-align: right; font-size: 18px;"><strong>${document.currency} ${grossAmount.toFixed(2)}</strong></td>
        </tr>
        <tr>
          <td>Platform Commission (5%)</td>
          <td style="text-align: right; color: #ef4444;">-${document.currency} ${platformCommission.toFixed(2)}</td>
        </tr>
        <tr class="highlight">
          <td><strong>NET PAYOUT</strong></td>
          <td style="text-align: right;"><strong>${document.currency} ${netPayout.toFixed(2)}</strong></td>
        </tr>
      </table>
    </div>

    <div class="commission-note">
      <p><strong>About Platform Commission:</strong></p>
      <p style="margin-top: 8px;">The 5% commission helps us maintain and improve the platform, provide customer support, secure payment processing, and marketing to bring you more customers.</p>
    </div>

    ${document.notes ? `
    <div style="margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 8px;">
      <p><strong>Additional Notes:</strong></p>
      <p style="margin-top: 10px;">${document.notes}</p>
    </div>` : ''}

    <div class="footer">
      <p><strong>Servie Marketplace</strong></p>
      <p>Questions? Contact us at support@servie.com</p>
      <p style="margin-top: 10px;">This document is for your records only.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

// Monthly Subscription Receipt Template
export const SubscriptionReceiptTemplate = ({ document, companyInfo }: DocumentTemplateProps) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Receipt ${document.document_number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 700px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #8b5cf6; }
    .header h1 { color: #8b5cf6; font-size: 32px; margin-bottom: 10px; }
    .receipt-box { background: #faf5ff; padding: 30px; border-radius: 12px; margin: 30px 0; border: 2px solid #8b5cf6; }
    .receipt-box h2 { color: #8b5cf6; margin-bottom: 20px; text-align: center; }
    .receipt-details { margin: 20px 0; }
    .receipt-details p { padding: 10px 0; border-bottom: 1px solid #e9d5ff; display: flex; justify-content: space-between; }
    .receipt-details p:last-child { border-bottom: none; }
    .total-amount { background: #8b5cf6; color: white; padding: 20px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; }
    .info-section { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #6b7280; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SUBSCRIPTION RECEIPT</h1>
      <p style="font-size: 18px; color: #6b7280;">Receipt #${document.document_number}</p>
    </div>

    <div class="info-section">
      <p><strong>Subscriber:</strong> ${document.client_name}</p>
      ${document.client_email ? `<p><strong>Email:</strong> ${document.client_email}</p>` : ''}
      <p><strong>Payment Date:</strong> ${format(new Date(document.issue_date), 'MMMM dd, yyyy')}</p>
      ${document.due_date ? `<p><strong>Next Billing Date:</strong> ${format(new Date(document.due_date), 'MMMM dd, yyyy')}</p>` : ''}
    </div>

    <div class="receipt-box">
      <h2>${document.title}</h2>
      <div class="receipt-details">
        ${document.line_items.map(item => `
          <p>
            <span><strong>${item.item_name}</strong>${item.description ? `<br><small style="color: #6b7280;">${item.description}</small>` : ''}</span>
            <span>${document.currency} ${Number(item.total_price).toFixed(2)}</span>
          </p>
        `).join('')}
      </div>
    </div>

    <div class="total-amount">
      PAID: ${document.currency} ${Number(document.total_amount).toFixed(2)}
    </div>

    ${document.payment_method ? `
    <div class="info-section">
      <p><strong>Payment Method:</strong> ${document.payment_method}</p>
      <p><strong>Transaction ID:</strong> ${document.document_number}</p>
      <p><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">PAID</span></p>
    </div>` : ''}

    ${document.notes ? `
    <div style="margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 8px;">
      <p><strong>Important Information:</strong></p>
      <p style="margin-top: 10px;">${document.notes}</p>
    </div>` : ''}

    <div class="footer">
      <p><strong>Thank you for your subscription!</strong></p>
      <p>Servie Marketplace | ${companyInfo?.email || 'support@servie.com'}</p>
      <p style="margin-top: 10px;">Keep this receipt for your records.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

// Generic Document Template (fallback)
export const GenericDocumentTemplate = ({ document, companyInfo }: DocumentTemplateProps) => {
  return SalesInvoiceTemplate({ document, companyInfo });
};

// Template selector
export const getDocumentTemplate = (document: FinancialDocument, companyInfo?: any): string => {
  switch (document.document_type) {
    case 'invoice':
      return SalesInvoiceTemplate({ document, companyInfo });
    case 'receipt':
      return SubscriptionReceiptTemplate({ document, companyInfo });
    case 'quotation':
      return SalesInvoiceTemplate({ document, companyInfo }); // Similar to invoice
    case 'deposit_slip':
    case 'payment_voucher':
      return PayoutStatementTemplate({ document, companyInfo });
    case 'credit_note':
    case 'delivery_note':
    default:
      return GenericDocumentTemplate({ document, companyInfo });
  }
};
