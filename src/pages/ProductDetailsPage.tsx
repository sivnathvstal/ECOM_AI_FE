import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  CircularProgress,
  Paper
} from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import './ProductDetailsPage.css';

interface ParamTypes {
  id: string;
}

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<ParamTypes>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem, isLoading: cartLoading } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(parseInt(id, 10));
        setProduct(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (product) {
      await addItem(product.id, 1);
    }
  };

  if (loading) {
    return (
      <Container className="product-details-container" data-testid="product-details-loading">
        <Box className="loader-container">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="product-details-container" data-testid="product-details-error">
        <Typography color="error">
          {error || 'Product not found'}
        </Typography>
      </Container>
    );
  }

  return (
    <Container className="product-details-container" data-testid="product-details-page">
      <Paper className="product-details-paper">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <img 
              src={product.image} 
              alt={product.title} 
              className="product-image"
              data-testid="product-image"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className="product-details">
              <Typography 
                variant="h4" 
                component="h1" 
                className="product-title"
                data-testid="product-title"
              >
                {product.title}
              </Typography>
              <Typography 
                variant="h5" 
                component="p" 
                className="product-price"
                data-testid="product-price"
              >
                ${product.price.toFixed(2)}
              </Typography>
              <Typography 
                variant="body1" 
                component="div" 
                className="product-description"
                data-testid="product-description"
              >
                {product.description}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={cartLoading}
                className="add-to-cart-button"
                data-testid="add-to-cart-button"
              >
                Add to Cart
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProductDetailsPage; 