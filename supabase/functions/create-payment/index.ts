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

  // Create Supabase client using the anon key for user authentication
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Parse request body
    const { currency = 'aed', cart_items = [] } = await req.json();

    // Retrieve authenticated user
    const authHeader = req.headers.get("Authorization");
    let user = null;
    
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      user = data.user;
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if a Stripe customer record exists for this user
    let customerId;
    if (user?.email) {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    }

    // Calculate total amount in cents (AED) including delivery
    const subtotal = cart_items.reduce((sum: number, item: any) => {
      const price = parseFloat(item.product.price.replace(/[^0-9.]/g, ''));
      return sum + (price * item.quantity);
    }, 0);
    
    const deliveryCost = 25; // AED 25 delivery cost
    const total = Math.round((subtotal + deliveryCost) * 100); // Convert to cents

    // Create a one-time payment session with flexible payment methods
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user?.email,
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
            name: `Scrubs Order (${cart_items.length} items)`,
            description: cart_items.map((item: any) => 
              `${item.product.name} (${item.size}) x${item.quantity}`
            ).join(', '),
            },
            unit_amount: total,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      
      // Enable flexible payment methods
      payment_method_types: [
        'card',
        'apple_pay',
        'google_pay',
        'samsung_pay',
        'link',
        'paypal', // If enabled in your Stripe account
      ],
      
      // Payment method options for better UX
      payment_method_options: {
        card: {
          setup_future_usage: 'off_session', // Save payment method for future use
        },
      },
      
      // Enable automatic payment methods based on location
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never', // Keep user on your site
      },
      
      // Shipping address collection (optional)
      shipping_address_collection: {
        allowed_countries: ['AE', 'SA', 'KW', 'QA', 'BH', 'OM', 'US', 'GB'],
      },
      
      // Success and cancel URLs
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/checkout?canceled=true`,
      
      // Additional metadata for order processing
      metadata: {
        user_id: user?.id || 'guest',
        cart_items: JSON.stringify(cart_items.map((item: any) => ({
          product_id: item.product.id || item.id,
          name: item.product.name,
          size: item.size,
          quantity: item.quantity,
          price: item.product.price
        }))),
        subtotal: subtotal.toString(),
        delivery_cost: deliveryCost.toString(),
      },
    });

    return new Response(JSON.stringify({ 
      url: session.url,
      session_id: session.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});