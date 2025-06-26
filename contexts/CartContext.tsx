import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
    category: {
      name: string;
    };
  };
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user, token]);

  const fetchCart = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!token) {
      throw new Error('Please login to add items to cart');
    }

    try {
      setLoading(true);
      await axios.post('/api/cart', {
        productId,
        quantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCart();
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    if (!token) return;

    try {
      setLoading(true);
      await axios.put(`/api/cart/${itemId}`, { quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCart();
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update cart item');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!token) return;

    try {
      setLoading(true);
      await axios.delete(`/api/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCart();
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!token) return;

    try {
      setLoading(true);
      await axios.delete('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems([]);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
    loading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
