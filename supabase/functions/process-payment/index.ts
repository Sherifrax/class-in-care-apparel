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

    // Determine shipping address from session
    const shippingAddress = session.shipping_details?.address ?? session.customer_details?.address;
    console.log('Shipping address source:', 
      session.shipping_details?.address ? 'shipping_details' : 
      session.customer_details?.address ? 'customer_details' : 'none');

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

    // Parse cart items from compact metadata format: "prod_id:size:color:qty,prod_id:size:color:qty"
    const cartItemsCompact = session.metadata?.cart_items || '';
    const itemEntries = cartItemsCompact.split(',').filter(Boolean);
    
    console.log('Fetching product details from database for items:', itemEntries);
    
    // Fetch full product details from database
    const cartItems = [];
    for (const entry of itemEntries) {
      const [productId, size, color, quantity] = entry.split(':');
      
      // Fetch product details
      const { data: product, error: productError } = await supabaseAdmin
        .from('products')
        .select('id, name, price')
        .eq('id', productId)
        .single();
      
      if (productError || !product) {
        console.error('Error fetching product:', productError);
        throw new Error(`Product not found: ${productId}`);
      }
      
      cartItems.push({
        product_id: productId,
        name: product.name,
        size: size,
        color: color || null,
        quantity: parseInt(quantity),
        price: product.price,
        unit_price: parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0,
      });
    }
    
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
    
    // Extract embroidery and shipping details from metadata
    const embroideryRequested = session.metadata?.embroidery_requested === 'true';
    const embroideryDetails = session.metadata?.embroidery_details || null;
    const embroideryCost = parseFloat(session.metadata?.embroidery_cost || '0');
    const expressShipping = session.metadata?.express_shipping === 'true';
    const deliveryCost = parseFloat(session.metadata?.delivery_cost || '25');
    const totalAmount = subtotal + deliveryCost + embroideryCost;

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: session.metadata?.user_id !== 'guest' ? session.metadata?.user_id : null,
        session_id: session_id,
        total_amount: totalAmount,
        subtotal: subtotal,
        delivery_cost: deliveryCost,
        embroidery_requested: embroideryRequested,
        embroidery_details: embroideryDetails,
        embroidery_cost: embroideryCost,
        express_shipping: expressShipping,
        currency: 'AED',
        status: 'processing',
        customer_email: session.customer_email || session.customer_details?.email,
        shipping_address: shippingAddress ? {
          line1: shippingAddress.line1,
          line2: shippingAddress.line2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.postal_code,
          country: shippingAddress.country,
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
          color: item.color || null,
          quantity: item.quantity,
          unit_price: unitPrice,
        });

      if (itemError) {
        console.error('Error creating order item:', itemError);
        throw itemError;
      }
    }

    console.log('Order processed successfully:', order.id);

    // Send emails (admin notification and customer receipt)
    try {
      const emailData = {
        order_id: order.id,
        customer_email: session.customer_email || session.customer_details?.email || 'Guest',
        customer_name: session.customer_details?.name,
        shipping_address: order.shipping_address,
        order_items: cartItems.map((item: any) => ({
          product_name: item.name,
          size: item.size,
          color: item.color || null,
          quantity: item.quantity,
          unit_price: item.unit_price || parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0,
        })),
        subtotal: subtotal,
        delivery_cost: deliveryCost,
        embroidery_requested: embroideryRequested,
        embroidery_details: embroideryDetails,
        embroidery_cost: embroideryCost,
        express_shipping: expressShipping,
        total_amount: totalAmount,
        currency: 'AED',
        created_at: order.created_at,
      };

      // Send admin notification email
      const adminEmailResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-order-notification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!adminEmailResponse.ok) {
        console.error('Failed to send admin notification email:', await adminEmailResponse.text());
      } else {
        console.log('Admin notification email sent successfully');
      }

      // Send customer receipt email
      const customerEmailResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-customer-receipt`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!customerEmailResponse.ok) {
        console.error('Failed to send customer receipt email:', await customerEmailResponse.text());
      } else {
        console.log('Customer receipt email sent successfully');
      }
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // Don't fail the order if email fails
    }

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