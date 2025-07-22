import React from 'react';
import { render, screen, fireEvent, waitFor, act, within } from '../../utils/test-utils';
import CategoryFilter from './CategoryFilter';
import * as productService from '../../services/productService';
import { mockCategories } from '../../__mocks__/products';

// Mock the productService
jest.mock('../../services/productService', () => ({
  getCategories: jest.fn(),
}));

describe('CategoryFilter', () => {
  const mockOnCategoryChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (productService.getCategories as jest.Mock).mockResolvedValue(mockCategories);
  });

  it('renders correctly', async () => {
    let container;
    await act(async () => {
      const rendered = render(
        <CategoryFilter 
          selectedCategory="" 
          onCategoryChange={mockOnCategoryChange} 
        />
      );
      container = rendered.container;
    });
    await waitFor(() => expect(productService.getCategories).toHaveBeenCalled());
    expect(container).toMatchSnapshot();
  });

  it('fetches categories on mount', async () => {
    await act(async () => {
      render(
        <CategoryFilter 
          selectedCategory="" 
          onCategoryChange={mockOnCategoryChange} 
        />
      );
    });
    await waitFor(() => expect(productService.getCategories).toHaveBeenCalled());
    
    const select = screen.getByTestId('category-select');
    // Open the dropdown
    fireEvent.mouseDown(select.querySelector('[role="button"]') || select);
    // Wait for the listbox to appear
    const listbox = await screen.findByRole('listbox');
    // Wait for categories to be rendered
    await waitFor(() => {
      expect(within(listbox).getByTestId('category-all')).toBeInTheDocument();
      mockCategories.forEach(category => {
        expect(within(listbox).getByTestId(`category-${category}`)).toBeInTheDocument();
      });
    });
  });

  it('displays the selected category', async () => {
    const selectedCategory = 'electronics';
    await act(async () => {
      render(
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onCategoryChange={mockOnCategoryChange} 
        />
      );
    });
    
    await waitFor(() => expect(productService.getCategories).toHaveBeenCalled());
    const select = screen.getByTestId('category-select');
    fireEvent.mouseDown(select.querySelector('[role="button"]') || select);
    const listbox = await screen.findByRole('listbox');
    const selectedOption = within(listbox).getByText('Electronics');
    expect(selectedOption).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onCategoryChange when a category is selected', async () => {
    await act(async () => {
      render(
        <CategoryFilter 
          selectedCategory="" 
          onCategoryChange={mockOnCategoryChange} 
        />
      );
    });
    
    await waitFor(() => expect(productService.getCategories).toHaveBeenCalled());
    
    const select = screen.getByTestId('category-select');
    // Open the dropdown
    fireEvent.mouseDown(select.querySelector('[role="button"]') || select);
    const listbox = await screen.findByRole('listbox');
    // Click on a category option
    const electronicsOption = within(listbox).getByTestId('category-electronics');
    fireEvent.click(electronicsOption);
    expect(mockOnCategoryChange).toHaveBeenCalledWith('electronics');
  });

  it('handles API error gracefully', async () => {
    const error = new Error('Failed to fetch categories');
    (productService.getCategories as jest.Mock).mockRejectedValue(error);
    
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    await act(async () => {
      render(
        <CategoryFilter 
          selectedCategory="" 
          onCategoryChange={mockOnCategoryChange} 
        />
      );
    });
    
    await waitFor(() => expect(productService.getCategories).toHaveBeenCalled());
    // Open the dropdown
    const select = screen.getByTestId('category-select');
    fireEvent.mouseDown(select.querySelector('[role="button"]') || select);
    const listbox = await screen.findByRole('listbox');
    // Should still render the "All Categories" option
    expect(within(listbox).getByTestId('category-all')).toBeInTheDocument();
    // Should log the error
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching categories:', error);
    consoleErrorSpy.mockRestore();
  });
}); 