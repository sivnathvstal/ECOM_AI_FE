import React, { useEffect, useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import { getCategories } from '../../services/productService';
import './CategoryFilter.css';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onCategoryChange }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onCategoryChange(event.target.value as string);
  };

  return (
    <FormControl className="category-filter" data-testid="category-filter">
      <InputLabel id="category-select-label">Category</InputLabel>
      <Select
        labelId="category-select-label"
        id="category-select"
        value={selectedCategory}
        onChange={handleChange}
        disabled={loading}
        data-testid="category-select"
      >
        <MenuItem value="" data-testid="category-all">
          All Categories
        </MenuItem>
        {categories.map((category) => (
          <MenuItem 
            key={category} 
            value={category}
            data-testid={`category-${category}`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CategoryFilter; 