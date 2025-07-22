import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Divider,
  CircularProgress,
  Paper
} from '@material-ui/core';
import { ShoppingBasket } from '@material-ui/icons';
import CartItemComponent from '../components/cart/CartItem';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage: React.FC = () => {
  const { cartItems, isLoading, error, removeItem, totalItems, totalPrice } = useCart();

  if (isLoading) {
    return (
      <Container className="cart-container" data-testid="cart-loading">
        <Box className="loader-container">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="cart-container" data-testid="cart-error">
        <Typography color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container className="cart-container" data-testid="empty-cart">
        <Paper>
          <Box className="empty-cart">
            <ShoppingBasket className="empty-cart-icon" />
            <Typography variant="h5" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Looks like you haven't added any products to your cart yet.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/"
              data-testid="continue-shopping-button"
            >
              Continue Shopping
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container className="cart-container" data-testid="cart-page">
      <Typography variant="h4" component="h1" className="cart-title" data-testid="cart-title">
        Shopping Cart
      </Typography>
      
      <Box data-testid="cart-items">
        {cartItems.map((item) => (
          <CartItemComponent
            key={item.productId}
            item={item}
            onRemove={removeItem}
          />
        ))}
      </Box>
      
      <Paper className="cart-summary" data-testid="cart-summary">
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        <Divider />
        <Box className="summary-item">
          <Typography variant="body1">
            Items ({totalItems})
          </Typography>
          <Typography variant="body1">
            ${totalPrice.toFixed(2)}
          </Typography>
        </Box>
        <Divider />
        <Box className="summary-item">
          <Typography variant="body1" className="total">
            Total
          </Typography>
          <Typography variant="body1" className="total" data-testid="cart-total">
            ${totalPrice.toFixed(2)}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className="checkout-button"
          data-testid="checkout-button"
        >
          Checkout
        </Button>
        <Button
          variant="outlined"
          component={RouterLink}
          to="/"
          fullWidth
          className="continue-shopping-button"
          data-testid="continue-shopping"
        >
          Continue Shopping
        </Button>
      </Paper>
    </Container>
  );
};

export default CartPage; 