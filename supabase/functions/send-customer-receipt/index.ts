import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CustomerReceiptRequest {
  order_id: string;
  customer_email: string;
  customer_name?: string;
  shipping_address: any;
  order_items: Array<{
    product_name: string;
    size: string;
    color?: string;
    quantity: number;
    unit_price: number;
  }>;
  subtotal: number;
  delivery_cost: number;
  total_amount: number;
  currency: string;
  created_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: CustomerReceiptRequest = await req.json();

    console.log("Sending customer receipt for order:", orderData.order_id);

    // Format order items for email
    const orderItemsHtml = orderData.order_items.map(item => `
      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9;">${item.product_name}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9; text-align: center;">${item.size}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9; text-align: center;">${item.color || '-'}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9; text-align: right;">${orderData.currency} ${item.unit_price.toFixed(2)}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 600;">${orderData.currency} ${(item.quantity * item.unit_price).toFixed(2)}</td>
      </tr>
    `).join('');

    // Format shipping address
    const addressHtml = orderData.shipping_address ? `
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin-top: 16px;">
        <h4 style="margin: 0 0 12px 0; color: #334155; font-size: 16px;">Shipping Address</h4>
        <p style="margin: 0; color: #64748b; line-height: 1.5;">
          ${orderData.shipping_address.line1 || ''}<br>
          ${orderData.shipping_address.line2 ? orderData.shipping_address.line2 + '<br>' : ''}
          ${orderData.shipping_address.city || ''}, ${orderData.shipping_address.state || ''} ${orderData.shipping_address.postal_code || ''}<br>
          ${orderData.shipping_address.country || ''}
        </p>
      </div>
    ` : '';

    const customerName = orderData.customer_name || orderData.customer_email.split('@')[0];
    const orderNumber = orderData.order_id.slice(-8).toUpperCase();

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 32px 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">AURA</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Medical Scrubs</p>
        </div>

        <!-- Content -->
        <div style="padding: 32px 24px;">
          <!-- Greeting -->
          <div style="text-align: center; margin-bottom: 32px;">
            <h2 style="color: #0f172a; margin: 0 0 8px 0; font-size: 24px; font-weight: 600;">Thank you for your order!</h2>
            <p style="color: #64748b; margin: 0; font-size: 16px;">Hi ${customerName}, your order has been confirmed and is being processed.</p>
          </div>

          <!-- Order Summary Card -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h3 style="color: #334155; margin: 0; font-size: 18px; font-weight: 600;">Order #${orderNumber}</h3>
              <span style="background-color: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Confirmed</span>
            </div>
            <p style="color: #64748b; margin: 0; font-size: 14px;">
              Order Date: ${new Date(orderData.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          <!-- Order Items -->
          <div style="margin-bottom: 24px;">
            <h3 style="color: #334155; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Order Items</h3>
            <div style="background-color: white; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f8fafc;">
                    <th style="padding: 16px 8px; text-align: left; color: #374151; font-weight: 600; font-size: 14px;">Product</th>
                    <th style="padding: 16px 8px; text-align: center; color: #374151; font-weight: 600; font-size: 14px;">Size</th>
                    <th style="padding: 16px 8px; text-align: center; color: #374151; font-weight: 600; font-size: 14px;">Color</th>
                    <th style="padding: 16px 8px; text-align: center; color: #374151; font-weight: 600; font-size: 14px;">Qty</th>
                    <th style="padding: 16px 8px; text-align: right; color: #374151; font-weight: 600; font-size: 14px;">Price</th>
                    <th style="padding: 16px 8px; text-align: right; color: #374151; font-weight: 600; font-size: 14px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderItemsHtml}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Order Total -->
          <div style="background-color: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #64748b;">Subtotal:</span>
              <span style="color: #374151; font-weight: 500;">${orderData.currency} ${orderData.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #64748b;">Delivery:</span>
              <span style="color: #374151; font-weight: 500;">${orderData.currency} ${orderData.delivery_cost.toFixed(2)}</span>
            </div>
            <hr style="margin: 16px 0; border: none; border-top: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #0f172a; font-weight: 600; font-size: 18px;">Total:</span>
              <span style="color: #2563eb; font-weight: 700; font-size: 18px;">${orderData.currency} ${orderData.total_amount.toFixed(2)}</span>
            </div>
          </div>

          ${addressHtml}

          <!-- What's Next -->
          <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin-top: 24px;">
            <h4 style="color: #0c4a6e; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">What's Next?</h4>
            <ul style="color: #0369a1; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>We'll process your order within 24 hours</li>
              <li>You'll receive shipping confirmation with tracking details</li>
              <li>Standard delivery takes 3-5 business days</li>
              <li>Contact us if you have any questions</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; margin: 0 0 8px 0; font-size: 14px;">Thank you for choosing AURA Medical Scrubs</p>
          <p style="color: #94a3b8; margin: 0; font-size: 12px;">Professional scrubs for healthcare professionals</p>
        </div>
      </div>
    `;

    // Use verified domain or fallback to resend.dev for testing
    const fromAddress = Deno.env.get("VERIFIED_EMAIL_FROM") || "AURA Medical Scrubs <onboarding@resend.dev>";

    // Customer receipts go to the actual customer email
    const recipientEmail = orderData.customer_email;
    
    const emailResponse = await resend.emails.send({
      from: fromAddress,
      to: [recipientEmail],
      subject: `✅ Order Confirmation #${orderNumber} - ${orderData.currency} ${orderData.total_amount.toFixed(2)}`,
      html: emailHtml,
    });

    console.log("Customer receipt email sent successfully:", emailResponse);

    // Check for domain verification error
    if (emailResponse.error && emailResponse.error.message?.includes("verify a domain")) {
      console.warn("Domain verification required. Please verify your domain at https://resend.com/domains");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Email delivery requires domain verification. Please verify your domain at https://resend.com/domains and set VERIFIED_EMAIL_FROM environment variable.",
        domain_verification_required: true 
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    return new Response(JSON.stringify({ success: true, email_id: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending customer receipt email:", error);
    
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);