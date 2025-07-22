import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Cart, CartProduct } from '../types';
import { getCart, addToCart, updateCartItem, removeFromCart, getCartWithProducts } from '../services/cartService';

interface CartContextType {
  cart: Cart;
  cartItems: CartProduct[];
  isLoading: boolean;
  error: string | null;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({
    id: 0,
    userId: 1,
    date: new Date().toISOString(),
    products: []
  });
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const cartData = await getCart();
      setCart(cartData);
      const cartWithProducts = await getCartWithProducts();
      setCartItems(cartWithProducts);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cart');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addItem = async (productId: number, quantity: number) => {
    try {
      setIsLoading(true);
      const updatedCart = await addToCart(productId, quantity);
      setCart(updatedCart);
      await fetchCart(); // Refetch to get product details
    } catch (err) {
      setError('Failed to add item to cart');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (productId: number, quantity: number) => {
    try {
      setIsLoading(true);
      const updatedCart = await updateCartItem(productId, quantity);
      setCart(updatedCart);
      await fetchCart(); // Refetch to get product details
    } catch (err) {
      setError('Failed to update cart item');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (productId: number) => {
    try {
      setIsLoading(true);
      const updatedCart = await removeFromCart(productId);
      setCart(updatedCart);
      await fetchCart(); // Refetch to get product details
    } catch (err) {
      setError('Failed to remove item from cart');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total items in cart
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    return total + ((item.product?.price || 0) * item.quantity);
  }, 0);

  const value = {
    cart,
    cartItems,
    isLoading,
    error,
    addItem,
    updateItem,
    removeItem,
    totalItems,
    totalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}; 