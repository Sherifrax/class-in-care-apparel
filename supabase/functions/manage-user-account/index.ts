import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  action: 'reset-password' | 'ban-user' | 'unban-user' | 'send-magic-link';
  userId: string;
  reason?: string;
  notifyUser?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client with user's token to verify they're authenticated
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verify the user is authenticated
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if user is admin
    const { data: adminCheck, error: adminError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (adminError || !adminCheck) {
      throw new Error('User is not an admin');
    }

    // Create admin client for privileged operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const body: RequestBody = await req.json();
    const { action, userId, reason, notifyUser } = body;

    // Prevent admin from performing actions on themselves (except reset password)
    if (userId === user.id && action !== 'reset-password') {
      throw new Error('Cannot perform this action on yourself');
    }

    let result;

    switch (action) {
      case 'ban-user': {
        // Update user metadata to mark as banned
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          {
            user_metadata: {
              banned: true,
              ban_reason: reason || 'No reason provided',
              banned_at: new Date().toISOString(),
              banned_by: user.id
            },
            // Optionally ban the user from authentication
            ban_duration: 'none' // Permanent ban
          }
        );

        if (error) throw error;

        // Log the action
        await supabaseAdmin.from('admin_actions').insert({
          admin_id: user.id,
          target_user_id: userId,
          action_type: 'ban_user',
          reason: reason || null
        });

        // Send notification email if requested
        if (notifyUser) {
          const { data: targetUser } = await supabaseAdmin.auth.admin.getUserById(userId);
          if (targetUser?.user?.email) {
            await supabaseAdmin.functions.invoke('send-order-notification', {
              body: {
                to: targetUser.user.email,
                subject: 'Account Suspended',
                html: `
                  <h1>Account Suspended</h1>
                  <p>Your account has been suspended by an administrator.</p>
                  ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
                  <p>If you believe this is a mistake, please contact support.</p>
                `
              }
            });
          }
        }

        result = { success: true, message: 'User banned successfully', data };
        break;
      }

      case 'unban-user': {
        // Remove ban from user metadata
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          {
            user_metadata: {
              banned: false,
              ban_reason: null,
              unbanned_at: new Date().toISOString(),
              unbanned_by: user.id
            },
            ban_duration: '0s' // Remove ban
          }
        );

        if (error) throw error;

        // Log the action
        await supabaseAdmin.from('admin_actions').insert({
          admin_id: user.id,
          target_user_id: userId,
          action_type: 'unban_user'
        });

        // Send welcome back email if requested
        if (notifyUser) {
          const { data: targetUser } = await supabaseAdmin.auth.admin.getUserById(userId);
          if (targetUser?.user?.email) {
            await supabaseAdmin.functions.invoke('send-order-notification', {
              body: {
                to: targetUser.user.email,
                subject: 'Account Reactivated',
                html: `
                  <h1>Welcome Back!</h1>
                  <p>Your account has been reactivated.</p>
                  <p>You can now log in and access all features.</p>
                `
              }
            });
          }
        }

        result = { success: true, message: 'User unbanned successfully', data };
        break;
      }

      case 'reset-password': {
        // Generate password reset link
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
          type: 'recovery',
          email: (await supabaseAdmin.auth.admin.getUserById(userId)).data.user?.email || ''
        });

        if (error) throw error;

        // Log the action
        await supabaseAdmin.from('admin_actions').insert({
          admin_id: user.id,
          target_user_id: userId,
          action_type: 'reset_password'
        });

        result = { success: true, message: 'Password reset initiated', data };
        break;
      }

      case 'send-magic-link': {
        // Get user's email
        const { data: targetUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId);
        
        if (getUserError || !targetUser?.user?.email) {
          throw new Error('Could not retrieve user email');
        }

        // Generate magic link (email link)
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
          type: 'magiclink',
          email: targetUser.user.email
        });

        if (error) throw error;

        // Log the action
        await supabaseAdmin.from('admin_actions').insert({
          admin_id: user.id,
          target_user_id: userId,
          action_type: 'send_magic_link'
        });

        result = { success: true, message: 'Magic link sent successfully', data };
        break;
      }

      default:
        throw new Error('Invalid action');
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error in manage-user-account function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
