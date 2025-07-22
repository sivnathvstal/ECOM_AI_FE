import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@material-ui/core';
import { QueryClient, QueryClientProvider } from 'react-query';
import Header from './components/common/Header';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext';

// Create a client for React Query
const queryClient = new QueryClient();

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CartProvider>
          <Router>
            <Header />
            <Switch>
              <Route exact path="/" component={ProductListingPage} />
              <Route path="/product/:id" component={ProductDetailsPage} />
              <Route path="/cart" component={CartPage} />
            </Switch>
          </Router>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App; 