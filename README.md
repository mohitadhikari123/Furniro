# Furniro - Dynamic Product System

This project now supports dynamic product loading based on product IDs from the database.

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with your MongoDB connection string:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. Seed the database with sample products:
   ```bash
   node src/seedProducts.js
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

## How It Works

### Product Grid
- The `ProductGrid` component now fetches products from the backend API
- Each product card is clickable and navigates to `/product/:id`
- Products are displayed with real data from the database

### Single Product Page
- The `SingleProduct` component fetches product data based on the ID from the URL
- Uses `useParams()` to get the product ID from the route
- Displays all product details including images, description, price, ratings, etc.
- Includes loading states and error handling

### API Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product by ID

## Features

- ✅ Dynamic product loading from database
- ✅ Product details page with real data
- ✅ Loading states and error handling
- ✅ Responsive design
- ✅ Product navigation with breadcrumbs
- ✅ Image gallery for product photos
- ✅ Size selection (if available)
- ✅ Quantity selection
- ✅ Product ratings and reviews display

## Testing

1. Start both backend and frontend servers
2. Navigate to the home page or shop page
3. Click on any product card
4. You should be taken to the product detail page with the specific product's data
5. The URL will show `/product/[product-id]` where the ID is from the database

## Sample Products

The seed script creates 5 sample products:
- Asgaard Sofa (Living)
- Syltherine Chair (Dining)
- Leviosa Bed (Bedroom)
- Lolito Sofa (Living)
- Respira Table (Dining)

Each product has complete data including images, descriptions, prices, ratings, and sizes. 