import React from 'react';
import { render, screen, fireEvent } from '../../utils/test-utils';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { container } = render(<SearchBar onSearch={mockOnSearch} />);
    expect(container).toMatchSnapshot();
  });

  it('renders with initial query', () => {
    render(<SearchBar onSearch={mockOnSearch} initialQuery="test query" />);
    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue('test query');
  });

  it('updates input value when typing', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByTestId('search-input');
    
    fireEvent.change(input, { target: { value: 'new search' } });
    expect(input).toHaveValue('new search');
  });

  it('calls onSearch with trimmed query when form is submitted', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByTestId('search-input');
    const form = screen.getByTestId('search-form');
    
    fireEvent.change(input, { target: { value: '  search term  ' } });
    fireEvent.submit(form);
    
    expect(mockOnSearch).toHaveBeenCalledWith('search term');
  });

  it('calls onSearch when search button is clicked', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByTestId('search-input');
    const button = screen.getByTestId('search-button');
    
    fireEvent.change(input, { target: { value: 'button click search' } });
    fireEvent.click(button);
    
    expect(mockOnSearch).toHaveBeenCalledWith('button click search');
  });

  it('does not call onSearch when submitting an empty query', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const form = screen.getByTestId('search-form');
    
    fireEvent.submit(form);
    
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
}); 