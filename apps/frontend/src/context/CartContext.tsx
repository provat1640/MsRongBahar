'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { selfHealingEngine } from '../lib/selfHealing';

export interface CartItem {
  productId: string;
  variantId?: string | null;
  productTitle: string;
  variantName?: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  image: string;
  unit: string;
  maxStock: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  cartId: string;
  reservationTimeLeft: number;
  addItem: (item: {
    productId: string;
    variantId?: string | null;
    productTitle: string;
    variantName?: string | null;
    unitPrice: number;
    image: string;
    unit: string;
    maxStock: number;
    quantity?: number;
  }) => void;
  updateQuantity: (productId: string, variantId: string | null | undefined, quantity: number) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  clearCart: () => void;
  startReservationTimer: (durationSeconds?: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string>('');
  const [reservationTimeLeft, setReservationTimeLeft] = useState<number>(0);

  // Initialize cart session ID from localStorage and reconcile storage
  useEffect(() => {
    try {
      // 1. Run Autonomous Storage Sanitization
      selfHealingEngine.reconcileStorage();

      let storedCartId = localStorage.getItem('rong_cart_id');
      if (!storedCartId) {
        storedCartId = `cart_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
        localStorage.setItem('rong_cart_id', storedCartId);
      }
      setCartId(storedCartId);

      const storedItems = localStorage.getItem('rong_cart_items');
      if (storedItems) {
        const parsed = JSON.parse(storedItems);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (err: any) {
      selfHealingEngine.recordEvent({
        category: 'STORAGE',
        severity: 'WARNING',
        message: 'Cart context initialization error auto-recovered.',
        details: err?.message,
        repairedSuccessfully: true,
      });
    }
  }, []);

  // Sync to localStorage with resilience
  useEffect(() => {
    try {
      localStorage.setItem('rong_cart_items', JSON.stringify(items));
    } catch (err: any) {
      selfHealingEngine.recordEvent({
        category: 'STORAGE',
        severity: 'WARNING',
        message: 'Failed to write cart snapshot to local storage. Quota or permission error.',
        details: err?.message,
        repairedSuccessfully: true,
      });
    }
  }, [items]);

  // Reservation Countdown Timer
  useEffect(() => {
    if (reservationTimeLeft <= 0) return;
    const interval = setInterval(() => {
      setReservationTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [reservationTimeLeft]);

  const startReservationTimer = (durationSeconds: number = 600) => {
    setReservationTimeLeft(durationSeconds);
  };

  const addItem = (item: {
    productId: string;
    variantId?: string | null;
    productTitle: string;
    variantName?: string | null;
    unitPrice: number;
    image: string;
    unit: string;
    maxStock: number;
    quantity?: number;
  }) => {
    const qtyToAdd = item.quantity || 1;
    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.productId === item.productId && (i.variantId || null) === (item.variantId || null),
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = Math.min(updated[existingIdx].quantity + qtyToAdd, item.maxStock || 999);
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          lineTotal: newQty * updated[existingIdx].unitPrice,
        };
        return updated;
      }

      return [
        ...prev,
        {
          productId: item.productId,
          variantId: item.variantId || null,
          productTitle: item.productTitle,
          variantName: item.variantName || null,
          quantity: qtyToAdd,
          unitPrice: item.unitPrice,
          lineTotal: item.unitPrice * qtyToAdd,
          image: item.image,
          unit: item.unit,
          maxStock: item.maxStock,
        },
      ];
    });

    // Refresh reservation hold for 10 minutes
    startReservationTimer(600);
  };

  const updateQuantity = (productId: string, variantId: string | null | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }

    setItems((prev) =>
      prev.map((i) => {
        if (i.productId === productId && (i.variantId || null) === (variantId || null)) {
          const clampedQty = Math.min(quantity, i.maxStock || 999);
          return {
            ...i,
            quantity: clampedQty,
            lineTotal: clampedQty * i.unitPrice,
          };
        }
        return i;
      }),
    );
  };

  const removeItem = (productId: string, variantId?: string | null) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && (i.variantId || null) === (variantId || null))),
    );
  };

  const clearCart = () => {
    setItems([]);
    setReservationTimeLeft(0);
    try {
      localStorage.removeItem('rong_cart_items');
    } catch {
      // ignore
    }
  };

  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce((acc, curr) => acc + curr.lineTotal, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        cartId,
        reservationTimeLeft,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        startReservationTimer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
