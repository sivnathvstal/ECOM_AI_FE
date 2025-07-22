import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders correctly', async () => {
    let container;
    await act(async () => {
      const rendered = render(<App />);
      container = rendered.container;
    });
    expect(container).toMatchSnapshot();
  });

  it('renders the header', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/E-Commerce Shop/i)).toBeInTheDocument();
  });

  it('renders the product listing page by default', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/Product Listing/i)).toBeInTheDocument();
  });
}); 