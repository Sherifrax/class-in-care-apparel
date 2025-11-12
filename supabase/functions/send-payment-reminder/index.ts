import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Checking for orders needing payment reminders...");

    // Find orders that:
    // 1. Have status 'pending_payment'
    // 2. Were created more than 24 hours ago
    // 3. Haven't had a reminder sent yet
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: pendingOrders, error: ordersError } = await supabase
      .from('orders')
      .select('id, customer_email, order_reference, session_id, total_amount, currency, created_at')
      .eq('status', 'pending_payment')
      .lt('created_at', twentyFourHoursAgo)
      .is('payment_reminder_sent_at', null);

    if (ordersError) {
      console.error("Error fetching pending orders:", ordersError);
      throw ordersError;
    }

    console.log(`Found ${pendingOrders?.length || 0} orders needing reminders`);

    if (!pendingOrders || pendingOrders.length === 0) {
      return new Response(
        JSON.stringify({ message: "No orders need payment reminders" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Send reminder emails and update records
    const results = await Promise.allSettled(
      pendingOrders.map(async (order) => {
        try {
          // Send reminder email via Resend
          const { Resend } = await import("npm:resend@4.0.0");
          const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
          const verifiedEmail = Deno.env.get("VERIFIED_EMAIL_FROM");

          const orderRef = order.order_reference || order.session_id;
          const daysSinceOrder = Math.floor(
            (Date.now() - new Date(order.created_at).getTime()) / (1000 * 60 * 60 * 24)
          );

          await resend.emails.send({
            from: verifiedEmail || "AURA Scrubs <onboarding@resend.dev>",
            to: [order.customer_email],
            subject: `Payment Reminder - Order ${orderRef}`,
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
                    .header { background: linear-gradient(135deg, #0066CC 0%, #00B4D8 100%); color: white; padding: 40px 20px; text-align: center; }
                    .content { padding: 40px 30px; }
                    .bank-details { background-color: #f8f9fa; border-left: 4px solid #0066CC; padding: 20px; margin: 20px 0; border-radius: 4px; }
                    .bank-details h3 { margin-top: 0; color: #0066CC; }
                    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e9ecef; }
                    .detail-label { font-weight: 600; color: #495057; }
                    .detail-value { color: #212529; font-family: monospace; }
                    .order-ref { font-size: 24px; font-weight: bold; color: #0066CC; background-color: #e7f3ff; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; font-family: monospace; }
                    .warning-box { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
                    .btn { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #0066CC 0%, #00B4D8 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
                    .footer { background-color: #f8f9fa; padding: 30px; text-align: center; color: #6c757d; font-size: 14px; }
                    .whatsapp-btn { background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1 style="margin: 0; font-size: 28px;">⏰ Payment Reminder</h1>
                      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Complete your AURA Scrubs order</p>
                    </div>
                    
                    <div class="content">
                      <p>Hello,</p>
                      
                      <p>We noticed you placed an order ${daysSinceOrder} day${daysSinceOrder > 1 ? 's' : ''} ago, but we haven't received your payment yet.</p>
                      
                      <div class="order-ref">${orderRef}</div>
                      
                      <div class="warning-box">
                        <strong>⚠️ Important:</strong> Your order is currently on hold. Please complete the payment to ensure we process your order as soon as possible.
                      </div>
                      
                      <h2 style="color: #0066CC;">Order Summary</h2>
                      <div class="detail-row">
                        <span class="detail-label">Order Reference:</span>
                        <span class="detail-value">${orderRef}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Total Amount:</span>
                        <span class="detail-value">${order.currency} ${order.total_amount.toFixed(2)}</span>
                      </div>
                      <div class="detail-row" style="border-bottom: none;">
                        <span class="detail-label">Order Date:</span>
                        <span class="detail-value">${new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      <div class="bank-details">
                        <h3>💳 Bank Transfer Details</h3>
                        <div class="detail-row">
                          <span class="detail-label">Account Holder:</span>
                          <span class="detail-value">Bayan Hares</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-label">Bank Name:</span>
                          <span class="detail-value">Wio Bank PJSC</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-label">Bank Address:</span>
                          <span class="detail-value">Etihad Airways Centre 5th Floor, Abu Dhabi, UAE</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-label">Account Number:</span>
                          <span class="detail-value">6696032109</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-label">IBAN:</span>
                          <span class="detail-value">AE370860000006696032109</span>
                        </div>
                        <div class="detail-row" style="border-bottom: none;">
                          <span class="detail-label">BIC/SWIFT Code:</span>
                          <span class="detail-value">WIOBAEADXXX</span>
                        </div>
                      </div>
                      
                      <p><strong>⚠️ IMPORTANT:</strong> Please include your order reference <strong>${orderRef}</strong> in the transfer notes/description so we can quickly identify your payment.</p>
                      
                      <div style="text-align: center;">
                        <a href="https://wa.me/971568988436?text=Hello, I have a question about my order ${orderRef}" class="btn whatsapp-btn" style="color: white;">
                          💬 Contact Us on WhatsApp
                        </a>
                      </div>
                      
                      <p style="margin-top: 30px; color: #6c757d; font-size: 14px;">
                        If you've already made the payment, please ignore this reminder. Your order will be processed once we verify the transaction.
                      </p>
                    </div>
                    
                    <div class="footer">
                      <p style="margin: 0 0 10px 0;"><strong>AURA Scrubs</strong></p>
                      <p style="margin: 0;">Premium Medical Uniforms</p>
                      <p style="margin: 10px 0 0 0;">WhatsApp: +971 56 898 8436</p>
                    </div>
                  </div>
                </body>
              </html>
            `,
          });

          // Update order to mark reminder as sent
          await supabase
            .from('orders')
            .update({ payment_reminder_sent_at: new Date().toISOString() })
            .eq('id', order.id);

          console.log(`Reminder sent for order ${order.id}`);
          return { success: true, orderId: order.id };
        } catch (error) {
          console.error(`Failed to send reminder for order ${order.id}:`, error);
          return { success: false, orderId: order.id, error: error.message };
        }
      })
    );

    const successful = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.filter((r) => r.status === 'rejected' || !r.value?.success).length;

    console.log(`Reminders sent: ${successful} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({
        message: `Payment reminders processed`,
        successful,
        failed,
        total: pendingOrders.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error in send-payment-reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
