import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Security: HTML escaping to prevent XSS attacks
function escapeHtml(unsafe: string | null | undefined): string {
  if (unsafe == null) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_FORMATS = new Set(['html', 'pdf']);

const FUNCTION_NAME = 'generate-document';
const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX_REQUESTS = 20;

// CSP header to prevent inline script execution as defense-in-depth
const HTML_SECURITY_HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; img-src 'self' data: https:;",
  'X-Content-Type-Options': 'nosniff',
};

function getClientIp(req: Request): string | null {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]?.trim() || null;
  return req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip');
}

async function enforceRateLimit(
  supabaseClient: any,
  userId: string,
): Promise<{ allowed: true } | { allowed: false; retryAfterSeconds: number }> {
  const now = Date.now();
  const windowMs = RATE_LIMIT_WINDOW_SECONDS * 1000;
  const windowStartIso = new Date(Math.floor(now / windowMs) * windowMs).toISOString();

  const { data: existing, error: readError } = await supabaseClient
    .from('edge_rate_limits')
    .select('request_count')
    .eq('user_id', userId)
    .eq('function_name', FUNCTION_NAME)
    .eq('window_start', windowStartIso)
    .maybeSingle();

  if (readError) throw readError;

  if (!existing) {
    const { error: insertError } = await supabaseClient
      .from('edge_rate_limits')
      .insert({
        user_id: userId,
        function_name: FUNCTION_NAME,
        window_start: windowStartIso,
        request_count: 1,
        last_request_at: new Date().toISOString(),
      });
    if (insertError) throw insertError;
    return { allowed: true };
  }

  const currentCount = Number(existing.request_count || 0);
  if (currentCount >= RATE_LIMIT_MAX_REQUESTS) {
    const elapsedSeconds = Math.floor((now - Date.parse(windowStartIso)) / 1000);
    return { allowed: false, retryAfterSeconds: Math.max(1, RATE_LIMIT_WINDOW_SECONDS - elapsedSeconds) };
  }

  const { error: updateError } = await supabaseClient
    .from('edge_rate_limits')
    .update({
      request_count: currentCount + 1,
      last_request_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('function_name', FUNCTION_NAME)
    .eq('window_start', windowStartIso);

  if (updateError) throw updateError;
  return { allowed: true };
}

async function logRequest(
  supabaseClient: any,
  userId: string,
  req: Request,
  statusCode: number,
  durationMs: number,
  metadata: Record<string, unknown> = {},
) {
  try {
    await supabaseClient.from('edge_request_logs').insert({
      user_id: userId,
      function_name: FUNCTION_NAME,
      method: req.method,
      status_code: statusCode,
      ip: getClientIp(req),
      user_agent: req.headers.get('user-agent'),
      duration_ms: Math.max(0, Math.floor(durationMs)),
      metadata,
    });
  } catch {
    // Never fail the main request because logging failed
  }
}

interface ProviderProfile {
  business_name: string | null;
  avatar_url: string | null;
  company_logo_url: string | null;
  brand_color_primary: string | null;
  first_name: string | null;
  last_name: string | null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startedAt = Date.now();

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Validate auth (verify_jwt=false in config; validate here)
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims();
    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = String(claimsData.claims.sub);

    // Rate limit
    try {
      const rl = await enforceRateLimit(supabaseClient, userId);
      if (!rl.allowed) {
        await logRequest(supabaseClient, userId, req, 429, Date.now() - startedAt, {
          reason: 'rate_limited',
          retry_after_seconds: rl.retryAfterSeconds,
        });
        return new Response(
          JSON.stringify({ error: 'Too many requests' }),
          {
            status: 429,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
              'Retry-After': String(rl.retryAfterSeconds),
            },
          }
        );
      }
    } catch (e) {
      await logRequest(supabaseClient, userId, req, 500, Date.now() - startedAt, {
        reason: 'rate_limit_error',
      });
      return new Response(
        JSON.stringify({ error: 'Internal error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse + validate body
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      const res = new Response(
        JSON.stringify({ error: 'Invalid request' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      await logRequest(supabaseClient, userId, req, 400, Date.now() - startedAt, { reason: 'invalid_json' });
      return res;
    }

    const documentId = String(body?.documentId || '');
    const format = String(body?.format || 'html');

    if (!UUID_REGEX.test(documentId)) {
      const res = new Response(
        JSON.stringify({ error: 'Invalid request' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      await logRequest(supabaseClient, userId, req, 400, Date.now() - startedAt, { reason: 'invalid_document_id' });
      return res;
    }

    if (!VALID_FORMATS.has(format)) {
      const res = new Response(
        JSON.stringify({ error: 'Invalid format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      await logRequest(supabaseClient, userId, req, 400, Date.now() - startedAt, { reason: 'invalid_format' });
      return res;
    }

    // Fetch document from database
    const { data: document, error: fetchError } = await supabaseClient
      .from('financial_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (fetchError || !document) {
      const res = new Response(
        JSON.stringify({ error: 'Not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      await logRequest(supabaseClient, userId, req, 404, Date.now() - startedAt, { reason: 'not_found' });
      return res;
    }

    // Fetch provider profile for branding
    let providerProfile: ProviderProfile | null = null;
    if (document.provider_id) {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('business_name, avatar_url, company_logo_url, brand_color_primary, first_name, last_name')
        .eq('id', document.provider_id)
        .single();
      providerProfile = profile;
    }

    // Generate HTML based on document type
    const html = generateDocumentHTML(document, providerProfile);

    // For PDF generation, you would integrate a PDF library here
    if (format === 'pdf') {
      const res = new Response(
        JSON.stringify({ error: 'PDF generation coming soon. Use HTML format for now.' }),
        {
          status: 501,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
      await logRequest(supabaseClient, userId, req, 501, Date.now() - startedAt, { reason: 'pdf_not_implemented' });
      return res;
    }

    const res = new Response(html, {
      status: 200,
      headers: { ...corsHeaders, ...HTML_SECURITY_HEADERS },
    });

    await logRequest(supabaseClient, userId, req, 200, Date.now() - startedAt, {
      document_id: documentId,
      format,
    });

    return res;

  } catch (error) {
    console.error('Error generating document:', error);
    return new Response(
      JSON.stringify({ error: 'Internal error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateDocumentHTML(document: any, providerProfile: ProviderProfile | null): string {
  // Use provider branding or fallback to defaults
  const brandColor = providerProfile?.brand_color_primary || '#ea384c'; // Servie red
  const companyName = providerProfile?.business_name || 
    (providerProfile?.first_name ? `${providerProfile.first_name} ${providerProfile.last_name || ''}`.trim() : null) ||
    'Servie Marketplace';
  const logoUrl = providerProfile?.company_logo_url || providerProfile?.avatar_url || null;

  const companyInfo = {
    name: companyName,
    logo: logoUrl,
    brandColor: brandColor,
    address: 'Africa',
    phone: '+000 000 0000',
    email: 'support@servie.com'
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Select template based on document type
  switch (document.document_type) {
    case 'invoice':
      return generateInvoiceTemplate(document, companyInfo, formatDate);
    case 'receipt':
      return generateReceiptTemplate(document, companyInfo, formatDate);
    case 'deposit_slip':
    case 'payment_voucher':
      return generatePayoutTemplate(document, companyInfo, formatDate);
    default:
      return generateInvoiceTemplate(document, companyInfo, formatDate);
  }
}

interface CompanyInfo {
  name: string;
  logo: string | null;
  brandColor: string;
  address: string;
  phone: string;
  email: string;
}

function generateInvoiceTemplate(doc: any, company: CompanyInfo, formatDate: Function): string {
  // Escape all user-controlled content to prevent XSS
  const safeDocNumber = escapeHtml(doc.document_number);
  const safeClientName = escapeHtml(doc.client_name);
  const safeClientEmail = escapeHtml(doc.client_email);
  const safeCurrency = escapeHtml(doc.currency);
  const safeCompanyName = escapeHtml(company.name);
  const safeCompanyAddress = escapeHtml(company.address);
  const safeCompanyEmail = escapeHtml(company.email);
  const safeBrandColor = escapeHtml(company.brandColor);
  const safeLogoUrl = company.logo ? escapeHtml(company.logo) : null;

  const logoHtml = safeLogoUrl 
    ? `<img src="${safeLogoUrl}" alt="${safeCompanyName}" style="max-height: 60px; max-width: 200px; object-fit: contain;" />`
    : `<h2 style="color: ${safeBrandColor}; margin: 0;">${safeCompanyName}</h2>`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${safeDocNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid ${safeBrandColor}; }
    .header-left { display: flex; align-items: center; gap: 16px; }
    .header-right { text-align: right; }
    .header h1 { color: ${safeBrandColor}; font-size: 28px; margin: 0; }
    .info-section { display: flex; justify-content: space-between; margin: 30px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: ${safeBrandColor}; color: white; padding: 12px; text-align: left; }
    td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    .totals { text-align: right; margin-top: 20px; }
    .total { font-size: 20px; font-weight: bold; color: ${safeBrandColor}; }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      ${logoHtml}
    </div>
    <div class="header-right">
      <h1>INVOICE</h1>
      <p>#${safeDocNumber}</p>
    </div>
  </div>
  <div class="info-section">
    <div><strong>${safeCompanyName}</strong><br>${safeCompanyAddress}<br>${safeCompanyEmail}</div>
    <div><strong>Bill To:</strong><br>${safeClientName}<br>${safeClientEmail}</div>
    <div><strong>Date:</strong> ${escapeHtml(formatDate(doc.issue_date))}<br>${doc.due_date ? `<strong>Due:</strong> ${escapeHtml(formatDate(doc.due_date))}` : ''}</div>
  </div>
  <table>
    <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
    <tbody>
      ${(doc.line_items || []).map((item: any) => `
        <tr>
          <td><strong>${escapeHtml(item.item_name)}</strong><br><small>${escapeHtml(item.description)}</small></td>
          <td>${escapeHtml(String(item.quantity))}</td>
          <td>${safeCurrency} ${Number(item.unit_price).toFixed(2)}</td>
          <td>${safeCurrency} ${Number(item.total_price).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  <div class="totals">
    <p>Subtotal: ${safeCurrency} ${Number(doc.subtotal).toFixed(2)}</p>
    ${doc.discount_amount > 0 ? `<p>Discount: -${safeCurrency} ${Number(doc.discount_amount).toFixed(2)}</p>` : ''}
    ${doc.tax_amount > 0 ? `<p>Tax: ${safeCurrency} ${Number(doc.tax_amount).toFixed(2)}</p>` : ''}
    <p class="total">TOTAL: ${safeCurrency} ${Number(doc.total_amount).toFixed(2)}</p>
  </div>
</body>
</html>
  `;
}

function generateReceiptTemplate(doc: any, company: CompanyInfo, formatDate: Function): string {
  // Escape all user-controlled content to prevent XSS
  const safeDocNumber = escapeHtml(doc.document_number);
  const safeClientName = escapeHtml(doc.client_name);
  const safeTitle = escapeHtml(doc.title);
  const safeCurrency = escapeHtml(doc.currency);
  const safeCompanyName = escapeHtml(company.name);
  const safeBrandColor = escapeHtml(company.brandColor);
  const safeLogoUrl = company.logo ? escapeHtml(company.logo) : null;

  const logoHtml = safeLogoUrl 
    ? `<img src="${safeLogoUrl}" alt="${safeCompanyName}" style="max-height: 50px; max-width: 150px; object-fit: contain; margin-bottom: 10px;" />`
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Receipt ${safeDocNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 700px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 30px; padding: 20px; background: ${safeBrandColor}; color: white; border-radius: 10px; }
    .paid { text-align: center; font-size: 32px; font-weight: bold; background: #10b981; color: white; padding: 30px; margin: 20px 0; border-radius: 10px; }
    .details { margin: 20px 0; padding: 20px; background: #f9fafb; border-radius: 8px; }
    .details p { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="header">
    ${logoHtml}
    <h1>RECEIPT</h1>
    <p>#${safeDocNumber}</p>
    <p style="font-size: 14px; margin-top: 8px;">${safeCompanyName}</p>
  </div>
  <div class="details">
    <p><strong>Date:</strong> ${escapeHtml(formatDate(doc.issue_date))}</p>
    <p><strong>Received From:</strong> ${safeClientName}</p>
    <p><strong>For:</strong> ${safeTitle}</p>
  </div>
  <div class="paid">
    PAID: ${safeCurrency} ${Number(doc.total_amount).toFixed(2)}
  </div>
</body>
</html>
  `;
}

function generatePayoutTemplate(doc: any, company: CompanyInfo, formatDate: Function): string {
  // Escape all user-controlled content to prevent XSS
  const safeDocNumber = escapeHtml(doc.document_number);
  const safeClientName = escapeHtml(doc.client_name);
  const safeCurrency = escapeHtml(doc.currency);
  const safeCompanyName = escapeHtml(company.name);
  const safeBrandColor = escapeHtml(company.brandColor);
  const safeLogoUrl = company.logo ? escapeHtml(company.logo) : null;
  
  const gross = Number(doc.total_amount);
  const platformFee = gross * 0.09; // 9% platform fee
  const pspFee = (gross * 0.039) + 0.30; // 3.9% + $0.30 PSP fee
  const net = gross - platformFee - pspFee;

  const logoHtml = safeLogoUrl 
    ? `<img src="${safeLogoUrl}" alt="${safeCompanyName}" style="max-height: 50px; max-width: 150px; object-fit: contain;" />`
    : '';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Payout ${safeDocNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; }
    .header { text-align: center; color: ${safeBrandColor}; margin-bottom: 40px; }
    .logo { margin-bottom: 16px; }
    table { width: 100%; margin: 30px 0; }
    td { padding: 15px; border-bottom: 1px solid #e5e7eb; font-size: 16px; }
    .highlight { background: #dcfce7; font-weight: bold; font-size: 20px; }
    .fee { color: #ef4444; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">${logoHtml}</div>
    <h1>PAYOUT STATEMENT</h1>
    <p>#${safeDocNumber}</p>
    <p style="font-size: 14px; margin-top: 8px;">${safeCompanyName}</p>
  </div>
  <p><strong>Seller:</strong> ${safeClientName}</p>
  <p><strong>Date:</strong> ${escapeHtml(formatDate(doc.issue_date))}</p>
  <table>
    <tr><td>Gross Sales</td><td style="text-align:right">${safeCurrency} ${gross.toFixed(2)}</td></tr>
    <tr><td>Platform Fee (9%)</td><td class="fee" style="text-align:right">-${safeCurrency} ${platformFee.toFixed(2)}</td></tr>
    <tr><td>Payment Processing (3.9% + $0.30)</td><td class="fee" style="text-align:right">-${safeCurrency} ${pspFee.toFixed(2)}</td></tr>
    <tr class="highlight"><td>NET PAYOUT</td><td style="text-align:right">${safeCurrency} ${net.toFixed(2)}</td></tr>
  </table>
</body>
</html>
  `;
}
