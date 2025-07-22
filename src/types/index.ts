export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: number;
  userId: number;
  date: string;
  products: CartProduct[];
}

export interface CartProduct {
  productId: number;
  quantity: number;
  product?: Product;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationParams;
} 