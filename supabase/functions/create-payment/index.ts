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
      const price = parseFloat(item.product.price.replace(/[^0-9.]/g, '')) || 0;
      return sum + (price * item.quantity);
    }, 0);
    
    const deliveryCost = 25; // AED 25 delivery cost
    const total = Math.round((subtotal + deliveryCost) * 100); // Convert to cents

    // Create line items for each product instead of bundling
    const lineItems = cart_items.map((item: any) => ({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: item.product.name,
          description: `Size: ${item.size}`,
          images: [item.product.image],
        },
        unit_amount: Math.round(parseFloat(item.product.price.replace(/[^0-9.]/g, '')) * 100),
      },
      quantity: item.quantity,
    }));

    // Add delivery as a separate line item
    lineItems.push({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: 'Delivery',
          description: 'Standard delivery service',
        },
        unit_amount: Math.round(deliveryCost * 100),
      },
      quantity: 1,
    });

    // Create a one-time payment session with comprehensive payment methods
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user?.email,
      line_items: lineItems,
      mode: "payment",
      
      
      // Configure essential payment method types for UAE market
      payment_method_types: [
        'card',        // Credit/debit cards (Visa, Mastercard, Amex)
        'link',        // Stripe Link (one-click checkout)
      ],
      
      
      // Payment method options for better UX and security
      payment_method_options: {
        card: {
          setup_future_usage: 'off_session',
          request_three_d_secure: 'automatic', // Enhanced security
        },
      },
      
      // Enhanced address collection
      shipping_address_collection: {
        allowed_countries: ['AE', 'SA', 'KW', 'QA', 'BH', 'OM', 'EG', 'JO', 'LB', 'US', 'GB', 'CA'],
      },
      
      // Enable billing address collection for fraud prevention
      billing_address_collection: 'required',
      
      // Phone number collection for order updates
      phone_number_collection: {
        enabled: true,
      },
      
      // Locale for better UX in Middle East
      locale: 'auto', // Automatically detect user's locale
      
      // Success and cancel URLs
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/checkout?canceled=true`,
      
      // Enhanced metadata for comprehensive order tracking
      metadata: {
        user_id: user?.id || 'guest',
        cart_items: JSON.stringify(cart_items.map((item: any) => ({
          product_id: item.product.id || item.id,
          name: item.product.name,
          size: item.size,
          quantity: item.quantity,
          price: item.product.price,
          unit_price: parseFloat(item.product.price.replace(/[^0-9.]/g, '')) || 0,
        }))),
        subtotal: subtotal.toString(),
        delivery_cost: deliveryCost.toString(),
        total_amount: (subtotal + deliveryCost).toString(),
        currency: currency.toUpperCase(),
        order_type: 'ecommerce',
        source: 'web_checkout',
      },
      
      // Custom fields for additional information
      custom_fields: [
        {
          key: 'delivery_instructions',
          label: {
            type: 'custom',
            custom: 'Delivery Instructions (Optional)',
          },
          type: 'text',
          optional: true,
        },
      ],
      
      // Allow promotion codes
      allow_promotion_codes: true,
      
      // Invoice creation for record keeping
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: `Order from ${req.headers.get("origin")}`,
          metadata: {
            order_type: 'scrubs_purchase',
          },
        },
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