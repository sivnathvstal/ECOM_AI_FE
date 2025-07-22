import React from 'react';
import { render, screen, fireEvent, act } from '../utils/test-utils';
import CartPage from './CartPage';
import * as cartContext from '../context/CartContext';
import { mockCartContext, mockEmptyCartContext, mockLoadingCartContext, mockErrorCartContext } from '../__mocks__/cartContext';

// Mock the useCart hook
jest.mock('../context/CartContext', () => ({
  ...jest.requireActual('../context/CartContext'),
  useCart: jest.fn(),
}));

describe('CartPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with items in cart', async () => {
    (cartContext.useCart as jest.Mock).mockReturnValue(mockCartContext);
    let container;
    await act(async () => {
      const rendered = render(<CartPage />);
      container = rendered.container;
    });
    expect(container).toMatchSnapshot();
  });

  it('renders loading state', async () => {
    (cartContext.useCart as jest.Mock).mockReturnValue(mockLoadingCartContext);
    await act(async () => {
      render(<CartPage />);
    });
    expect(screen.getByTestId('cart-loading')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    (cartContext.useCart as jest.Mock).mockReturnValue(mockErrorCartContext);
    await act(async () => {
      render(<CartPage />);
    });
    expect(screen.getByTestId('cart-error')).toBeInTheDocument();
    expect(screen.getByText(mockErrorCartContext.error as string)).toBeInTheDocument();
  });

  it('renders empty cart state', async () => {
    (cartContext.useCart as jest.Mock).mockReturnValue(mockEmptyCartContext);
    await act(async () => {
      render(<CartPage />);
    });
    expect(screen.getByTestId('empty-cart')).toBeInTheDocument();
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    
    // Check if continue shopping button is present
    const continueShoppingButton = screen.getByTestId('continue-shopping-button');
    expect(continueShoppingButton).toBeInTheDocument();
    expect(continueShoppingButton).toHaveAttribute('href', '/');
  });

  it('renders cart items correctly', async () => {
    (cartContext.useCart as jest.Mock).mockReturnValue(mockCartContext);
    await act(async () => {
      render(<CartPage />);
    });
    
    // Check if cart title is rendered
    expect(screen.getByTestId('cart-title')).toHaveTextContent('Shopping Cart');
    
    // Check if cart items are rendered
    mockCartContext.cartItems.forEach(item => {
      expect(screen.getByTestId(`cart-item-${item.productId}`)).toBeInTheDocument();
    });
    
    // Check if cart summary is rendered
    expect(screen.getByTestId('cart-summary')).toBeInTheDocument();
    expect(screen.getByTestId('cart-total')).toHaveTextContent(`$${mockCartContext.totalPrice.toFixed(2)}`);
  });

  it('calls removeItem when remove button is clicked', async () => {
    (cartContext.useCart as jest.Mock).mockReturnValue(mockCartContext);
    await act(async () => {
      render(<CartPage />);
    });
    
    // Find and click the remove button for the first item
    const firstItem = mockCartContext.cartItems[0];
    const removeButton = screen.getByTestId(`cart-item-remove-${firstItem.productId}`);
    
    await act(async () => {
      fireEvent.click(removeButton);
    });
    
    // Check if removeItem was called with the correct productId
    expect(mockCartContext.removeItem).toHaveBeenCalledWith(firstItem.productId);
  });

  it('has working checkout button', async () => {
    (cartContext.useCart as jest.Mock).mockReturnValue(mockCartContext);
    await act(async () => {
      render(<CartPage />);
    });
    
    // Find checkout button
    const checkoutButton = screen.getByTestId('checkout-button');
    expect(checkoutButton).toBeInTheDocument();
    expect(checkoutButton).toHaveTextContent('Checkout');
  });

  it('has working continue shopping button', async () => {
    (cartContext.useCart as jest.Mock).mockReturnValue(mockCartContext);
    await act(async () => {
      render(<CartPage />);
    });
    
    // Find continue shopping button
    const continueShoppingButton = screen.getByTestId('continue-shopping');
    expect(continueShoppingButton).toBeInTheDocument();
    expect(continueShoppingButton).toHaveTextContent('Continue Shopping');
    expect(continueShoppingButton).toHaveAttribute('href', '/');
  });
}); 