import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailData {
  token: string;
  token_hash: string;
  redirect_to: string;
  email_action_type: string;
  site_url: string;
}

interface WebhookPayload {
  user: {
    email: string;
    id: string;
  };
  email_data: EmailData;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: WebhookPayload = await req.json();
    console.log("Received auth email request:", payload.email_data.email_action_type);

    const { user, email_data } = payload;
    const { token, token_hash, redirect_to, email_action_type } = email_data;

    // Verify webhook signature (basic implementation)
    const signature = req.headers.get("x-webhook-signature");
    if (hookSecret && signature !== hookSecret) {
      console.error("Invalid webhook signature");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let emailSubject = "";
    let emailHtml = "";

    // Determine email type and content
    if (email_action_type === "signup") {
      emailSubject = "Welcome to AURA Scrubs - Confirm Your Email";
      const confirmLink = `${Deno.env.get("SUPABASE_URL")}/auth/v1/verify?token=${token_hash}&type=signup&redirect_to=${encodeURIComponent(redirect_to || "/")}`;
      
      emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <tr>
                      <td style="padding: 48px 40px; text-align: center;">
                        <h1 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.5px;">
                          Welcome to AURA
                        </h1>
                        <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 24px; color: #6b7280;">
                          Thank you for signing up! Please confirm your email address to get started.
                        </p>
                        <a href="${confirmLink}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                          Confirm Email Address
                        </a>
                        <p style="margin: 32px 0 0 0; font-size: 14px; line-height: 20px; color: #9ca3af;">
                          Or copy and paste this link into your browser:<br>
                          <span style="color: #667eea; word-break: break-all;">${confirmLink}</span>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
                        <p style="margin: 0; font-size: 12px; line-height: 18px; color: #9ca3af; text-align: center;">
                          If you didn't create an account with AURA, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
    } else if (email_action_type === "recovery") {
      emailSubject = "Reset Your AURA Scrubs Password";
      const resetLink = `${redirect_to}?token_hash=${token_hash}&type=recovery`;
      
      emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <tr>
                      <td style="padding: 48px 40px; text-align: center;">
                        <h1 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.5px;">
                          Reset Your Password
                        </h1>
                        <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 24px; color: #6b7280;">
                          We received a request to reset your password. Click the button below to create a new password.
                        </p>
                        <a href="${resetLink}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                          Reset Password
                        </a>
                        <p style="margin: 32px 0 0 0; font-size: 14px; line-height: 20px; color: #9ca3af;">
                          Or copy and paste this link into your browser:<br>
                          <span style="color: #667eea; word-break: break-all;">${resetLink}</span>
                        </p>
                        <p style="margin: 24px 0 0 0; font-size: 14px; line-height: 20px; color: #ef4444;">
                          This link will expire in 1 hour for security reasons.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
                        <p style="margin: 0; font-size: 12px; line-height: 18px; color: #9ca3af; text-align: center;">
                          If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
    } else {
      console.error("Unknown email action type:", email_action_type);
      return new Response(JSON.stringify({ error: "Unknown email type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send email via Resend
    const fromEmail = Deno.env.get("VERIFIED_EMAIL_FROM") || "onboarding@resend.dev";
    
    const { data, error } = await resend.emails.send({
      from: `AURA Scrubs <${fromEmail}>`,
      to: [user.email],
      subject: emailSubject,
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending email:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-auth-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
