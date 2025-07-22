import React from 'react';
import { render, screen, fireEvent } from '../../utils/test-utils';
import Pagination from './Pagination';
import { PaginationParams } from '../../types';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();
  
  const renderPagination = (pagination: PaginationParams) => {
    return render(
      <Pagination 
        pagination={pagination}
        onPageChange={mockOnPageChange}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { container } = renderPagination({ page: 1, limit: 8, total: 24 });
    expect(container).toMatchSnapshot();
  });

  it('displays current page and total pages', () => {
    renderPagination({ page: 2, limit: 8, total: 24 });
    expect(screen.getByTestId('page-info')).toHaveTextContent('Page 2 of 3');
  });

  it('disables previous button on first page', () => {
    renderPagination({ page: 1, limit: 8, total: 24 });
    const prevButton = screen.getByTestId('previous-page');
    expect(prevButton).toBeDisabled();
  });

  it('enables previous button when not on first page', () => {
    renderPagination({ page: 2, limit: 8, total: 24 });
    const prevButton = screen.getByTestId('previous-page');
    expect(prevButton).not.toBeDisabled();
  });

  it('disables next button on last page', () => {
    renderPagination({ page: 3, limit: 8, total: 24 });
    const nextButton = screen.getByTestId('next-page');
    expect(nextButton).toBeDisabled();
  });

  it('enables next button when not on last page', () => {
    renderPagination({ page: 2, limit: 8, total: 24 });
    const nextButton = screen.getByTestId('next-page');
    expect(nextButton).not.toBeDisabled();
  });

  it('calls onPageChange with previous page when previous button is clicked', () => {
    renderPagination({ page: 2, limit: 8, total: 24 });
    const prevButton = screen.getByTestId('previous-page');
    fireEvent.click(prevButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange with next page when next button is clicked', () => {
    renderPagination({ page: 2, limit: 8, total: 24 });
    const nextButton = screen.getByTestId('next-page');
    fireEvent.click(nextButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('does not call onPageChange when previous button is clicked on first page', () => {
    renderPagination({ page: 1, limit: 8, total: 24 });
    const prevButton = screen.getByTestId('previous-page');
    fireEvent.click(prevButton);
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('does not call onPageChange when next button is clicked on last page', () => {
    renderPagination({ page: 3, limit: 8, total: 24 });
    const nextButton = screen.getByTestId('next-page');
    fireEvent.click(nextButton);
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });
}); 