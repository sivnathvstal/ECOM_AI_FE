import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import * as cartService from '../services/cartService';
import { mockCart, mockCartItems } from '../__mocks__/cartContext';

// Mock the cart service
jest.mock('../services/cartService', () => ({
  getCart: jest.fn(),
  addToCart: jest.fn(),
  updateCartItem: jest.fn(),
  removeFromCart: jest.fn(),
  getCartWithProducts: jest.fn(),
}));

// Test component that uses the cart context
const TestComponent: React.FC = () => {
  const { cartItems, totalItems, totalPrice, addItem, updateItem, removeItem } = useCart();
  
  return (
    <div>
      <div data-testid="cart-items-count">{cartItems.length}</div>
      <div data-testid="total-items">{totalItems}</div>
      <div data-testid="total-price">{totalPrice.toFixed(2)}</div>
      <button data-testid="add-item-button" onClick={() => addItem(3, 1)}>Add Item</button>
      <button data-testid="update-item-button" onClick={() => updateItem(1, 5)}>Update Item</button>
      <button data-testid="remove-item-button" onClick={() => removeItem(1)}>Remove Item</button>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (cartService.getCart as jest.Mock).mockResolvedValue(mockCart);
    (cartService.getCartWithProducts as jest.Mock).mockResolvedValue(mockCartItems);
    (cartService.addToCart as jest.Mock).mockResolvedValue(mockCart);
    (cartService.updateCartItem as jest.Mock).mockResolvedValue(mockCart);
    (cartService.removeFromCart as jest.Mock).mockResolvedValue(mockCart);
  });

  it('provides cart data and functions', async () => {
    await act(async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );
    });

    // Wait for initial cart fetch to complete
    await waitFor(() => {
      expect(cartService.getCart).toHaveBeenCalled();
      expect(cartService.getCartWithProducts).toHaveBeenCalled();
    });

    // Check if cart data is provided correctly
    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('2');
    expect(screen.getByTestId('total-items')).toHaveTextContent('3'); // 2 + 1 = 3
    expect(screen.getByTestId('total-price')).toHaveTextContent('42.97'); // 10.99*2 + 20.99*1 = 42.97
  });

  it('adds item to cart', async () => {
    await act(async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );
    });

    // Wait for initial cart fetch to complete
    await waitFor(() => {
      expect(cartService.getCart).toHaveBeenCalled();
    });

    // Add an item to the cart
    await act(async () => {
      screen.getByTestId('add-item-button').click();
    });

    // Check if addToCart was called with correct parameters
    expect(cartService.addToCart).toHaveBeenCalledWith(3, 1);
  });

  it('updates item in cart', async () => {
    await act(async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );
    });

    // Wait for initial cart fetch to complete
    await waitFor(() => {
      expect(cartService.getCart).toHaveBeenCalled();
    });

    // Update an item in the cart
    await act(async () => {
      screen.getByTestId('update-item-button').click();
    });

    // Check if updateCartItem was called with correct parameters
    expect(cartService.updateCartItem).toHaveBeenCalledWith(1, 5);
  });

  it('removes item from cart', async () => {
    await act(async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );
    });

    // Wait for initial cart fetch to complete
    await waitFor(() => {
      expect(cartService.getCart).toHaveBeenCalled();
    });

    // Remove an item from the cart
    await act(async () => {
      screen.getByTestId('remove-item-button').click();
    });

    // Check if removeFromCart was called with correct parameters
    expect(cartService.removeFromCart).toHaveBeenCalledWith(1);
  });

  it('throws if useCart is used outside provider', () => {
    const ThrowComponent = () => {
      useCart();
      return null;
    };
    expect(() => render(<ThrowComponent />)).toThrow('useCart must be used within a CartProvider');
  });

  it('handles error in addItem', async () => {
    (cartService.addToCart as jest.Mock).mockRejectedValue(new Error('add error'));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await act(async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );
    });
    await act(async () => {
      screen.getByTestId('add-item-button').click();
    });
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('handles error in updateItem', async () => {
    (cartService.updateCartItem as jest.Mock).mockRejectedValue(new Error('update error'));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await act(async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );
    });
    await act(async () => {
      screen.getByTestId('update-item-button').click();
    });
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('handles error in removeItem', async () => {
    (cartService.removeFromCart as jest.Mock).mockRejectedValue(new Error('remove error'));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await act(async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );
    });
    await act(async () => {
      screen.getByTestId('remove-item-button').click();
    });
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('handles error when fetching cart', async () => {
    const error = new Error('Failed to fetch cart');
    (cartService.getCart as jest.Mock).mockRejectedValue(error);
    
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    await act(async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );
    });
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    
    consoleErrorSpy.mockRestore();
  });

  it('handles error when adding item to cart', async () => {
    const error = new Error('Failed to add item to cart');
    (cartService.addToCart as jest.Mock).mockRejectedValue(error);
    
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    await act(async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );
    });
    
    // Wait for initial cart fetch to complete
    await waitFor(() => {
      expect(cartService.getCart).toHaveBeenCalled();
    });
    
    // Add an item to the cart
    await act(async () => {
      screen.getByTestId('add-item-button').click();
    });
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    
    consoleErrorSpy.mockRestore();
  });

  it('handles error in fetchCart after addItem', async () => {
    (cartService.addToCart as jest.Mock).mockResolvedValue(mockCart);
    // First fetchCart (initial render) resolves, second (after addItem) rejects
    (cartService.getCart as jest.Mock).mockResolvedValueOnce(mockCart).mockRejectedValueOnce(new Error('fetchCart error'));
    (cartService.getCartWithProducts as jest.Mock).mockResolvedValueOnce(mockCartItems).mockRejectedValueOnce(new Error('fetchCart error'));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await act(async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );
    });
    await act(async () => {
      screen.getByTestId('add-item-button').click();
    });
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('handles error in fetchCart after updateItem', async () => {
    (cartService.updateCartItem as jest.Mock).mockResolvedValue(mockCart);
    (cartService.getCart as jest.Mock).mockResolvedValueOnce(mockCart).mockRejectedValueOnce(new Error('fetchCart error'));
    (cartService.getCartWithProducts as jest.Mock).mockResolvedValueOnce(mockCartItems).mockRejectedValueOnce(new Error('fetchCart error'));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await act(async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );
    });
    await act(async () => {
      screen.getByTestId('update-item-button').click();
    });
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('handles error in fetchCart after removeItem', async () => {
    (cartService.removeFromCart as jest.Mock).mockResolvedValue(mockCart);
    (cartService.getCart as jest.Mock).mockResolvedValueOnce(mockCart).mockRejectedValueOnce(new Error('fetchCart error'));
    (cartService.getCartWithProducts as jest.Mock).mockResolvedValueOnce(mockCartItems).mockRejectedValueOnce(new Error('fetchCart error'));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await act(async () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );
    });
    await act(async () => {
      screen.getByTestId('remove-item-button').click();
    });
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
}); 