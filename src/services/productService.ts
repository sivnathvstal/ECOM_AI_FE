import api from './api';
import { Product, ProductsResponse } from '../types';

export const getProducts = async (
  page = 1,
  limit = 8,
  category?: string
): Promise<ProductsResponse> => {
  try {
    // First get all products to calculate total
    const allProductsResponse = await api.get<Product[]>('/products');
    const allProducts = allProductsResponse.data;
    
    // Filter by category if provided
    const filteredProducts = category 
      ? allProducts.filter((product) => product.category === category) 
      : allProducts;
    
    const total = filteredProducts.length;
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    return {
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total
      }
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get<string[]>('/products/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const searchProducts = async (
  query: string,
  page = 1,
  limit = 8
): Promise<ProductsResponse> => {
  try {
    const allProductsResponse = await api.get<Product[]>('/products');
    const allProducts = allProductsResponse.data;
    
    // Filter products by search query
    const filteredProducts = allProducts.filter((product) => 
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    const total = filteredProducts.length;
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    return {
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total
      }
    };
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}; 