
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  creatorId: string;
  creatorName: string;
  price: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
  itemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [items]);

  const addItem = (item: CartItem) => {
    // Check if item already exists in cart
    if (items.some(existingItem => existingItem.id === item.id)) {
      toast({
        title: "Already in cart",
        description: `${item.creatorName}'s content is already in your cart.`,
      });
      return;
    }
    
    setItems([...items, item]);
    toast({
      title: "Added to cart",
      description: `${item.creatorName}'s content added to your cart.`,
    });
  };

  const removeItem = (id: string) => {
    const item = items.find(i => i.id === id);
    setItems(items.filter(item => item.id !== id));
    
    if (item) {
      toast({
        title: "Removed from cart",
        description: `${item.creatorName}'s content removed from your cart.`,
      });
    }
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const totalPrice = items.reduce((total, item) => total + item.price, 0);
  const itemsCount = items.length;

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      clearCart, 
      totalPrice, 
      itemsCount 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
