
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

// Load Stripe outside of component to avoid recreating it on renders
// Replace with your own publishable key
const stripePromise = loadStripe("pk_test_YourStripePubKeyHere");

export default function Checkout() {
  const { items, subtotal, tax, totalPrice, shippingInfo } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If cart is empty, redirect to cart page
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    // If user is not logged in, redirect to auth page
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to proceed with checkout.",
        variant: "destructive"
      });
      navigate("/auth", { state: { from: "/checkout" } });
      return;
    }

    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: { 
            items,
            shippingInfo
          }
        });

        if (error) throw error;

        if (data?.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error('No client secret returned');
        }
      } catch (err) {
        console.error("Error creating payment intent:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize payment. Please try again.");
        toast({
          title: "Payment Setup Failed",
          description: err instanceof Error ? err.message : "An error occurred while setting up the payment.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [user, items, navigate, toast, shippingInfo]);

  if (items.length === 0) {
    return null; // Will redirect in useEffect
  }

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#4F46E5',
    },
  };

  return (
    <div className="container py-16">
      <motion.h1 
        className="text-4xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Checkout
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6">
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                <CheckoutForm />
              </Elements>
            ) : (
              <div className="py-12 text-center">
                {loading ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p>Initializing payment...</p>
                  </div>
                ) : error ? (
                  <div className="text-red-500">
                    {error}
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-1">
          <OrderSummary 
            items={items}
            subtotal={subtotal}
            tax={tax}
            total={totalPrice}
          />
        </div>
      </div>
    </div>
  );
}
