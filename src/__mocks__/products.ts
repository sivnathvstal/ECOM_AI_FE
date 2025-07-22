import { Product, PaginationParams, ProductsResponse } from '../types';

export const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Test Product 1',
    price: 10.99,
    description: 'Test description 1',
    category: 'electronics',
    image: 'test1.jpg',
    rating: { rate: 4.5, count: 100 },
  },
  {
    id: 2,
    title: 'Test Product 2',
    price: 20.99,
    description: 'Test description 2',
    category: 'clothing',
    image: 'test2.jpg',
    rating: { rate: 4.0, count: 80 },
  },
  {
    id: 3,
    title: 'Test Product 3',
    price: 15.99,
    description: 'Test description 3',
    category: 'electronics',
    image: 'test3.jpg',
    rating: { rate: 3.5, count: 60 },
  },
  {
    id: 4,
    title: 'Test Product 4',
    price: 25.99,
    description: 'Test description 4',
    category: 'jewelry',
    image: 'test4.jpg',
    rating: { rate: 4.8, count: 120 },
  },
];

export const mockPagination: PaginationParams = {
  page: 1,
  limit: 8,
  total: 4,
};

export const mockProductsResponse: ProductsResponse = {
  products: mockProducts,
  pagination: mockPagination,
};

export const mockCategories: string[] = [
  'electronics',
  'clothing',
  'jewelry',
]; 