import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { calculatePaymentSplit } from '@/services/paymentAPI';

export interface BrandedInvoiceData {
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
  // Branding fields
  company_name?: string;
  company_logo_url?: string;
  brand_color_primary?: string;
  brand_color_accent?: string;
}

/**
 * Generate professional branded invoice PDF with payment breakdown
 * Shows: Gross Sale, Platform Fee (9%), PSP Fee (3.9% + $0.30), Net Payout
 * Includes custom branding from seller profile
 */
export async function generateBrandedInvoicePDF(data: BrandedInvoiceData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Use brand colors if provided, otherwise use defaults
  let primaryColor = rgb(0.2, 0.4, 0.8);
  
  // Parse brand color if provided (hex format like #ea384c)
  if (data.brand_color_primary) {
    const hex = data.brand_color_primary.replace('#', '');
    if (hex.length === 6) {
      primaryColor = rgb(
        parseInt(hex.substring(0, 2), 16) / 255,
        parseInt(hex.substring(2, 4), 16) / 255,
        parseInt(hex.substring(4, 6), 16) / 255
      );
    }
  }
  
  const textColor = rgb(0.2, 0.2, 0.2);
  const lightGray = rgb(0.9, 0.9, 0.9);
  
  let yPosition = height - 50;
  
  // If company logo URL is provided, add logo placeholder text (actual image embedding would require additional library)
  if (data.company_logo_url) {
    page.drawText('[LOGO]', {
      x: 50,
      y: yPosition + 10,
      size: 10,
      font: font,
      color: textColor
    });
  }
  
  // Header - Company Name/Logo & Invoice Title
  const companyName = data.company_name || data.seller_name;
  page.drawText(companyName.toUpperCase(), {
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
  page.drawText('Powered by Servie - African Services Marketplace', {
    x: 50,
    y: yPosition,
    size: 8,
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
    y: yPosition - 15,
    size: 10,
    font: boldFont,
    color: textColor
  });
  
  page.drawText('Qty', {
    x: 300,
    y: yPosition - 15,
    size: 10,
    font: boldFont,
    color: textColor
  });
  
  page.drawText('Unit Price', {
    x: 360,
    y: yPosition - 15,
    size: 10,
    font: boldFont,
    color: textColor
  });
  
  page.drawText('Total', {
    x: 450,
    y: yPosition - 15,
    size: 10,
    font: boldFont,
    color: textColor
  });
  
  yPosition -= 25;
  
  // Items
  for (const item of data.items) {
    yPosition -= 20;
    page.drawText(item.description, {
      x: 60,
      y: yPosition,
      size: 9,
      font: font,
      color: textColor,
      maxWidth: 230
    });
    
    page.drawText(item.quantity.toString(), {
      x: 300,
      y: yPosition,
      size: 9,
      font: font,
      color: textColor
    });
    
    page.drawText(`${data.currency}${item.unit_price.toFixed(2)}`, {
      x: 360,
      y: yPosition,
      size: 9,
      font: font,
      color: textColor
    });
    
    page.drawText(`${data.currency}${item.total.toFixed(2)}`, {
      x: 450,
      y: yPosition,
      size: 9,
      font: font,
      color: textColor
    });
  }
  
  yPosition -= 30;
  
  // Payment Breakdown Section
  page.drawLine({
    start: { x: 50, y: yPosition },
    end: { x: width - 50, y: yPosition },
    thickness: 1,
    color: lightGray
  });
  
  yPosition -= 30;
  
  // Calculate payment split
  const split = await calculatePaymentSplit(data.gross_amount);
  
  // Gross Sale
  page.drawText('Gross Sale:', {
    x: 350,
    y: yPosition,
    size: 10,
    font: font,
    color: textColor
  });
  page.drawText(`${data.currency}${data.gross_amount.toFixed(2)}`, {
    x: 450,
    y: yPosition,
    size: 10,
    font: boldFont,
    color: textColor
  });
  
  yPosition -= 20;
  
  // Platform Fee (9%)
  page.drawText('Platform Fee (9%):', {
    x: 350,
    y: yPosition,
    size: 10,
    font: font,
    color: textColor
  });
  page.drawText(`-${data.currency}${split.platform_commission.toFixed(2)}`, {
    x: 450,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.8, 0.2, 0.2)
  });
  
  yPosition -= 20;
  
  // PSP Fee (3.9% + $0.30)
  page.drawText('PSP Fee (3.9% + $0.30):', {
    x: 350,
    y: yPosition,
    size: 10,
    font: font,
    color: textColor
  });
  page.drawText(`-${data.currency}${split.psp_fee.toFixed(2)}`, {
    x: 450,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.8, 0.2, 0.2)
  });
  
  yPosition -= 25;
  
  // Net Payout
  page.drawRectangle({
    x: 340,
    y: yPosition - 20,
    width: 205,
    height: 30,
    color: lightGray
  });
  
  page.drawText('Net Payout:', {
    x: 350,
    y: yPosition - 10,
    size: 12,
    font: boldFont,
    color: textColor
  });
  page.drawText(`${data.currency}${split.seller_payout.toFixed(2)}`, {
    x: 450,
    y: yPosition - 10,
    size: 12,
    font: boldFont,
    color: rgb(0.2, 0.6, 0.2)
  });
  
  yPosition -= 60;
  
  // Footer
  page.drawLine({
    start: { x: 50, y: yPosition },
    end: { x: width - 50, y: yPosition },
    thickness: 1,
    color: lightGray
  });
  
  yPosition -= 20;
  
  page.drawText('This invoice serves as an official annual statement.', {
    x: 50,
    y: yPosition,
    size: 8,
    font: font,
    color: textColor
  });
  
  yPosition -= 15;
  page.drawText('Platform Fee (9%) and PSP Fee (3.9% + $0.30) are automatically deducted.', {
    x: 50,
    y: yPosition,
    size: 8,
    font: font,
    color: textColor
  });
  
  yPosition -= 15;
  page.drawText('For questions, contact support@servie.com', {
    x: 50,
    y: yPosition,
    size: 8,
    font: font,
    color: textColor
  });
  
  // Save PDF
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
