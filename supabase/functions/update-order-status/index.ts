import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { order_id, status } = await req.json();

    if (!order_id || !status) {
      throw new Error("Order ID and status are required");
    }

    // Initialize Supabase with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Update order status
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ 
        status: status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', order_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }

    console.log('Order status updated successfully:', data);

    // Send customer update email if status changed meaningfully
    const meaningfulStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (meaningfulStatuses.includes(status) && data.customer_email) {
      try {
        // Fetch order items for the email
        const { data: orderItems } = await supabaseAdmin
          .from('order_items')
          .select('*')
          .eq('order_id', order_id);

        const orderUpdateData = {
          order_id: data.id,
          customer_email: data.customer_email,
          customer_name: null, // Will be resolved from email
          status: status,
          order_items: orderItems || [],
          total_amount: data.total_amount,
          currency: data.currency || 'AED',
          created_at: data.created_at,
        };

        const updateEmailResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-order-update`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderUpdateData),
        });

        if (!updateEmailResponse.ok) {
          console.error('Failed to send customer update email:', await updateEmailResponse.text());
        } else {
          console.log('Customer update email sent successfully');
        }
      } catch (emailError) {
        console.error('Error sending customer update email:', emailError);
        // Don't fail the update if email fails
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      order: data 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Update order status error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});