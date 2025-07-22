import api from './api';
import { Cart, CartProduct, Product } from '../types';

// For simplicity, we'll use a fixed user ID
const USER_ID = 1;

export const getCart = async (): Promise<Cart> => {
  try {
    // Get user cart
    const cartResponse = await api.get<Cart>(`/carts/user/${USER_ID}`);
    
    // FakeStoreAPI doesn't return product details in cart, so we need to fetch them
    const productsResponse = await api.get<Product[]>('/products');
    const products = productsResponse.data;
    
    // Get the first cart (assuming one cart per user)
    const cart = Array.isArray(cartResponse.data) 
      ? cartResponse.data[0] 
      : cartResponse.data;
    
    return cart;
  } catch (error) {
    console.error('Error fetching cart:', error);
    
    // Return empty cart if there's an error
    return {
      id: 0,
      userId: USER_ID,
      date: new Date().toISOString(),
      products: []
    };
  }
};

export const addToCart = async (productId: number, quantity = 1): Promise<Cart> => {
  try {
    const cart = await getCart();
    
    // Check if product already exists in cart
    const existingProductIndex = cart.products.findIndex(
      (item) => item.productId === productId
    );
    
    if (existingProductIndex >= 0) {
      // Update quantity if product exists
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Add new product if it doesn't exist
      cart.products.push({
        productId,
        quantity
      });
    }
    
    // In a real app, we would update the cart on the server
    // For this demo, we'll just return the updated cart
    return cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItem = async (productId: number, quantity: number): Promise<Cart> => {
  try {
    const cart = await getCart();
    
    const existingProductIndex = cart.products.findIndex(
      (item) => item.productId === productId
    );
    
    if (existingProductIndex >= 0) {
      if (quantity <= 0) {
        // Remove product if quantity is 0 or less
        cart.products.splice(existingProductIndex, 1);
      } else {
        // Update quantity
        cart.products[existingProductIndex].quantity = quantity;
      }
    }
    
    // In a real app, we would update the cart on the server
    return cart;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeFromCart = async (productId: number): Promise<Cart> => {
  return updateCartItem(productId, 0);
};

export const getCartWithProducts = async (): Promise<CartProduct[]> => {
  try {
    const cart = await getCart();
    const productsResponse = await api.get<Product[]>('/products');
    const allProducts = productsResponse.data;
    
    // Map cart items to include product details
    const cartWithProducts = cart.products.map((item) => {
      const product = allProducts.find((p) => p.id === item.productId);
      return {
        ...item,
        product: product || {} as Product
      };
    });
    
    return cartWithProducts;
  } catch (error) {
    console.error('Error getting cart with products:', error);
    return [];
  }
}; 