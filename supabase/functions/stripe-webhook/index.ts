
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
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

// Create a Supabase client with the admin role (service_role) key
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }
  
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 405 }
    );
  }

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Missing stripe signature" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Verify the webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed.`, err.message);
      return new Response(
        JSON.stringify({ error: `Webhook Error: ${err.message}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Extract metadata from the session
      const userId = session.metadata.user_id;
      const creatorIds = JSON.parse(session.metadata.creator_ids || '[]');
      
      if (!userId || creatorIds.length === 0) {
        console.error("Missing user ID or creator IDs in session metadata");
        return new Response(
          JSON.stringify({ error: "Missing metadata" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
      
      // For each creator in the order, create an order record
      for (const creatorId of creatorIds) {
        // Get creator package ID for this creator
        const { data: packages, error: packageError } = await supabase
          .from("creator_packages")
          .select("id")
          .eq("creator_id", creatorId)
          .limit(1);
          
        if (packageError || !packages || packages.length === 0) {
          console.error(`No package found for creator ${creatorId}:`, packageError);
          continue;
        }
        
        const packageId = packages[0].id;
        
        // Create order record
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: userId,
            creator_package_id: packageId,
            amount: session.amount_total ? session.amount_total / 100 : 19.99, // Convert from cents or use default price
            status: "completed"
          });
          
        if (orderError) {
          console.error(`Failed to create order for user ${userId}, package ${packageId}:`, orderError);
        } else {
          console.log(`Order created successfully for user ${userId}, package ${packageId}`);
        }
      }
      
      console.log(`Payment was successful for user ${userId}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
