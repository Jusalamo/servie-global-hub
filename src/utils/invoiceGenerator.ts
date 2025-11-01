import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { calculatePaymentSplit } from '@/services/paymentAPI';

export interface InvoiceData {
  invoice_number: string;
  date: string;
  seller_name: string;
  seller_email: string;
  buyer_name: string;
  buyer_email: string;
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
  gross_amount: number;
  currency: string;
}

/**
 * Generate professional invoice PDF with payment breakdown
 * Shows: Gross Sale, Platform Fee (9%), PSP Fee (3.9% + $0.30), Net Payout
 */
export async function generateInvoicePDF(data: InvoiceData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const primaryColor = rgb(0.2, 0.4, 0.8); // Blue
  const textColor = rgb(0.2, 0.2, 0.2);
  const lightGray = rgb(0.9, 0.9, 0.9);
  
  let yPosition = height - 50;
  
  // Header - Servie Logo & Invoice Title
  page.drawText('SERVIE', {
    x: 50,
    y: yPosition,
    size: 24,
    font: boldFont,
    color: primaryColor
  });
  
  page.drawText('INVOICE', {
    x: width - 150,
    y: yPosition,
    size: 20,
    font: boldFont,
    color: textColor
  });
  
  yPosition -= 10;
  page.drawText('African Services Marketplace', {
    x: 50,
    y: yPosition,
    size: 10,
    font: font,
    color: textColor
  });
  
  page.drawText(`#${data.invoice_number}`, {
    x: width - 150,
    y: yPosition,
    size: 10,
    font: font,
    color: textColor
  });
  
  yPosition -= 40;
  
  // Date & Seller Info
  page.drawText(`Date: ${new Date(data.date).toLocaleDateString()}`, {
    x: 50,
    y: yPosition,
    size: 10,
    font: font,
    color: textColor
  });
  
  yPosition -= 30;
  page.drawText('FROM:', {
    x: 50,
    y: yPosition,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  yPosition -= 20;
  page.drawText(data.seller_name, {
    x: 50,
    y: yPosition,
    size: 10,
    font: font,
    color: textColor
  });
  
  yPosition -= 15;
  page.drawText(data.seller_email, {
    x: 50,
    y: yPosition,
    size: 10,
    font: font,
    color: textColor
  });
  
  // Buyer Info
  yPosition -= 30;
  page.drawText('TO:', {
    x: 50,
    y: yPosition,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  yPosition -= 20;
  page.drawText(data.buyer_name, {
    x: 50,
    y: yPosition,
    size: 10,
    font: font,
    color: textColor
  });
  
  yPosition -= 15;
  page.drawText(data.buyer_email, {
    x: 50,
    y: yPosition,
    size: 10,
    font: font,
    color: textColor
  });
  
  yPosition -= 40;
  
  // Items Table Header
  page.drawRectangle({
    x: 50,
    y: yPosition - 20,
    width: width - 100,
    height: 25,
    color: lightGray
  });
  
  page.drawText('Description', {
    x: 60,
    y: yPosition - 10,
    size: 10,
    font: boldFont,
    color: textColor
  });
  
  page.drawText('Qty', {
    x: width - 250,
    y: yPosition - 10,
    size: 10,
    font: boldFont,
    color: textColor
  });
  
  page.drawText('Unit Price', {
    x: width - 180,
    y: yPosition - 10,
    size: 10,
    font: boldFont,
    color: textColor
  });
  
  page.drawText('Total', {
    x: width - 100,
    y: yPosition - 10,
    size: 10,
    font: boldFont,
    color: textColor
  });
  
  yPosition -= 35;
  
  // Items
  data.items.forEach((item) => {
    page.drawText(item.description, {
      x: 60,
      y: yPosition,
      size: 9,
      font: font,
      color: textColor,
      maxWidth: 250
    });
    
    page.drawText(item.quantity.toString(), {
      x: width - 250,
      y: yPosition,
      size: 9,
      font: font,
      color: textColor
    });
    
    page.drawText(`${data.currency} ${item.unit_price.toFixed(2)}`, {
      x: width - 180,
      y: yPosition,
      size: 9,
      font: font,
      color: textColor
    });
    
    page.drawText(`${data.currency} ${item.total.toFixed(2)}`, {
      x: width - 100,
      y: yPosition,
      size: 9,
      font: font,
      color: textColor
    });
    
    yPosition -= 20;
  });
  
  yPosition -= 20;
  
  // Payment Breakdown
  const split = calculatePaymentSplit(data.gross_amount);
  
  // Gross Sale
  page.drawText('Gross Sale:', {
    x: width - 250,
    y: yPosition,
    size: 10,
    font: font,
    color: textColor
  });
  
  page.drawText(`${data.currency} ${data.gross_amount.toFixed(2)}`, {
    x: width - 100,
    y: yPosition,
    size: 10,
    font: font,
    color: textColor
  });
  
  yPosition -= 20;
  
  // Platform Fee (9%)
  page.drawText('Platform Fee (9%):', {
    x: width - 250,
    y: yPosition,
    size: 9,
    font: font,
    color: rgb(0.8, 0, 0)
  });
  
  page.drawText(`-${data.currency} ${split.platform_commission.toFixed(2)}`, {
    x: width - 100,
    y: yPosition,
    size: 9,
    font: font,
    color: rgb(0.8, 0, 0)
  });
  
  yPosition -= 20;
  
  // PSP Fee (3.9% + $0.30)
  page.drawText('PSP Fee (3.9% + $0.30):', {
    x: width - 250,
    y: yPosition,
    size: 9,
    font: font,
    color: rgb(0.8, 0, 0)
  });
  
  page.drawText(`-${data.currency} ${split.psp_fee.toFixed(2)}`, {
    x: width - 100,
    y: yPosition,
    size: 9,
    font: font,
    color: rgb(0.8, 0, 0)
  });
  
  yPosition -= 25;
  
  // Net Payout
  page.drawRectangle({
    x: width - 260,
    y: yPosition - 20,
    width: 210,
    height: 30,
    color: lightGray
  });
  
  page.drawText('NET PAYOUT:', {
    x: width - 250,
    y: yPosition - 5,
    size: 12,
    font: boldFont,
    color: primaryColor
  });
  
  page.drawText(`${data.currency} ${split.seller_payout.toFixed(2)}`, {
    x: width - 100,
    y: yPosition - 5,
    size: 12,
    font: boldFont,
    color: primaryColor
  });
  
  yPosition -= 60;
  
  // Footer
  page.drawText('This invoice serves as your official financial statement for tax and loan verification purposes.', {
    x: 50,
    y: 50,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  page.drawText('Servie - servie.com - support@servie.com', {
    x: 50,
    y: 35,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  return await pdfDoc.save();
}
