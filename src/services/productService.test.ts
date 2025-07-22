import { getProducts, getProductById, getCategories, searchProducts } from './productService';
import api from './api';
import { mockProducts, mockCategories } from '../__mocks__/products';

// Mock the API module
jest.mock('./api', () => ({
  get: jest.fn(),
}));

describe('productService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('fetches products with default pagination', async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockProducts });

      const result = await getProducts();

      expect(api.get).toHaveBeenCalledWith('/products');
      expect(result.products).toHaveLength(mockProducts.length);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 8,
        total: mockProducts.length,
      });
    });

    it('fetches products with custom pagination', async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockProducts });

      const result = await getProducts(2, 2);

      expect(api.get).toHaveBeenCalledWith('/products');
      expect(result.products).toHaveLength(2); // Only the third and fourth product for page 2 with limit 2
      expect(result.pagination).toEqual({
        page: 2,
        limit: 2,
        total: mockProducts.length,
      });
    });

    it('filters products by category', async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockProducts });
      const category = 'electronics';
      const electronicsProducts = mockProducts.filter(p => p.category === category);

      const result = await getProducts(1, 8, category);

      expect(api.get).toHaveBeenCalledWith('/products');
      expect(result.products).toHaveLength(electronicsProducts.length);
      expect(result.products[0].category).toBe(category);
      expect(result.pagination.total).toBe(electronicsProducts.length);
    });

    it('handles API errors', async () => {
      const error = new Error('API error');
      (api.get as jest.Mock).mockRejectedValueOnce(error);

      await expect(getProducts()).rejects.toThrow('API error');
    });
  });

  describe('getProductById', () => {
    it('fetches a single product by ID', async () => {
      const product = mockProducts[0];
      (api.get as jest.Mock).mockResolvedValueOnce({ data: product });

      const result = await getProductById(product.id);

      expect(api.get).toHaveBeenCalledWith(`/products/${product.id}`);
      expect(result).toEqual(product);
    });

    it('handles API errors', async () => {
      const error = new Error('API error');
      (api.get as jest.Mock).mockRejectedValueOnce(error);

      await expect(getProductById(1)).rejects.toThrow('API error');
    });
  });

  describe('getCategories', () => {
    it('fetches all categories', async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockCategories });

      const result = await getCategories();

      expect(api.get).toHaveBeenCalledWith('/products/categories');
      expect(result).toEqual(mockCategories);
    });

    it('handles API errors', async () => {
      const error = new Error('API error');
      (api.get as jest.Mock).mockRejectedValueOnce(error);

      await expect(getCategories()).rejects.toThrow('API error');
    });
  });

  describe('searchProducts', () => {
    it('searches products by query in title', async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockProducts });
      const query = 'Product 1';
      const matchingProducts = mockProducts.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase())
      );

      const result = await searchProducts(query);

      expect(api.get).toHaveBeenCalledWith('/products');
      expect(result.products).toHaveLength(matchingProducts.length);
      expect(result.products[0].title).toContain(query);
    });

    it('searches products by query in description', async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockProducts });
      const query = 'description 2';
      const matchingProducts = mockProducts.filter(p => 
        p.description.toLowerCase().includes(query.toLowerCase())
      );

      const result = await searchProducts(query);

      expect(api.get).toHaveBeenCalledWith('/products');
      expect(result.products).toHaveLength(matchingProducts.length);
      expect(result.products[0].description).toContain(query);
    });

    it('handles pagination in search results', async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockProducts });
      const query = 'Product';

      const result = await searchProducts(query, 2, 1);

      expect(api.get).toHaveBeenCalledWith('/products');
      expect(result.products).toHaveLength(1); // Only one product for page 2 with limit 1
      expect(result.pagination).toEqual({
        page: 2,
        limit: 1,
        total: mockProducts.length,
      });
    });

    it('returns empty array when no matches found', async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockProducts });
      const query = 'nonexistent product';

      const result = await searchProducts(query);

      expect(api.get).toHaveBeenCalledWith('/products');
      expect(result.products).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
    });

    it('handles API errors', async () => {
      const error = new Error('API error');
      (api.get as jest.Mock).mockRejectedValueOnce(error);

      await expect(searchProducts('test')).rejects.toThrow('API error');
    });
  });
}); 