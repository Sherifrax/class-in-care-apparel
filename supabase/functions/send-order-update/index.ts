import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderUpdateRequest {
  order_id: string;
  customer_email: string;
  customer_name?: string;
  status: string;
  previous_status?: string;
  order_items: Array<{
    product_name: string;
    size: string;
    color?: string;
    quantity: number;
    unit_price: number;
  }>;
  total_amount: number;
  currency: string;
  created_at: string;
  tracking_number?: string;
  express_shipping?: boolean;
  embroidery_requested?: boolean;
  embroidery_details?: string;
}

const getStatusInfo = (status: string) => {
  const statusMap: Record<string, { title: string; message: string; color: string; icon: string; nextSteps: string[] }> = {
    processing: {
      title: "Order Being Processed",
      message: "Great news! We've started preparing your order.",
      color: "#f59e0b",
      icon: "⏳",
      nextSteps: [
        "Your order is being carefully prepared by our team",
        "Quality checks are being performed",
        "Your items will be packed and ready for shipping soon",
        "You'll receive shipping confirmation within 24-48 hours"
      ]
    },
    shipped: {
      title: "Order Shipped",
      message: "Your order is on its way to you!",
      color: "#3b82f6",
      icon: "🚚",
      nextSteps: [
        "Your order has been dispatched from our warehouse",
        "Track your package using the details below",
        "Expected delivery: {DELIVERY_TIME}",
        "You'll receive delivery confirmation once it arrives"
      ]
    },
    delivered: {
      title: "Order Delivered",
      message: "Your order has been successfully delivered!",
      color: "#10b981",
      icon: "✅",
      nextSteps: [
        "We hope you love your new AURA medical scrubs",
        "If you have any issues, please contact our support team",
        "Don't forget to leave a review to help other customers",
        "Thank you for choosing AURA Medical Scrubs!"
      ]
    },
    cancelled: {
      title: "Order Cancelled",
      message: "Your order has been cancelled as requested.",
      color: "#ef4444",
      icon: "❌",
      nextSteps: [
        "Your payment will be refunded within 3-5 business days",
        "You'll receive a separate email confirmation of the refund",
        "If you have questions, please contact our support team",
        "We'd love to serve you again in the future"
      ]
    }
  };

  return statusMap[status] || {
    title: "Order Update",
    message: "Your order status has been updated.",
    color: "#6b7280",
    icon: "📋",
    nextSteps: ["Contact our support team if you have any questions"]
  };
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: OrderUpdateRequest = await req.json();

    console.log("Sending order update email for order:", orderData.order_id, "Status:", orderData.status);

    const statusInfo = getStatusInfo(orderData.status);
    const customerName = orderData.customer_name || orderData.customer_email.split('@')[0];
    const orderNumber = orderData.order_id.slice(-8).toUpperCase();
    const deliveryTime = orderData.express_shipping ? "3 business days (Express)" : "5-7 business days (Standard)";
    
    // Replace delivery time placeholder in next steps
    statusInfo.nextSteps = statusInfo.nextSteps.map(step => 
      step.replace("{DELIVERY_TIME}", deliveryTime)
    );

    // Format order items summary
    const itemsSummary = orderData.order_items.slice(0, 3).map(item => 
      `${item.product_name} (${item.size}${item.color ? `, ${item.color}` : ''}) x${item.quantity}`
    ).join(', ') + (orderData.order_items.length > 3 ? ` +${orderData.order_items.length - 3} more` : '');

    const trackingSection = orderData.tracking_number ? `
      <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #1e40af; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">📦 Tracking Information</h4>
        <p style="color: #3730a3; margin: 0; font-size: 14px;">
          <strong>Tracking Number:</strong> <code style="background-color: white; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${orderData.tracking_number}</code>
        </p>
        <p style="color: #64748b; margin: 8px 0 0 0; font-size: 12px;">
          Use this tracking number to monitor your package's progress with the shipping carrier.
        </p>
      </div>
    ` : '';

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, ${statusInfo.color} 0%, ${statusInfo.color}dd 100%); padding: 32px 24px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 8px;">${statusInfo.icon}</div>
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">AURA</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Medical Scrubs</p>
        </div>

        <!-- Content -->
        <div style="padding: 32px 24px;">
          <!-- Status Update -->
          <div style="text-align: center; margin-bottom: 32px;">
            <h2 style="color: #0f172a; margin: 0 0 8px 0; font-size: 24px; font-weight: 600;">${statusInfo.title}</h2>
            <p style="color: #64748b; margin: 0; font-size: 16px;">Hi ${customerName}, ${statusInfo.message}</p>
          </div>

          <!-- Order Info Card -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h3 style="color: #334155; margin: 0; font-size: 18px; font-weight: 600;">Order #${orderNumber}</h3>
              <span style="background-color: ${statusInfo.color}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${orderData.status}</span>
            </div>
            <div style="color: #64748b; font-size: 14px; margin-bottom: 12px;">
              <strong>Order Date:</strong> ${new Date(orderData.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div style="color: #64748b; font-size: 14px; margin-bottom: 12px;">
              <strong>Items:</strong> ${itemsSummary}
            </div>
            <div style="color: #64748b; font-size: 14px;">
              <strong>Total:</strong> <span style="color: #2563eb; font-weight: 600;">${orderData.currency} ${orderData.total_amount.toFixed(2)}</span>
            </div>
          </div>

          ${trackingSection}

          <!-- What's Next -->
          <div style="background-color: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
            <h4 style="color: #334155; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">What's Next?</h4>
            <ul style="color: #64748b; margin: 0; padding-left: 20px; line-height: 1.8;">
              ${statusInfo.nextSteps.map(step => `<li>${step}</li>`).join('')}
            </ul>
          </div>

          <!-- Support -->
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-top: 24px; text-align: center;">
            <h4 style="color: #334155; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Need Help?</h4>
            <p style="color: #64748b; margin: 0; font-size: 14px;">
              If you have any questions about your order, our support team is here to help.
            </p>
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
    const rawFrom = Deno.env.get("VERIFIED_EMAIL_FROM")?.trim();
    const simpleEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameEmailRegex = /^[^<>]+<\s*[^\s@]+@[^\s@]+\.[^\s@]+\s*>$/;
    const fromAddress = (rawFrom && (simpleEmailRegex.test(rawFrom) || nameEmailRegex.test(rawFrom)))
      ? rawFrom
      : "AURA Medical Scrubs <onboarding@resend.dev>";
    
    // Customer updates go to the actual customer email
    const recipientEmail = orderData.customer_email;
    
    const emailResponse = await resend.emails.send({
      from: fromAddress,
      to: [recipientEmail],
      subject: `${statusInfo.icon} Order #${orderNumber} - ${statusInfo.title}`,
      html: emailHtml,
    });

    console.log("Order update email sent successfully:", emailResponse);

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
    console.error("Error sending order update email:", error);
    
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