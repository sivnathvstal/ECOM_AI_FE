import React from 'react';
import { 
  Box, 
  Button
} from '@material-ui/core';
import { 
  NavigateBefore, 
  NavigateNext 
} from '@material-ui/icons';
import { PaginationParams } from '../../types';
import './Pagination.css';

interface PaginationProps {
  pagination: PaginationParams;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
  const { page, limit, total } = pagination;
  
  const totalPages = Math.ceil(total / limit);
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;
  
  const handlePrevious = () => {
    if (hasPrevious) {
      onPageChange(page - 1);
    }
  };
  
  const handleNext = () => {
    if (hasNext) {
      onPageChange(page + 1);
    }
  };
  
  return (
    <Box className="pagination-container" data-testid="pagination">
      <Button
        color="primary"
        disabled={!hasPrevious}
        onClick={handlePrevious}
        startIcon={<NavigateBefore />}
        data-testid="previous-page"
      >
        Previous
      </Button>
      <Box className="pagination-info" data-testid="page-info">
        Page {page} of {totalPages}
      </Box>
      <Button
        color="primary"
        disabled={!hasNext}
        onClick={handleNext}
        endIcon={<NavigateNext />}
        data-testid="next-page"
      >
        Next
      </Button>
    </Box>
  );
};

export default Pagination; 