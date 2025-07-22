# Project Structure

This document describes the organization of the E-Commerce Frontend Application codebase. It is intended to help new contributors and maintainers understand where to find and place code, and to provide a foundation for documenting future updates.

---

## Root Directory
- `package.json`, `tsconfig.json`, `webpack.*.js`: Project configuration files
- `public/`: Static assets and the main HTML template
- `README.md`: Project overview and setup instructions
- `PROJECT_STRUCTURE.md`: (This file) Project structure and organization

## `src/` — Main Source Code

```
src/
├── components/
│   ├── common/    # Shared UI components (Header, SearchBar, Pagination, etc.)
│   ├── product/   # Product-related UI components (ProductCard, etc.)
│   └── cart/      # Cart-related UI components (CartItem, etc.)
├── context/       # React context for global state (CartContext, etc.)
├── pages/         # Top-level page components (ProductListingPage, CartPage, etc.)
├── services/      # API service modules (productService, cartService, etc.)
├── types/         # TypeScript type definitions
├── utils/         # Utility functions and test utilities
├── styles/        # CSS and style modules (if not using CSS-in-JS)
├── App.tsx        # Main application component
└── index.tsx      # Application entry point
```

### Directory Details
- **components/**: All reusable UI components, organized by domain (common, product, cart).
- **context/**: React context providers and hooks for global state management.
- **pages/**: Route-level components, each representing a full page/view.
- **services/**: Modules for API calls and business logic (e.g., fetching products, managing cart).
- **types/**: Centralized TypeScript interfaces and types for data models and props.
- **utils/**: Helper functions, test utilities, and other shared logic.
- **styles/**: CSS files or style modules for component/page styling.

### Key Files
- **App.tsx**: The root React component, sets up routing and layout.
- **index.tsx**: Entry point, renders the app to the DOM.

---

## Testing
- Test files are colocated with the code they test (e.g., `Component.test.tsx` next to `Component.tsx`).
- Mocks and test utilities are in `src/__mocks__/` and `src/utils/`.
- Snapshots are in `__snapshots__/` directories.

---

## Future Updates
- **New modules**: Add new features as directories under `src/` (e.g., `src/orders/` for order management).
- **State management**: If the app grows, consider splitting context or introducing a state library.
- **API integration**: Add new service modules in `src/services/` as needed.
- **Component library**: Extract common UI patterns into `src/components/common/`.
- **Documentation**: Update this file as the project evolves.

---

_Last updated: 2024-05-30_ 