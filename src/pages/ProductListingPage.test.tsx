import React from 'react';
import { render, screen, fireEvent, waitFor, act, within } from '../utils/test-utils';
import ProductListingPage from './ProductListingPage';
import * as productService from '../services/productService';
import { mockProductsResponse, mockProducts } from '../__mocks__/products';

// Mock the productService
jest.mock('../services/productService', () => ({
  getProducts: jest.fn(),
  searchProducts: jest.fn(),
  getCategories: jest.fn(),
}));

describe('ProductListingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (productService.getProducts as jest.Mock).mockResolvedValue(mockProductsResponse);
    (productService.searchProducts as jest.Mock).mockResolvedValue(mockProductsResponse);
    (productService.getCategories as jest.Mock).mockResolvedValue(['electronics', 'clothing']);
  });

  it('renders correctly', async () => {
    let container;
    await act(async () => {
      const rendered = render(<ProductListingPage />);
      container = rendered.container;
    });
    
    await waitFor(() => expect(productService.getProducts).toHaveBeenCalled());
    expect(container).toMatchSnapshot();
  });

  it('displays loading state initially', async () => {
    
      render(<ProductListingPage />);
    
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('fetches and displays products', async () => {
    await act(async () => {
      render(<ProductListingPage />);
    });
    
    // Wait for products to be fetched
    await waitFor(() => expect(productService.getProducts).toHaveBeenCalled());
    
    // Check if products are rendered
    await waitFor(() => {
      mockProducts.forEach(product => {
        expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument();
      });
    });
  });

  it('displays error message when API call fails', async () => {
    const error = new Error('Failed to fetch products');
    (productService.getProducts as jest.Mock).mockRejectedValue(error);
    
    await act(async () => {
      render(<ProductListingPage />);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to fetch products');
    });
  });

  it('displays no results message when no products are found', async () => {
    (productService.getProducts as jest.Mock).mockResolvedValue({
      products: [],
      pagination: { page: 1, limit: 8, total: 0 }
    });
    
    await act(async () => {
      render(<ProductListingPage />);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('no-results')).toBeInTheDocument();
      expect(screen.getByTestId('no-results')).toHaveTextContent('No products found');
    });
  });

  it('searches for products when search query is submitted', async () => {
    await act(async () => {
      render(<ProductListingPage />);
    });
    
    // Wait for initial products to load
    await waitFor(() => expect(productService.getProducts).toHaveBeenCalled());
    
    // Find search input and submit a search query
    const searchInput = screen.getByTestId('search-input');
    const searchForm = screen.getByTestId('search-form');
    
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'test query' } });
    });
    
    await act(async () => {
      fireEvent.submit(searchForm);
    });
    
    // Check if searchProducts was called with the correct parameters
    await waitFor(() => {
      expect(productService.searchProducts).toHaveBeenCalledWith('test query', 1, 8);
    });
  });

  it('filters products by category when category is selected', async () => {
    await act(async () => {
      render(<ProductListingPage />);
    });
    
    // Wait for initial products to load
    await waitFor(() => expect(productService.getProducts).toHaveBeenCalled());
    
    // Find category select and open dropdown
    const categorySelect = screen.getByTestId('category-select');
    fireEvent.mouseDown(categorySelect.querySelector('[role="button"]') || categorySelect);
    // Wait for the listbox to appear
    const listbox = await screen.findByRole('listbox');
    // Click on the electronics option
    const electronicsOption = within(listbox).getByTestId('category-electronics');
    fireEvent.click(electronicsOption);
    // Check if getProducts was called with the correct parameters
    await waitFor(() => {
      expect(productService.getProducts).toHaveBeenCalledWith(1, 8, 'electronics');
    });
  });

  it('changes page when pagination controls are used', async () => {
    // Override pagination for this test to ensure there are 2 pages
    (productService.getProducts as jest.Mock).mockResolvedValue({
      products: mockProducts,
      pagination: { page: 1, limit: 2, total: 4 },
    });
    await act(async () => {
      render(<ProductListingPage />);
    });
    // Wait for initial products to load
    await waitFor(() => expect(productService.getProducts).toHaveBeenCalled());
    // Find and click the next page button
    const nextPageButton = screen.getByTestId('next-page');
    await act(async () => {
      fireEvent.click(nextPageButton);
    });
    // Check if getProducts was called with the correct page
    await waitFor(() => {
      expect(productService.getProducts).toHaveBeenCalledWith(2, 2, '');
    });
  });
  it('calls setError(null) on successful fetch', async () => {
    await act(async () => {
      render(<ProductListingPage />);
    });
    await waitFor(() => expect(productService.getProducts).toHaveBeenCalled());
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });

  it('handles error in fetchProducts', async () => {
    (productService.getProducts as jest.Mock).mockRejectedValue(new Error('Failed to fetch products'));
    await act(async () => {
      render(<ProductListingPage />);
    });
    await waitFor(() => expect(screen.getByTestId('error-message')).toBeInTheDocument());
    expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to fetch products');
  });
}); 