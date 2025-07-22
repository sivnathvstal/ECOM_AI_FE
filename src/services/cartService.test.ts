import { getCart, addToCart, updateCartItem, removeFromCart, getCartWithProducts } from './cartService';
import * as cartService from './cartService';
import api from './api';
import { mockCart, mockCartItems } from '../__mocks__/cartContext';
import { mockProducts } from '../__mocks__/products';

// Mock the API module
jest.mock('./api', () => ({
  get: jest.fn(),
}));

describe('cartService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('fetches user cart', async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: [mockCart] });
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockProducts });

      const result = await getCart();

      expect(api.get).toHaveBeenCalledWith('/carts/user/1');
      expect(result).toEqual(mockCart);
    });

    it('handles single cart response', async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockCart });
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockProducts });

      const result = await getCart();

      expect(api.get).toHaveBeenCalledWith('/carts/user/1');
      expect(result).toEqual(mockCart);
    });

    it('returns empty cart when API call fails', async () => {
      const error = new Error('API error');
      (api.get as jest.Mock).mockRejectedValueOnce(error);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const result = await getCart();
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching cart:', error);
      expect(result).toEqual({
        id: 0,
        userId: 1,
        date: expect.any(String),
        products: [],
      });
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('addToCart', () => {
    beforeEach(() => {
      // Mock getCart to return a cart
      jest.spyOn(cartService, 'getCart').mockImplementation(() => Promise.resolve(mockCart));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('adds a new product to cart', async () => {
      const newProductId = 3;
      const quantity = 1;
      
      const result = await addToCart(newProductId, quantity);
      
      // Check if the product was added to the cart
      const addedProduct = result.products.find(p => p.productId === newProductId);
      expect(addedProduct).toBeDefined();
      expect(addedProduct?.quantity).toBe(quantity);
    });

    it('increases quantity if product already exists in cart', async () => {
      const existingProductId = mockCart.products[0].productId;
      const initialQuantity = mockCart.products[0].quantity;
      const additionalQuantity = 2;
      
      const result = await addToCart(existingProductId, additionalQuantity);
      
      // Check if the quantity was increased
      const updatedProduct = result.products.find(p => p.productId === existingProductId);
      expect(updatedProduct).toBeDefined();
      expect(updatedProduct?.quantity).toBe(initialQuantity + additionalQuantity);
    });

    it('uses default quantity of 1 when not specified', async () => {
      const newProductId = 4;
      
      const result = await addToCart(newProductId);
      
      // Check if the product was added with quantity 1
      const addedProduct = result.products.find(p => p.productId === newProductId);
      expect(addedProduct).toBeDefined();
      expect(addedProduct?.quantity).toBe(1);
    });

    it('handles errors', async () => {
      jest.spyOn(cartService, 'getCart').mockImplementation(() => Promise.reject(new Error('Failed to get cart')));
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      await expect(addToCart(3, 1)).rejects.toThrow();
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('updateCartItem', () => {
    beforeEach(() => {
      // Mock getCart to return a cart
      jest.spyOn(cartService, 'getCart').mockImplementation(() => Promise.resolve(mockCart));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('updates quantity of existing product', async () => {
      const existingProductId = mockCart.products[0].productId;
      const newQuantity = 5;
      
      const result = await updateCartItem(existingProductId, newQuantity);
      
      // Check if the quantity was updated
      const updatedProduct = result.products.find(p => p.productId === existingProductId);
      expect(updatedProduct).toBeDefined();
      expect(updatedProduct?.quantity).toBe(newQuantity);
    });

    it('removes product when quantity is 0 or less', async () => {
      const existingProductId = mockCart.products[0].productId;
      
      const result = await updateCartItem(existingProductId, 0);
      
      // Check if the product was removed
      const removedProduct = result.products.find(p => p.productId === existingProductId);
      expect(removedProduct).toBeUndefined();
    });

    it('does nothing when product does not exist in cart', async () => {
      const nonExistingProductId = 999;
      const initialProductsCount = mockCart.products.length;
      
      const result = await updateCartItem(nonExistingProductId, 5);
      
      // Check if the cart remains unchanged
      expect(result.products.length).toBe(initialProductsCount);
    });

    it('handles errors', async () => {
      jest.spyOn(cartService, 'getCart').mockImplementation(() => Promise.reject(new Error('Failed to get cart')));
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      await expect(updateCartItem(1, 5)).rejects.toThrow();
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('removeFromCart', () => {
    it('calls updateCartItem with quantity 0', async () => {
      const updateCartItemSpy = jest.spyOn(cartService, 'updateCartItem').mockImplementation(() => Promise.resolve(mockCart));
      const productId = 1;
      
      await removeFromCart(productId);
      
      expect(updateCartItemSpy).toHaveBeenCalledWith(productId, 0);
      
      updateCartItemSpy.mockRestore();
    });
  });

  describe('getCartWithProducts', () => {
    it('fetches cart with product details', async () => {
      jest.spyOn(cartService, 'getCart').mockImplementation(() => Promise.resolve(mockCart));
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockProducts });
      
      const result = await getCartWithProducts();
      
      expect(result).toHaveLength(mockCart.products.length);
      
      // Check if each cart item has product details
      result.forEach(item => {
        expect(item.product).toBeDefined();
        if (item.product) {
          expect(item.product.id).toBe(item.productId);
        }
      });
    });

    it('handles missing product details', async () => {
      jest.spyOn(cartService, 'getCart').mockImplementation(() => Promise.resolve(mockCart));
      (api.get as jest.Mock).mockResolvedValueOnce({ data: [] }); // No products returned
      
      const result = await getCartWithProducts();
      
      expect(result).toHaveLength(mockCart.products.length);
      
      // Check if each cart item has an empty product object
      result.forEach(item => {
        expect(item.product).toEqual({});
      });
    });

    it('handles errors', async () => {
      jest.spyOn(cartService, 'getCart').mockImplementation(() => Promise.reject(new Error('Failed to get cart')));
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const result = await getCartWithProducts();
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(result).toEqual([]);
      
      consoleErrorSpy.mockRestore();
    });
  });
}); 