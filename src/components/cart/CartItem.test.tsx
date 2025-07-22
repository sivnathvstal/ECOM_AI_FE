import React from 'react';
import { render, screen, fireEvent } from '../../utils/test-utils';
import CartItemComponent from './CartItem';
import { mockCartItems } from '../../__mocks__/cartContext';

describe('CartItemComponent', () => {
  const mockOnRemove = jest.fn();
  const cartItem = mockCartItems[0];
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { container } = render(
      <CartItemComponent 
        item={cartItem} 
        onRemove={mockOnRemove} 
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('displays item information correctly', () => {
    render(
      <CartItemComponent 
        item={cartItem} 
        onRemove={mockOnRemove} 
      />
    );
    
    const { productId, quantity, product } = cartItem;
    
    expect(screen.getByTestId(`cart-item-title-${productId}`)).toHaveTextContent(product.title);
    expect(screen.getByTestId(`cart-item-quantity-${productId}`)).toHaveTextContent(`Quantity: ${quantity}`);
    expect(screen.getByTestId(`cart-item-price-${productId}`)).toHaveTextContent(`$${(product.price * quantity).toFixed(2)}`);
    
    const image = screen.getByTestId(`cart-item-image-${productId}`);
    expect(image).toHaveAttribute('src', product.image);
    expect(image).toHaveAttribute('alt', product.title);
  });

  it('calls onRemove when remove button is clicked', () => {
    render(
      <CartItemComponent 
        item={cartItem} 
        onRemove={mockOnRemove} 
      />
    );
    
    const removeButton = screen.getByTestId(`cart-item-remove-${cartItem.productId}`);
    fireEvent.click(removeButton);
    
    expect(mockOnRemove).toHaveBeenCalledWith(cartItem.productId);
  });

  it('returns null when product is undefined', () => {
    const itemWithoutProduct = { ...cartItem, product: undefined };
    const { container } = render(
      <CartItemComponent 
        item={itemWithoutProduct} 
        onRemove={mockOnRemove} 
      />
    );
    
    expect(container.firstChild).toBeNull();
  });
}); 