import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    const {
      cartItems,
      subtotal,
      deliveryCost,
      embroideryCost,
      embroideryRequested,
      embroideryDetails,
      expressShipping,
      totalAmount,
      currency = "AED",
      shippingAddress
    } = await req.json();

    console.log("Creating bank transfer order for user:", user.id);

    // Validate cart items stock availability
    for (const item of cartItems) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('stock_quantity, track_stock')
        .eq('id', item.product_id)
        .single();

      if (productError) {
        throw new Error(`Product not found: ${item.product_id}`);
      }

      if (product.track_stock && product.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${item.name}`);
      }
    }

    // Generate order reference
    const { data: orderReference } = await supabase
      .rpc('generate_order_reference');

    // Calculate payment deadline (24 hours from now)
    const paymentDeadline = new Date();
    paymentDeadline.setHours(paymentDeadline.getHours() + 24);

    // Create order with pending_payment status
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        customer_email: user.email,
        subtotal,
        delivery_cost: deliveryCost,
        embroidery_cost: embroideryCost || 0,
        embroidery_requested: embroideryRequested || false,
        embroidery_details: embroideryDetails || null,
        express_shipping: expressShipping || false,
        total_amount: totalAmount,
        currency,
        status: 'pending_payment', // Awaiting bank transfer
        session_id: `bank_transfer_${Date.now()}_${user.id.slice(0, 8)}`, // Unique reference
        order_reference: orderReference, // Human-friendly reference
        shipping_address: shippingAddress, // Store delivery address
        payment_deadline: paymentDeadline.toISOString() // Add payment deadline
      })
      .select()
      .single();

    if (orderError) throw orderError;

    console.log("Order created:", order.id);

    // Create order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.name,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      unit_price: parseFloat(item.price)
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    console.log("Order items created");

    // Get full order with items for email
    const { data: fullOrder } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', order.id)
      .single();

    // Send customer receipt with bank transfer details
    try {
      await supabase.functions.invoke('send-customer-receipt', {
        body: {
          order_id: order.id,
          customer_email: user.email,
          customer_name: user.user_metadata?.full_name,
          shipping_address: order.shipping_address,
          order_items: fullOrder?.order_items || orderItems,
          subtotal,
          delivery_cost: deliveryCost,
          embroidery_cost: embroideryCost || 0,
          embroidery_requested: embroideryRequested || false,
          embroidery_details: embroideryDetails || null,
          express_shipping: expressShipping || false,
          total_amount: totalAmount,
          currency,
          created_at: order.created_at,
          payment_method: 'bank_transfer'
        }
      });
      console.log("Customer receipt sent");
    } catch (emailError) {
      console.error("Error sending customer email:", emailError);
    }

    // Send admin notification
    try {
      await supabase.functions.invoke('send-order-notification', {
        body: {
          order_id: order.id,
          customer_email: user.email,
          customer_name: user.user_metadata?.full_name,
          shipping_address: order.shipping_address,
          order_items: fullOrder?.order_items || orderItems,
          subtotal,
          delivery_cost: deliveryCost,
          embroidery_cost: embroideryCost || 0,
          embroidery_requested: embroideryRequested || false,
          embroidery_details: embroideryDetails || null,
          express_shipping: expressShipping || false,
          total_amount: totalAmount,
          currency,
          created_at: order.created_at,
          payment_method: 'bank_transfer'
        }
      });
      console.log("Admin notification sent");
    } catch (emailError) {
      console.error("Error sending admin email:", emailError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        order_reference: order.order_reference || order.session_id
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error creating bank transfer order:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
