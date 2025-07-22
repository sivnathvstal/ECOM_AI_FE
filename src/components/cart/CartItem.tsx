import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  IconButton,
  Box
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { CartProduct } from '../../types';
import './CartItem.css';

interface CartItemProps {
  item: CartProduct;
  onRemove: (productId: number) => void;
}

const CartItemComponent: React.FC<CartItemProps> = ({ item, onRemove }) => {
  const { productId, quantity, product } = item;

  if (!product) {
    return null;
  }

  const { title, price, image } = product;

  const handleRemove = () => {
    onRemove(productId);
  };

  return (
    <Paper className="cart-item" data-testid={`cart-item-${productId}`}>
      <Grid container spacing={2}>
        <Grid item>
          <img 
            src={image} 
            alt={title} 
            className="cart-item-image" 
            data-testid={`cart-item-image-${productId}`}
          />
        </Grid>
        <Grid item xs={6} className="cart-item-info">
          <Typography 
            variant="subtitle1" 
            className="cart-item-title"
            data-testid={`cart-item-title-${productId}`}
          >
            {title}
          </Typography>
          <Box className="cart-item-quantity" data-testid={`cart-item-quantity-${productId}`}>
            <Typography variant="body2">
              Quantity: {quantity}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3} className="cart-item-actions">
          <Typography 
            variant="body1" 
            className="cart-item-price"
            data-testid={`cart-item-price-${productId}`}
          >
            ${(price * quantity).toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={1} className="cart-item-actions">
          <IconButton 
            aria-label="delete" 
            onClick={handleRemove}
            data-testid={`cart-item-remove-${productId}`}
          >
            <Delete />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CartItemComponent; 