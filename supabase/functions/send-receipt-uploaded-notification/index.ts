import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReceiptNotificationRequest {
  order_id: string;
  order_reference: string;
  customer_email: string;
  total_amount: number;
  currency: string;
  created_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      order_id, 
      order_reference, 
      customer_email, 
      total_amount, 
      currency,
      created_at 
    }: ReceiptNotificationRequest = await req.json();

    console.log(`Processing receipt notification for order: ${order_reference}`);

    // Calculate days since order
    const orderDate = new Date(created_at);
    const now = new Date();
    const daysWaiting = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

    // Get admin email from env
    const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL");
    if (!adminEmail) {
      throw new Error("ADMIN_NOTIFICATION_EMAIL not configured");
    }

    // Get verified email from env or use default
    const fromEmail = Deno.env.get("VERIFIED_EMAIL_FROM") || "onboarding@resend.dev";
    const fromName = fromEmail.includes("resend.dev") ? "Aura Medical Scrubs" : fromEmail.split("@")[0];

    // Construct email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0EA5E9 0%, #14B8A6 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            .order-details { background: #f0fdf4; border: 2px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #d1fae5; }
            .label { font-weight: 600; color: #065f46; }
            .value { color: #047857; }
            .action-button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 10px 5px; font-weight: 600; }
            .action-button:hover { background: #059669; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; border-radius: 4px; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; border-radius: 0 0 12px 12px; }
            .icon { font-size: 48px; text-align: center; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="icon">💰</div>
              <h1 style="margin: 0; text-align: center;">Payment Receipt Uploaded!</h1>
            </div>
            
            <div class="content">
              <p style="font-size: 18px; color: #047857; font-weight: 600;">🎉 Good news! A customer has uploaded their payment proof.</p>
              
              <div class="order-details">
                <h2 style="margin-top: 0; color: #065f46;">Order Details</h2>
                <div class="detail-row">
                  <span class="label">Order Reference:</span>
                  <span class="value">${order_reference}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Order ID:</span>
                  <span class="value">${order_id}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Customer Email:</span>
                  <span class="value">${customer_email}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Total Amount:</span>
                  <span class="value" style="font-size: 20px; font-weight: bold;">${currency} ${total_amount.toFixed(2)}</span>
                </div>
                <div class="detail-row" style="border-bottom: none;">
                  <span class="label">Time Since Order:</span>
                  <span class="value">${daysWaiting} day${daysWaiting !== 1 ? 's' : ''}</span>
                </div>
              </div>

              ${daysWaiting > 2 ? `
              <div class="warning">
                <strong>⚠️ Attention Required:</strong> This customer has been waiting for ${daysWaiting} days. Please verify the payment promptly to avoid customer dissatisfaction.
              </div>
              ` : ''}

              <h3 style="color: #065f46; margin-top: 30px;">Action Required:</h3>
              <ol style="color: #047857;">
                <li>View and verify the payment receipt in the admin dashboard</li>
                <li>Confirm the bank transfer has been received</li>
                <li>Update the order status to "Processing" to begin fulfillment</li>
              </ol>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://ceymokfcuingwrafxpzy.supabase.co/functions/v1/admin/sales" class="action-button">
                  📊 View in Dashboard
                </a>
              </div>

              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                <strong>Pro Tip:</strong> Quick response times lead to better customer satisfaction and positive reviews! 🌟
              </p>
            </div>
            
            <div class="footer">
              <p style="margin: 0;">Aura Medical Scrubs - Admin Notification System</p>
              <p style="margin: 5px 0 0 0; font-size: 12px;">This is an automated notification. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    const { data, error } = await resend.emails.send({
      from: fromEmail.includes("resend.dev") ? `${fromName} <${fromEmail}>` : fromEmail,
      to: [adminEmail],
      subject: `💰 Payment Receipt Uploaded - Order ${order_reference}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend API error:", error);
      throw error;
    }

    console.log("Receipt notification email sent successfully:", data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Admin notified successfully",
        email_id: data?.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending receipt notification:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send notification",
        details: error 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
