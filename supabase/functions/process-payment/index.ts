import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id } = await req.json();

    if (!session_id) {
      throw new Error("Session ID is required");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Initialize Supabase
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items']
    });

    if (session.payment_status !== 'paid') {
      throw new Error("Payment not completed");
    }

    // Check if order already exists
    const { data: existingOrder } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('session_id', session_id)
      .single();

    if (existingOrder) {
      return new Response(JSON.stringify({ 
        message: "Order already processed",
        order_id: existingOrder.id 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Parse cart items from metadata
    const cartItems = JSON.parse(session.metadata?.cart_items || '[]');
    
    // Validate stock availability before processing order
    console.log('Validating stock for cart items:', cartItems);
    for (const item of cartItems) {
      const { data: stockCheck, error: stockError } = await supabaseAdmin
        .rpc('check_stock_availability', {
          p_product_id: item.product_id,
          p_quantity: item.quantity
        });
      
      if (stockError) {
        console.error('Stock check error:', stockError);
        throw new Error(`Stock validation failed for ${item.name}`);
      }
      
      if (!stockCheck) {
        console.error('Insufficient stock for item:', item);
        throw new Error(`Insufficient stock for ${item.name}. Please update your cart.`);
      }
    }
    console.log('Stock validation passed for all items');
    
    // Calculate amounts with proper price parsing
    const subtotal = cartItems.reduce((sum: number, item: any) => {
      const price = item.unit_price || parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
      return sum + (price * item.quantity);
    }, 0);
    
    const deliveryCost = 25;
    const totalAmount = subtotal + deliveryCost;

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: session.metadata?.user_id !== 'guest' ? session.metadata?.user_id : null,
        session_id: session_id,
        total_amount: totalAmount,
        subtotal: subtotal,
        delivery_cost: deliveryCost,
        currency: 'AED',
        status: 'processing',
        customer_email: session.customer_email || session.customer_details?.email,
        shipping_address: session.shipping_details?.address ? {
          line1: session.shipping_details.address.line1,
          line2: session.shipping_details.address.line2,
          city: session.shipping_details.address.city,
          state: session.shipping_details.address.state,
          postal_code: session.shipping_details.address.postal_code,
          country: session.shipping_details.address.country,
        } : null,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    // Create order items - this will trigger stock reduction
    for (const item of cartItems) {
      const unitPrice = item.unit_price || parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
      const { error: itemError } = await supabaseAdmin
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.name,
          size: item.size,
          quantity: item.quantity,
          unit_price: unitPrice,
        });

      if (itemError) {
        console.error('Error creating order item:', itemError);
        throw itemError;
      }
    }

    console.log('Order processed successfully:', order.id);

    return new Response(JSON.stringify({ 
      success: true,
      order_id: order.id,
      message: "Order processed successfully" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});