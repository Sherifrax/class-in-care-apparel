import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";
import { Resend } from "npm:resend@4.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import React from "npm:react@18.3.1";
import { ConfirmSignupEmail } from "./_templates/confirm-signup.tsx";
import { ResetPasswordEmail } from "./_templates/reset-password.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);
const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET") as string;
const verifiedEmailFrom = Deno.env.get("VERIFIED_EMAIL_FROM") || "AURA Scrubs <noreply@aurascrubs.com>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);
    const wh = new Webhook(hookSecret);

    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = wh.verify(payload, headers) as {
      user: { email: string };
      email_data: {
        token: string;
        token_hash: string;
        redirect_to: string;
        email_action_type: string;
      };
    };

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    let html = "";
    let subject = "";

    // Generate appropriate email based on action type
    if (email_action_type === "signup") {
      subject = "Welcome to AURA Scrubs - Confirm Your Email";
      html = await renderAsync(
        React.createElement(ConfirmSignupEmail, {
          supabase_url: supabaseUrl,
          token_hash,
          email_action_type,
          redirect_to,
        })
      );
    } else if (email_action_type === "recovery") {
      subject = "Reset Your AURA Scrubs Password";
      html = await renderAsync(
        React.createElement(ResetPasswordEmail, {
          supabase_url: supabaseUrl,
          token_hash,
          email_action_type,
          redirect_to,
        })
      );
    } else {
      throw new Error(`Unsupported email action type: ${email_action_type}`);
    }

    console.log(`Sending ${email_action_type} email to ${user.email}`);

    const { data, error } = await resend.emails.send({
      from: verifiedEmailFrom,
      to: [user.email],
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-auth-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: error.code === 401 ? 401 : 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
