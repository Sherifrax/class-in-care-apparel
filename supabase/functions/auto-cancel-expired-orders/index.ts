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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Starting auto-cancellation of expired orders...");

    // Find all pending_payment orders where payment_deadline has passed
    // and no receipt has been uploaded
    const { data: expiredOrders, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'pending_payment')
      .lt('payment_deadline', new Date().toISOString())
      .is('payment_receipt_url', null);

    if (fetchError) {
      console.error("Error fetching expired orders:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${expiredOrders?.length || 0} expired orders`);

    const cancelledOrders = [];
    
    // Cancel each expired order
    for (const order of expiredOrders || []) {
      console.log(`Cancelling order ${order.id} - ${order.order_reference}`);
      
      // Update order status to cancelled
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (updateError) {
        console.error(`Error cancelling order ${order.id}:`, updateError);
        continue;
      }

      // Send cancellation email to customer
      try {
        await supabase.functions.invoke('send-order-cancellation', {
          body: {
            order_id: order.id,
            customer_email: order.customer_email,
            order_reference: order.order_reference,
            total_amount: order.total_amount,
            currency: order.currency
          }
        });
        console.log(`Cancellation email sent for order ${order.id}`);
      } catch (emailError) {
        console.error(`Error sending cancellation email for order ${order.id}:`, emailError);
      }

      cancelledOrders.push(order.id);
    }

    console.log(`Auto-cancellation complete. Cancelled ${cancelledOrders.length} orders`);

    return new Response(
      JSON.stringify({
        success: true,
        cancelled_count: cancelledOrders.length,
        cancelled_orders: cancelledOrders
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error in auto-cancel-expired-orders:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});