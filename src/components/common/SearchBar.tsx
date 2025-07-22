import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Paper,
  InputBase,
  IconButton
} from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState<string>(initialQuery);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <Paper 
      component="form" 
      className="search-container" 
      onSubmit={handleSubmit}
      data-testid="search-form"
    >
      <InputBase
        className="search-input"
        placeholder="Search products..."
        inputProps={{ 'aria-label': 'search products', 'data-testid': 'search-input' }}
        value={query}
        onChange={handleChange}
      />
      <IconButton 
        type="submit" 
        className="search-button" 
        aria-label="search"
        data-testid="search-button"
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar; 