import { Cart, CartProduct } from '../types';

export const mockCartItems: CartProduct[] = [
  {
    productId: 1,
    quantity: 2,
    product: {
      id: 1,
      title: 'Test Product 1',
      price: 10.99,
      description: 'Test description 1',
      category: 'electronics',
      image: 'test1.jpg',
      rating: { rate: 4.5, count: 100 },
    },
  },
  {
    productId: 2,
    quantity: 1,
    product: {
      id: 2,
      title: 'Test Product 2',
      price: 20.99,
      description: 'Test description 2',
      category: 'clothing',
      image: 'test2.jpg',
      rating: { rate: 4.0, count: 80 },
    },
  },
];

export const mockCart: Cart = {
  id: 1,
  userId: 1,
  date: '2023-01-01',
  products: [
    { productId: 1, quantity: 2 },
    { productId: 2, quantity: 1 },
  ],
};

export const mockCartContext = {
  cart: mockCart,
  cartItems: mockCartItems,
  isLoading: false,
  error: null,
  addItem: jest.fn(),
  updateItem: jest.fn(),
  removeItem: jest.fn(),
  totalItems: 3, // 2 + 1
  totalPrice: 42.97, // 10.99*2 + 20.99*1
};

export const mockEmptyCartContext = {
  cart: {
    id: 0,
    userId: 1,
    date: '2023-01-01',
    products: [],
  },
  cartItems: [],
  isLoading: false,
  error: null,
  addItem: jest.fn(),
  updateItem: jest.fn(),
  removeItem: jest.fn(),
  totalItems: 0,
  totalPrice: 0,
};

export const mockLoadingCartContext = {
  ...mockCartContext,
  isLoading: true,
};

export const mockErrorCartContext = {
  ...mockCartContext,
  error: 'Failed to fetch cart',
};

const defaultExport = {
  mockCartItems,
  mockCart,
  mockCartContext,
  mockEmptyCartContext,
  mockLoadingCartContext,
  mockErrorCartContext,
};
export default defaultExport; 