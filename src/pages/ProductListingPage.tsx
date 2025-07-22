import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress
} from '@material-ui/core';
import ProductCard from '../components/product/ProductCard';
import SearchBar from '../components/common/SearchBar';
import CategoryFilter from '../components/common/CategoryFilter';
import Pagination from '../components/common/Pagination';
import { getProducts, searchProducts } from '../services/productService';
import { Product, PaginationParams } from '../types';
import './ProductListingPage.css';

const ProductListingPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 8,
    total: 0,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let response;
      
      if (searchQuery) {
        response = await searchProducts(searchQuery, pagination.page, pagination.limit);
      } else {
        response = await getProducts(pagination.page, pagination.limit, selectedCategory);
      }
      
      setProducts(response.products);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, selectedCategory, searchQuery]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page on category change
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page on search
  };

  return (
    <Container className="product-listing-container" data-testid="product-listing-page">
      <Typography variant="h4" component="h1" className="product-listing-title" data-testid="page-title">
        Products
      </Typography>
      
      <Box className="filter-container">
        <Box className="search-container-wrapper">
          <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
        </Box>
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onCategoryChange={handleCategoryChange} 
        />
      </Box>
      
      {loading ? (
        <Box className="loader-container" data-testid="loading-indicator">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" data-testid="error-message">
          {error}
        </Typography>
      ) : products.length === 0 ? (
        <Typography className="no-results" data-testid="no-results">
          No products found
        </Typography>
      ) : (
        <>
          <Grid container spacing={3} data-testid="product-grid">
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
          
          <Pagination 
            pagination={pagination} 
            onPageChange={handlePageChange} 
          />
        </>
      )}
    </Container>
  );
};

export default ProductListingPage; 