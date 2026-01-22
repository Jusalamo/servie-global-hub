import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_FORMATS = new Set(['html', 'pdf']);

const FUNCTION_NAME = 'generate-document';
const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX_REQUESTS = 20;

function getClientIp(req: Request): string | null {
  // Common headers set by proxies/CDNs
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
      // If rate limiting fails (e.g. RLS misconfig), fail closed for safety.
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
      // Generic response prevents enumeration and avoids leaking DB details
      const res = new Response(
        JSON.stringify({ error: 'Not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      await logRequest(supabaseClient, userId, req, 404, Date.now() - startedAt, { reason: 'not_found' });
      return res;
    }

    // Generate HTML based on document type
    const html = generateDocumentHTML(document);

    // For PDF generation, you would integrate a PDF library here
    // For now, we return HTML
    if (format === 'pdf') {
      // TODO: Integrate PDF generation library (e.g., puppeteer-core)
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
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
    });

    await logRequest(supabaseClient, userId, req, 200, Date.now() - startedAt, {
      document_id: documentId,
      format,
    });

    return res;

  } catch (error) {
    console.error('Error generating document:', error);
    // best-effort logging: we may not have a supabase client / user id in this catch
    return new Response(
      JSON.stringify({ error: 'Internal error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateDocumentHTML(document: any): string {
  const companyInfo = {
    name: 'Servie Marketplace',
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

function generateInvoiceTemplate(doc: any, company: any, formatDate: Function): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${doc.document_number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 40px; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #6366f1; }
    .header h1 { color: #6366f1; font-size: 32px; }
    .info-section { display: flex; justify-content: space-between; margin: 30px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #6366f1; color: white; padding: 12px; text-align: left; }
    td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    .totals { text-align: right; margin-top: 20px; }
    .total { font-size: 20px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <h1>INVOICE</h1>
    <p>#${doc.document_number}</p>
  </div>
  <div class="info-section">
    <div><strong>${company.name}</strong><br>${company.address}<br>${company.email}</div>
    <div><strong>Bill To:</strong><br>${doc.client_name}<br>${doc.client_email || ''}</div>
    <div><strong>Date:</strong> ${formatDate(doc.issue_date)}<br>${doc.due_date ? `<strong>Due:</strong> ${formatDate(doc.due_date)}` : ''}</div>
  </div>
  <table>
    <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
    <tbody>
      ${doc.line_items.map((item: any) => `
        <tr>
          <td><strong>${item.item_name}</strong><br><small>${item.description || ''}</small></td>
          <td>${item.quantity}</td>
          <td>${doc.currency} ${Number(item.unit_price).toFixed(2)}</td>
          <td>${doc.currency} ${Number(item.total_price).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  <div class="totals">
    <p>Subtotal: ${doc.currency} ${Number(doc.subtotal).toFixed(2)}</p>
    ${doc.discount_amount > 0 ? `<p>Discount: -${doc.currency} ${Number(doc.discount_amount).toFixed(2)}</p>` : ''}
    ${doc.tax_amount > 0 ? `<p>Tax: ${doc.currency} ${Number(doc.tax_amount).toFixed(2)}</p>` : ''}
    <p class="total">TOTAL: ${doc.currency} ${Number(doc.total_amount).toFixed(2)}</p>
  </div>
</body>
</html>
  `;
}

function generateReceiptTemplate(doc: any, company: any, formatDate: Function): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Receipt ${doc.document_number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 700px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 30px; padding: 20px; background: #8b5cf6; color: white; border-radius: 10px; }
    .paid { text-align: center; font-size: 32px; font-weight: bold; background: #10b981; color: white; padding: 30px; margin: 20px 0; border-radius: 10px; }
    .details { margin: 20px 0; padding: 20px; background: #f9fafb; border-radius: 8px; }
    .details p { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="header">
    <h1>RECEIPT</h1>
    <p>#${doc.document_number}</p>
  </div>
  <div class="details">
    <p><strong>Date:</strong> ${formatDate(doc.issue_date)}</p>
    <p><strong>Received From:</strong> ${doc.client_name}</p>
    <p><strong>For:</strong> ${doc.title}</p>
  </div>
  <div class="paid">
    PAID: ${doc.currency} ${Number(doc.total_amount).toFixed(2)}
  </div>
</body>
</html>
  `;
}

function generatePayoutTemplate(doc: any, company: any, formatDate: Function): string {
  const gross = Number(doc.total_amount);
  const commission = gross * 0.05;
  const net = gross - commission;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Payout ${doc.document_number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; }
    .header { text-align: center; color: #10b981; margin-bottom: 40px; }
    table { width: 100%; margin: 30px 0; }
    td { padding: 15px; border-bottom: 1px solid #e5e7eb; font-size: 16px; }
    .highlight { background: #dcfce7; font-weight: bold; font-size: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>PAYOUT STATEMENT</h1>
    <p>#${doc.document_number}</p>
  </div>
  <p><strong>Seller:</strong> ${doc.client_name}</p>
  <p><strong>Date:</strong> ${formatDate(doc.issue_date)}</p>
  <table>
    <tr><td>Gross Sales</td><td style="text-align:right">${doc.currency} ${gross.toFixed(2)}</td></tr>
    <tr><td>Platform Commission (5%)</td><td style="text-align:right; color:#ef4444">-${doc.currency} ${commission.toFixed(2)}</td></tr>
    <tr class="highlight"><td>NET PAYOUT</td><td style="text-align:right">${doc.currency} ${net.toFixed(2)}</td></tr>
  </table>
</body>
</html>
  `;
}
