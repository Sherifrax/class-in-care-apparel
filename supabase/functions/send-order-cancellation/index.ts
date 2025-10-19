import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      order_id, 
      customer_email, 
      order_reference, 
      total_amount,
      currency = 'AED'
    } = await req.json();

    console.log(`Sending cancellation email for order ${order_id} to ${customer_email}`);

    const verifiedFrom = Deno.env.get("VERIFIED_EMAIL_FROM") || "AURA Scrubs <onboarding@resend.dev>";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Cancelled - AURA Scrubs</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .alert-box { background: #fee; border-left: 4px solid #f44; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .info-box { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">❌ Order Cancelled</h1>
          </div>
          <div class="content">
            <div class="alert-box">
              <h2 style="margin-top: 0; color: #c00;">Payment Deadline Expired</h2>
              <p>Your order has been automatically cancelled because payment was not received within 24 hours.</p>
            </div>

            <h3>Order Details</h3>
            <p><strong>Order Reference:</strong> ${order_reference || order_id.slice(0, 8)}</p>
            <p><strong>Order Amount:</strong> ${currency} ${total_amount.toFixed(2)}</p>

            <div class="info-box">
              <h3 style="margin-top: 0;">What Happens Next?</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Your order has been cancelled and removed from our system</li>
                <li>No further action is required from you</li>
                <li>If you still want these items, you can place a new order</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://ceymokfcuingwrafxpzy.supabase.co/products" class="button">
                Shop Again
              </a>
            </div>

            <div class="info-box">
              <h3 style="margin-top: 0;">💡 Tips for Next Time</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Complete your bank transfer within 24 hours</li>
                <li>Upload your payment receipt immediately after transfer</li>
                <li>We verify payments within 24-48 hours</li>
              </ul>
            </div>

            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            
            <div class="footer">
              <p><strong>AURA Scrubs</strong><br>
              Premium Medical Wear<br>
              Need help? Contact us at support@aurascrubs.com</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: verifiedFrom,
      to: [customer_email],
      subject: `Order Cancelled - Payment Deadline Expired (${order_reference || order_id.slice(0, 8)})`,
      html: emailHtml,
    });

    console.log("Cancellation email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, email_id: emailResponse.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error sending cancellation email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});