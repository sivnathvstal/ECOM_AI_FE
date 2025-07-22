import { mockProducts, mockProductsResponse, mockCategories } from './products';
import { mockCart, mockCartItems } from './cartContext';

// Product service mocks
export const mockProductService = {
  getProducts: jest.fn().mockResolvedValue(mockProductsResponse),
  getProductById: jest.fn().mockImplementation((id: number) => {
    const product = mockProducts.find(p => p.id === id);
    if (product) {
      return Promise.resolve(product);
    }
    return Promise.reject(new Error('Product not found'));
  }),
  getCategories: jest.fn().mockResolvedValue(mockCategories),
  searchProducts: jest.fn().mockResolvedValue(mockProductsResponse),
};

// Cart service mocks
export const mockCartService = {
  getCart: jest.fn().mockResolvedValue(mockCart),
  addToCart: jest.fn().mockResolvedValue(mockCart),
  updateCartItem: jest.fn().mockResolvedValue(mockCart),
  removeFromCart: jest.fn().mockResolvedValue(mockCart),
  getCartWithProducts: jest.fn().mockResolvedValue(mockCartItems),
}; 