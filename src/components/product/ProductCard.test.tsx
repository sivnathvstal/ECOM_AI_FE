import React from 'react';
import { render, screen } from '../../utils/test-utils';
import ProductCard from './ProductCard';
import { mockProducts } from '../../__mocks__/products';

describe('ProductCard', () => {
  const product = mockProducts[0];

  it('renders correctly', () => {
    const { container } = render(<ProductCard product={product} />);
    expect(container).toMatchSnapshot();
  });

  it('displays product information correctly', () => {
    render(<ProductCard product={product} />);
    
    expect(screen.getByTestId(`product-title-${product.id}`)).toHaveTextContent(product.title);
    expect(screen.getByTestId(`product-price-${product.id}`)).toHaveTextContent(`$${product.price.toFixed(2)}`);
    
    // Check if the image is rendered with correct attributes
    const productImage = screen.getByTestId(`product-image-${product.id}`);
    expect(productImage).toHaveAttribute('title', product.title);
  });

  it('has correct link to product details', () => {
    render(<ProductCard product={product} />);
    
    // Check if the view details button links to the correct product page
    const viewDetailsButton = screen.getByTestId(`view-details-${product.id}`);
    expect(viewDetailsButton).toHaveTextContent('View Details');
    expect(viewDetailsButton).toHaveAttribute('href', `/product/${product.id}`);
  });
}); 