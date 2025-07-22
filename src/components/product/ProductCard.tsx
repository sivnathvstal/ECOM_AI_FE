import React from 'react';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { Product } from '../../types';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, title, price, image } = product;

  return (
    <Card className="product-card" data-testid={`product-card-${id}`}>
      <CardActionArea component={RouterLink} to={`/product/${id}`}>
        <CardMedia
          className="product-media"
          image={image}
          title={title}
          data-testid={`product-image-${id}`}
        />
        <CardContent className="product-content">
          <Typography 
            gutterBottom 
            variant="h6" 
            component="h2" 
            className="product-title"
            data-testid={`product-title-${id}`}
          >
            {title}
          </Typography>
          <Typography 
            variant="body1" 
            color="textPrimary" 
            component="p" 
            className="product-price"
            data-testid={`product-price-${id}`}
          >
            ${price.toFixed(2)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className="product-actions">
        <Button 
          size="small" 
          color="primary" 
          component={RouterLink} 
          to={`/product/${id}`}
          data-testid={`view-details-${id}`}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard; 