
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.18.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Extract auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Initialize Supabase client with the request auth header
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });
    
    // Get user from the auth header
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Parse request body
    const { items, shippingInfo } = await req.json();
    console.log("Request payload:", { items, shippingInfo });

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid items in request" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Calculate amounts
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxRate = 0.07; // 7% tax rate
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;
    
    console.log("Calculated amounts:", { subtotal, taxAmount, totalAmount });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        user_id: user.id,
        items_count: items.length.toString(),
        items_json: JSON.stringify(items.map(item => ({
          id: item.id,
          creator_id: item.creatorId,
          price: item.price,
          quantity: item.quantity
        }))),
        shipping_name: shippingInfo?.name || '',
        shipping_email: shippingInfo?.email || user.email || '',
      },
      shipping: shippingInfo ? {
        name: shippingInfo.name,
        address: {
          line1: shippingInfo.address.line1,
          line2: shippingInfo.address.line2 || '',
          city: shippingInfo.address.city,
          state: shippingInfo.address.state,
          postal_code: shippingInfo.address.postalCode,
          country: shippingInfo.address.country,
        }
      } : undefined
    });

    console.log("PaymentIntent created:", paymentIntent.id);
    
    return new Response(
      JSON.stringify({ 
        clientSecret: paymentIntent.client_secret,
        amount: totalAmount
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Payment intent creation error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
