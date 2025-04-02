
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart, shippingInfo } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);
    setErrorMessage(undefined);

    try {
      // Process payment
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout-success`,
          payment_method_data: {
            billing_details: {
              name: shippingInfo?.name || "",
              email: shippingInfo?.email || "",
              address: shippingInfo?.address ? {
                line1: shippingInfo.address.line1 || "",
                line2: shippingInfo.address.line2 || "",
                city: shippingInfo.address.city || "",
                state: shippingInfo.address.state || "",
                postal_code: shippingInfo.address.postalCode || "",
                country: shippingInfo.address.country || "",
              } : undefined
            }
          }
        },
      });

      if (result.error) {
        console.error("[Payment Error]", result.error);
        
        if (result.error.type === "card_error" || result.error.type === "validation_error") {
          setErrorMessage(result.error.message);
        } else {
          setErrorMessage("An unexpected error occurred during payment.");
        }
        
        toast({
          title: "Payment Failed",
          description: result.error.message || "An error occurred during payment processing.",
          variant: "destructive",
        });
      } else {
        // Payment succeeded! We should not reach here as the return_url will redirect.
        clearCart();
        toast({
          title: "Payment Successful",
          description: "Thank you for your purchase!",
        });
        navigate("/checkout-success");
      }
    } catch (error) {
      console.error("[Form Submission Error]", error);
      const errorMsg = error instanceof Error ? error.message : "An unexpected error occurred.";
      setErrorMessage(errorMsg);
      toast({
        title: "Checkout Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Review Information</h2>
        {shippingInfo && (
          <div className="mt-4 p-4 bg-muted/40 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <p className="text-sm font-medium">Contact</p>
                <p>{shippingInfo.name}</p>
                <p>{shippingInfo.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Shipping Address</p>
                <p>{shippingInfo.address.line1}</p>
                {shippingInfo.address.line2 && <p>{shippingInfo.address.line2}</p>}
                <p>{shippingInfo.address.city}, {shippingInfo.address.state} {shippingInfo.address.postalCode}</p>
                <p>{shippingInfo.address.country}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Payment Details</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Please enter your card details below to complete your purchase.
        </p>
        <PaymentElement 
          options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
            },
          }} 
        />
      </div>

      {errorMessage && (
        <div className="text-red-500 bg-red-50 p-4 rounded border border-red-200">
          {errorMessage}
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isProcessing || !stripe || !elements}
      >
        {isProcessing ? (
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          "Complete Purchase"
        )}
      </Button>
    </form>
  );
}
