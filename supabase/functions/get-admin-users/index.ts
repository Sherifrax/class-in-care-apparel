import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user is authenticated
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleData) {
      console.error('Role check error:', roleError);
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch all profiles
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('id, full_name, phone, avatar_url, created_at')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Profiles fetch error:', profilesError);
      throw profilesError;
    }

    // Fetch all user roles
    const { data: userRoles, error: rolesError } = await supabaseClient
      .from('user_roles')
      .select('user_id, role');

    if (rolesError) {
      console.error('Roles fetch error:', rolesError);
      throw rolesError;
    }

    // Fetch auth users data (emails and last sign in) using admin API
    const { data: { users: authUsers }, error: authUsersError } = await supabaseClient.auth.admin.listUsers();

    if (authUsersError) {
      console.error('Auth users fetch error:', authUsersError);
      throw authUsersError;
    }

    // Combine all data
    const usersWithDetails = profiles.map(profile => {
      const authUser = authUsers.find(au => au.id === profile.id);
      const userRole = userRoles.find(ur => ur.user_id === profile.id);
      
      // Check if user is banned from metadata
      const banned = authUser?.user_metadata?.banned === true;
      const banReason = authUser?.user_metadata?.ban_reason || null;
      
      return {
        id: profile.id,
        full_name: profile.full_name || 'Unknown',
        email: authUser?.email || '',
        phone: profile.phone || '',
        avatar_url: profile.avatar_url || '',
        created_at: profile.created_at,
        last_sign_in_at: authUser?.last_sign_in_at || null,
        email_confirmed_at: authUser?.email_confirmed_at || null,
        role: userRole?.role || 'customer',
        is_admin: userRole?.role === 'admin',
        banned: banned,
        ban_reason: banReason
      };
    });

    // Calculate statistics
    const stats = {
      total_users: usersWithDetails.length,
      total_admins: usersWithDetails.filter(u => u.is_admin).length,
      total_customers: usersWithDetails.filter(u => !u.is_admin).length,
      recent_signups: usersWithDetails.filter(u => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return new Date(u.created_at) > sevenDaysAgo;
      }).length
    };

    return new Response(
      JSON.stringify({ users: usersWithDetails, stats }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in get-admin-users function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
