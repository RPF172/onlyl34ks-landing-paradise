
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  creatorId: string;
  creatorName: string;
  price: number;
  quantity: number;
}

export interface ShippingInfo {
  name: string;
  email: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  totalPrice: number;
  itemsCount: number;
  shippingInfo: ShippingInfo | null;
  updateShippingInfo: (info: ShippingInfo) => void;
}

const TAX_RATE = 0.07; // 7% tax rate

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      
      const savedShippingInfo = localStorage.getItem("shippingInfo");
      if (savedShippingInfo) {
        setShippingInfo(JSON.parse(savedShippingInfo));
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

  // Save shipping info to localStorage when it changes
  useEffect(() => {
    if (shippingInfo) {
      try {
        localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
      } catch (error) {
        console.error("Failed to save shipping info to localStorage:", error);
      }
    }
  }, [shippingInfo]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    // Check if item already exists in cart
    const existingItem = items.find(existingItem => existingItem.id === item.id);
    
    if (existingItem) {
      // Update quantity if item exists
      updateQuantity(item.id, existingItem.quantity + 1);
      toast({
        title: "Item quantity increased",
        description: `${item.creatorName}'s content quantity updated in your cart.`,
      });
    } else {
      // Add new item with quantity 1
      setItems([...items, { ...item, quantity: 1 }]);
      toast({
        title: "Added to cart",
        description: `${item.creatorName}'s content added to your cart.`,
      });
    }
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

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    setItems(items.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const updateShippingInfo = (info: ShippingInfo) => {
    setShippingInfo(info);
  };

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * TAX_RATE;
  const totalPrice = subtotal + tax;
  const itemsCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQuantity,
      clearCart, 
      subtotal,
      tax,
      totalPrice, 
      itemsCount,
      shippingInfo,
      updateShippingInfo
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
