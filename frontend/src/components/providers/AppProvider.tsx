'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  phone?: string | null;
}

export interface CartItemData {
  id: string;
  cartId: string;
  serviceId: string;
  quantity: number;
  itemNotes?: string | null;
  service: {
    id: string;
    title: string;
    slug: string;
    category: string;
    startingPrice: number;
    turnaround: string;
    imageUrl: string;
  };
}

interface AppContextType {
  user: User | null;
  cartCount: number;
  cartItems: CartItemData[];
  cartSubtotal: number;
  isCartOpen: boolean;
  cartLoading: boolean;
  flashItemId: string | null;
  unreadCount: number;
  theme: 'dark' | 'light';
  isSideRailOpen: boolean;
  openSideRail: () => void;
  closeSideRail: () => void;
  toggleSideRail: () => void;
  toggleTheme: () => void;
  openCartDrawer: (flashId?: string) => void;
  closeCartDrawer: () => void;
  addToCartAndOpen: (serviceId: string, quantity?: number) => Promise<void>;
  updateCartItemQuantity: (itemId: string, newQ: number) => Promise<void>;
  removeCartItemById: (itemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (u: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [cartSubtotal, setCartSubtotal] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [flashItemId, setFlashItemId] = useState<string | null>(null);
  const [cartLoading, setCartLoading] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [isSideRailOpen, setIsSideRailOpen] = useState<boolean>(false);

  const openSideRail = () => setIsSideRailOpen(true);
  const closeSideRail = () => setIsSideRailOpen(false);
  const toggleSideRail = () => setIsSideRailOpen((prev) => !prev);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('luk_theme') as 'dark' | 'light' | null;
      // Default to dark for Cinematic Space theme if unset
      const initialTheme = saved ? saved : 'dark';
      setTheme(initialTheme);
      document.documentElement.classList.toggle('dark', initialTheme === 'dark');
      document.documentElement.classList.toggle('light', initialTheme === 'light');
      document.documentElement.setAttribute('data-theme', initialTheme);
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('luk_theme', next);
      } catch {
        // ignore
      }
      document.documentElement.classList.toggle('dark', next === 'dark');
      document.documentElement.classList.toggle('light', next === 'light');
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  };

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  const refreshCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        const items: CartItemData[] = data.cart?.items || [];
        setCartItems(items);

        const totalCount = items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        setCartCount(totalCount);

        const totalMoney = items.reduce(
          (sum, item) => sum + (item.service?.startingPrice || 0) * item.quantity,
          0
        );
        setCartSubtotal(totalMoney);
      }
    } catch {
      // ignore
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // ignore
    }
  }, []);

  const openCartDrawer = (flashId?: string) => {
    if (flashId) {
      setFlashItemId(flashId);
      setTimeout(() => setFlashItemId(null), 1500);
    }
    setIsCartOpen(true);
  };

  const closeCartDrawer = () => {
    setIsCartOpen(false);
  };

  const addToCartAndOpen = async (serviceId: string, quantity = 1) => {
    setCartLoading(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, quantity }),
      });
      if (res.ok) {
        await refreshCart();
        openCartDrawer(serviceId);
      }
    } finally {
      setCartLoading(false);
    }
  };

  const updateCartItemQuantity = async (itemId: string, newQ: number) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQ }),
      });
      if (res.ok) {
        await refreshCart();
      }
    } catch {
      // ignore
    }
  };

  const removeCartItemById = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await refreshCart();
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refreshUser();
    refreshCart();
    refreshNotifications();
  }, [refreshUser, refreshCart, refreshNotifications]);

  return (
    <AppContext.Provider
      value={{
        user,
        cartCount,
        cartItems,
        cartSubtotal,
        isCartOpen,
        cartLoading,
        flashItemId,
        unreadCount,
        theme,
        toggleTheme,
        isSideRailOpen,
        openSideRail,
        closeSideRail,
        toggleSideRail,
        openCartDrawer,
        closeCartDrawer,
        addToCartAndOpen,
        updateCartItemQuantity,
        removeCartItemById,
        refreshCart,
        refreshNotifications,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
