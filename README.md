# E-Commerce Frontend Application

A modern e-commerce frontend built with React, TypeScript, and Material-UI. This app allows users to browse products, view details, filter/search, and manage a shopping cart—all with a responsive UI and robust test coverage.

## Features
- Product listing with search and category filter
- Product details page
- Shopping cart management
- Pagination
- Responsive Material-UI design
- 100% test coverage (Jest + React Testing Library)

## Prerequisites
- Node.js (v12 or higher)
- npm (v6+) or yarn

## Setup & Installation
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ECOM_AI_FE
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

## Running the Application
### Development
```bash
npm run dev
# or
yarn dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
# or
yarn build
```

## Linting
Check and fix code style using ESLint:
```bash
npm run lint      # Check
npm run lint:fix  # Auto-fix
```

## Testing & Coverage
Run all tests:
```bash
npm test
# or
yarn test
```

Generate a coverage report:
```bash
npm run test -- --coverage
# or
yarn test --coverage
```
Open `coverage/lcov-report/index.html` in your browser to view detailed coverage.

## Project Structure
```
src/
├── components/       # UI components (common, product, cart)
├── pages/            # Page components
├── services/         # API services
├── context/          # React context for state management
├── types/            # TypeScript types
├── App.tsx           # Main App component
└── index.tsx         # Entry point
```

## API
This app uses the [FakeStoreAPI](https://fakestoreapi.com/) for product and cart data.
