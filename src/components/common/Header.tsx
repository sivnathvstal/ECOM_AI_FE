import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Badge
} from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header: React.FC = () => {
  const { totalItems } = useCart();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          component={RouterLink}
          to="/"
          variant="h6"
          className="header-title"
          data-testid="app-title"
        >
          E-Commerce Shop
        </Typography>
        <IconButton
          component={RouterLink}
          to="/cart"
          color="inherit"
          className="header-cart-button"
          aria-label="Shopping Cart"
          data-testid="cart-button"
        >
          <Badge badgeContent={totalItems} color="secondary" classes={{ badge: "header-badge" }}>
            <ShoppingCart />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 