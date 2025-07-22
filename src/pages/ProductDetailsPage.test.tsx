import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '../utils/test-utils';
import { Route, MemoryRouter } from 'react-router-dom';
import ProductDetailsPage from './ProductDetailsPage';
import * as productService from '../services/productService';
import * as cartContext from '../context/CartContext';
import { mockProducts } from '../__mocks__/products';
import { mockCartContext } from '../__mocks__/cartContext';

// Mock the productService
jest.mock('../services/productService', () => ({
  getProductById: jest.fn(),
}));

// Mock the useCart hook
jest.mock('../context/CartContext', () => ({
    ...jest.requireActual('../context/CartContext'),
  useCart: jest.fn(),
}));

describe('ProductDetailsPage', () => {
  const product = mockProducts[0];
  
  beforeEach(() => {
    jest.clearAllMocks();
    (productService.getProductById as jest.Mock).mockResolvedValue(product);
    (cartContext.useCart as jest.Mock).mockReturnValue(mockCartContext);
  });

  const renderWithRouter = async (id: number) => {
    let container;
    await act(async () => {
      const rendered = render(
        <MemoryRouter initialEntries={[`/product/${id}`]}>
          <Route path="/product/:id">
            <ProductDetailsPage />
          </Route>
        </MemoryRouter>
      );
      container = rendered.container;
    });
    return { container };
  };

  it('renders correctly', async () => {
    const { container } = await renderWithRouter(product.id);
    await waitFor(() => expect(productService.getProductById).toHaveBeenCalled());
    expect(container).toMatchSnapshot();
  });

  it('displays loading state initially', async () => {
    renderWithRouter(product.id);
    expect(screen.getByTestId('product-details-loading')).toBeInTheDocument();
  });

  it('fetches and displays product details', async () => {
    await renderWithRouter(product.id);
    
    // Wait for product to be fetched
    await waitFor(() => expect(productService.getProductById).toHaveBeenCalledWith(product.id));
    
    // Check if product details are rendered
    expect(screen.getByTestId('product-title')).toHaveTextContent(product.title);
    expect(screen.getByTestId('product-price')).toHaveTextContent(`$${product.price.toFixed(2)}`);
    expect(screen.getByTestId('product-description')).toHaveTextContent(product.description);
    
    const image = screen.getByTestId('product-image');
    expect(image).toHaveAttribute('src', product.image);
    expect(image).toHaveAttribute('alt', product.title);
  });

  it('displays error message when API call fails', async () => {
    const error = new Error('Failed to fetch product details');
    (productService.getProductById as jest.Mock).mockRejectedValue(error);
    
    await renderWithRouter(999); // Non-existent product ID
    
    await waitFor(() => {
      expect(screen.getByTestId('product-details-error')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch product details')).toBeInTheDocument();
    });
  });

  it('displays "Product not found" when product is null', async () => {
    (productService.getProductById as jest.Mock).mockResolvedValue(null);
    
    await renderWithRouter(999); // Non-existent product ID
    
    await waitFor(() => {
      expect(screen.getByTestId('product-details-error')).toBeInTheDocument();
      expect(screen.getByText('Product not found')).toBeInTheDocument();
    });
  });

  it('adds product to cart when "Add to Cart" button is clicked', async () => {
    await renderWithRouter(product.id);
    
    // Wait for product to be fetched
    await waitFor(() => expect(productService.getProductById).toHaveBeenCalled());
    
    // Click the "Add to Cart" button
    await act(async () => {
      fireEvent.click(screen.getByTestId('add-to-cart-button'));
    });
    
    // Check if addItem was called with the correct parameters
    expect(mockCartContext.addItem).toHaveBeenCalledWith(product.id, 1);
  });

  it('disables "Add to Cart" button when cart is loading', async () => {
    (cartContext.useCart as jest.Mock).mockReturnValue({
      ...mockCartContext,
      isLoading: true
    });
    
    await renderWithRouter(product.id);
    
    // Wait for product to be fetched
    await waitFor(() => expect(productService.getProductById).toHaveBeenCalled());
    
    // Check if the "Add to Cart" button is disabled
    const addToCartButton = screen.getByTestId('add-to-cart-button');
    expect(addToCartButton).toBeDisabled();
  });
}); 