
import React from 'react';
import { CartItem } from '@/contexts/CartContext';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export default function OrderSummary({ items, subtotal, tax, total }: OrderSummaryProps) {
  return (
    <Card className="bg-onlyl34ks-card border-0 sticky top-24">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
        
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <div>
                <p className="font-medium">{item.creatorName}</p>
                <p className="text-sm text-onlyl34ks-text-muted">
                  {item.quantity > 1 ? `${item.quantity}x` : ""} Premium Content
                </p>
              </div>
              <p className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Tax (7%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
