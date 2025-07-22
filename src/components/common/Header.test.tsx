import React from 'react';
import { render, screen } from '../../utils/test-utils';
import Header from './Header';

describe('Header', () => {
  it('renders correctly', () => {
    const { container } = render(<Header />);
    expect(container).toMatchSnapshot();
  });

  it('displays the app title', () => {
    render(<Header />);
    expect(screen.getByTestId('app-title')).toHaveTextContent('E-Commerce Shop');
  });

  it('displays the cart button', () => {
    render(<Header />);
    const cartButton = screen.getByTestId('cart-button');
    expect(cartButton).toBeInTheDocument();
  });

  it('links to the correct routes', () => {
    render(<Header />);
    const titleLink = screen.getByTestId('app-title');
    const cartButton = screen.getByTestId('cart-button');

    expect(titleLink).toHaveAttribute('href', '/');
    expect(cartButton).toHaveAttribute('href', '/cart');
  });
}); 