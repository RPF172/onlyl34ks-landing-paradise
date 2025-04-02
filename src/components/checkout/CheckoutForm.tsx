
import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements, PaymentElement, AddressElement } from "@stripe/react-stripe-js";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart, updateShippingInfo, shippingInfo } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: shippingInfo?.name || "",
      email: shippingInfo?.email || "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);
    setErrorMessage(undefined);

    try {
      // Update shipping info in context
      const addressElement = elements.getElement("address");
      let address = null;

      if (addressElement) {
        const addressValue = await addressElement.getValue();
        if (addressValue.complete) {
          address = addressValue.value.address;
        } else {
          throw new Error("Please complete the shipping address");
        }
      }

      // Update shipping info in context
      if (address) {
        updateShippingInfo({
          name: values.name,
          email: values.email,
          address: {
            line1: address.line1 || "",
            line2: address.line2,
            city: address.city || "",
            state: address.state || "",
            postalCode: address.postal_code || "",
            country: address.country || "",
          },
        });
      }

      // Process payment
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout-success`,
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Shipping Address</h2>
          <AddressElement 
            options={{
              mode: "shipping",
              allowedCountries: ["US", "CA", "GB"],
              fields: {
                phone: "never",  // Changed from "optional" to "never" to fix the TypeScript error
              },
              validation: {
                phone: {
                  required: "never",
                },
              },
            }} 
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Payment Details</h2>
          <PaymentElement />
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
              Processing...
            </div>
          ) : (
            "Complete Purchase"
          )}
        </Button>
      </form>
    </Form>
  );
}
