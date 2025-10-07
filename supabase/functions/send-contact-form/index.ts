import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  interest: string;
  message: string;
  subscribeToUpdates: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email, phone, interest, message, subscribeToUpdates }: ContactFormRequest = await req.json();

    console.log("Processing contact form submission:", { firstName, lastName, email, interest });

    // Get admin email from environment variables
    const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL");
    if (!adminEmail) {
      throw new Error("Admin notification email not configured");
    }

    // Use verified domain or fallback to resend.dev for testing
    const rawFrom = Deno.env.get("VERIFIED_EMAIL_FROM")?.trim();
    const simpleEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameEmailRegex = /^[^<>]+<\s*[^\s@]+@[^\s@]+\.[^\s@]+\s*>$/;
    const fromEmail = (rawFrom && (simpleEmailRegex.test(rawFrom) || nameEmailRegex.test(rawFrom)))
      ? rawFrom
      : "AURA Medical Scrubs <onboarding@resend.dev>";

    // Send notification email to admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #147db8, #0c94b8); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #1a365d; margin-bottom: 20px;">Customer Information</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1a365d;">Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1a365d;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${email}</td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1a365d;">Phone:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${phone}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1a365d;">Interest:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${interest}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1a365d;">Subscribe to Updates:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${subscribeToUpdates ? 'Yes' : 'No'}</td>
            </tr>
          </table>

          <h3 style="color: #1a365d; margin-bottom: 10px;">Message:</h3>
          <div style="background: white; padding: 15px; border-left: 4px solid #147db8; border-radius: 4px;">
            <p style="margin: 0; line-height: 1.6; color: #2d3748;">${message}</p>
          </div>

          <div style="margin-top: 30px; padding: 15px; background: #e6f3ff; border-radius: 8px;">
            <p style="margin: 0; color: #1a365d; font-size: 14px;">
              <strong>Action Required:</strong> Please respond to this inquiry within 4 hours to maintain our response time commitment.
            </p>
          </div>
        </div>
        
        <div style="background: #1a365d; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 14px;">
            AURA Medical Uniforms - Admin Notification System
          </p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      subject: `New Contact Form: ${interest} - ${firstName} ${lastName}`,
      html: adminEmailHtml,
    });

    // Send confirmation email to customer
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #147db8, #0c94b8); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Contacting Us!</h1>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #1a365d;">Hi ${firstName},</h2>
          
          <p style="color: #2d3748; line-height: 1.6; margin-bottom: 20px;">
            Thank you for reaching out to AURA Medical Uniforms! We've received your inquiry about <strong>${interest}</strong> and our team will get back to you soon.
          </p>

          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1a365d; margin-top: 0;">What happens next?</h3>
            <ul style="color: #2d3748; line-height: 1.8;">
              <li>Our team will review your inquiry within 2 hours</li>
              <li>You'll receive a personalized response within 4 hours during business hours</li>
              <li>For urgent matters, feel free to use our live chat feature on our website</li>
            </ul>
          </div>

          <div style="background: #e6f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1a365d; margin-top: 0;">While you wait...</h3>
            <p style="color: #2d3748; line-height: 1.6; margin-bottom: 15px;">
              Explore our collection of premium medical uniforms designed specifically for healthcare professionals who value both style and performance.
            </p>
            <a href="https://auramedical.com/products" style="display: inline-block; background: #147db8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Browse Our Collection</a>
          </div>

          <p style="color: #2d3748; line-height: 1.6;">
            Best regards,<br>
            <strong>The AURA Medical Uniforms Team</strong>
          </p>
        </div>
        
        <div style="background: #1a365d; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0 0 10px 0; font-size: 14px;">
            AURA Medical Uniforms - Elevating Healthcare Fashion
          </p>
          <p style="color: #a0aec0; margin: 0; font-size: 12px;">
            Need immediate help? Chat with Dr. Bayan 24/7 at auramedical.com
          </p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: "We received your message - AURA Medical Uniforms",
      html: customerEmailHtml,
    });

    console.log("Contact form emails sent successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Your message has been sent successfully! We'll get back to you within 4 hours." 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-form function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Failed to send message. Please try again or contact us directly." 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);