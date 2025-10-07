import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
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
    const orderData: OrderNotificationRequest = await req.json();

    console.log("Sending order notification email for order:", orderData.order_id);

    // Format order items for email
    const orderItemsHtml = orderData.order_items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product_name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.size}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.color || '-'}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${orderData.currency} ${item.unit_price.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${orderData.currency} ${(item.quantity * item.unit_price).toFixed(2)}</td>
      </tr>
    `).join('');

    // Format shipping address
    const addressHtml = orderData.shipping_address ? `
      <p><strong>Shipping Address:</strong><br>
      ${orderData.shipping_address.line1 || ''}<br>
      ${orderData.shipping_address.line2 ? orderData.shipping_address.line2 + '<br>' : ''}
      ${orderData.shipping_address.city || ''}, ${orderData.shipping_address.state || ''} ${orderData.shipping_address.postal_code || ''}<br>
      ${orderData.shipping_address.country || ''}
      </p>
    ` : '<p><strong>Shipping Address:</strong> <span style="color: #f59e0b; font-weight: 600;">⚠️ Not provided - Customer needs to be contacted</span></p>';

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb; margin-bottom: 20px;">🛍️ New Order Received!</h1>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin-top: 0; color: #334155;">Order Details</h2>
          <p><strong>Order ID:</strong> ${orderData.order_id}</p>
          <p><strong>Date:</strong> ${new Date(orderData.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p><strong>Customer Email:</strong> ${orderData.customer_email}</p>
          ${orderData.customer_name ? `<p><strong>Customer Name:</strong> ${orderData.customer_name}</p>` : ''}
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #334155;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; background-color: white;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="padding: 12px 8px; text-align: left; border-bottom: 2px solid #e2e8f0;">Product</th>
                <th style="padding: 12px 8px; text-align: left; border-bottom: 2px solid #e2e8f0;">Size</th>
                <th style="padding: 12px 8px; text-align: left; border-bottom: 2px solid #e2e8f0;">Color</th>
                <th style="padding: 12px 8px; text-align: center; border-bottom: 2px solid #e2e8f0;">Qty</th>
                <th style="padding: 12px 8px; text-align: right; border-bottom: 2px solid #e2e8f0;">Unit Price</th>
                <th style="padding: 12px 8px; text-align: right; border-bottom: 2px solid #e2e8f0;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
          </table>
        </div>

        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #334155;">Order Summary</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Subtotal:</span>
            <span>${orderData.currency} ${orderData.subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Delivery:</span>
            <span>${orderData.currency} ${orderData.delivery_cost.toFixed(2)}</span>
          </div>
          <hr style="margin: 12px 0; border: none; border-top: 1px solid #e2e8f0;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; color: #2563eb;">
            <span>Total:</span>
            <span>${orderData.currency} ${orderData.total_amount.toFixed(2)}</span>
          </div>
        </div>

        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #334155;">Shipping Information</h3>
          ${addressHtml}
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 14px;">
          <p>This order notification was sent automatically from your AURA Medical Scrubs store.</p>
        </div>
      </div>
    `;

    // Use verified domain or fallback to resend.dev for testing
    const rawFrom = Deno.env.get("VERIFIED_EMAIL_FROM")?.trim();
    const simpleEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameEmailRegex = /^[^<>]+<\s*[^\s@]+@[^\s@]+\.[^\s@]+\s*>$/;
    const fromAddress = (rawFrom && (simpleEmailRegex.test(rawFrom) || nameEmailRegex.test(rawFrom)))
      ? rawFrom
      : "AURA Medical Scrubs <onboarding@resend.dev>";
    
    // Admin notifications should always go to admin email (not affected by test override)
    const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL")?.trim();
    if (!adminEmail) {
      throw new Error("ADMIN_NOTIFICATION_EMAIL environment variable is not set");
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminEmail)) {
      throw new Error(`Invalid admin email format: ${adminEmail}`);
    }
    
    const emailResponse = await resend.emails.send({
      from: fromAddress,
      to: [adminEmail],
      subject: `🛍️ New Order #${orderData.order_id.slice(-8)} - ${orderData.currency} ${orderData.total_amount.toFixed(2)}`,
      html: emailHtml,
    });

    console.log("Order notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, email_id: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending order notification email:", error);
    
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