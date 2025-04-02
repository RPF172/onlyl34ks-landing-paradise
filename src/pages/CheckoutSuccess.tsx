
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
  
  // Clear the cart once payment is successful
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="container max-w-2xl mx-auto py-16">
      <motion.div
        className="text-center p-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex justify-center">
          <CheckCircle2 className="h-24 w-24 text-green-500" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
        
        <p className="text-xl text-onlyl34ks-text-muted mb-8">
          Thank you for your purchase. You'll receive an email confirmation shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/account">View My Downloads</Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link to="/creators" className="flex items-center">
              Continue Browsing <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
