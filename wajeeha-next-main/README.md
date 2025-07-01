# Wajeeha Couture - Dynamic E-commerce Platform

This is the official repository for the Wajeeha Couture e-commerce platform, built with Next.js and Firebase.

## Features

- **Dynamic Product Catalog**: Products and collections stored in Firestore
- **User Authentication**: Secure user accounts with Firebase Authentication
- **Shopping Cart**: Persistent cart that syncs between devices when logged in
- **Order Processing**: Real-time order creation and tracking
- **Responsive Design**: Mobile-friendly interface for all screen sizes

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Deployment**: Vercel/Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wajeeha-next.git
   cd wajeeha-next
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Firebase configuration is already included in the firebase.js file

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to see the application.

### Migration from Static to Dynamic

If you're migrating from the static version to the dynamic version:

1. Read the [Migration Guide](./MIGRATION_GUIDE.md) for step-by-step instructions
2. Run the migration script:
   ```bash
   npm run migrate
   ```

## Project Structure

```
wajeeha-next/
├── public/            # Static assets
├── scripts/           # Utility scripts
│   └── migrateToFirestore.js  # Data migration script
├── src/
│   ├── app/           # Next.js app router pages
│   ├── data/          # Static JSON data (legacy)
│   ├── pages/         # Next.js API routes
│   ├── utilities/     # Utility components and contexts
│   └── firebase.js    # Firebase configuration
├── MIGRATION_GUIDE.md # Guide for migrating to dynamic data
└── package.json       # Project dependencies and scripts
```

## Firebase Collections

The application uses the following Firestore collections:

- **products**: All product data
- **collections**: Fashion collections
- **orders**: Customer orders
- **carts**: User shopping carts
- **staticContent**: Content for static pages (FAQs, policies, etc.)

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is prohibited.

## Phase 1: Core Functionality Implementation

This document summarizes the implementation of core functionality for the Wajeeha Couture e-commerce website.

### Implemented Features

#### User Authentication System
- Firebase Authentication integration
- User signup with email and password
- User login functionality
- Password reset capability
- User profile management
- Authentication state persistence

#### Shopping Cart System
- Cart context for state management across the application
- Add to cart functionality with size and quantity selection
- Cart item count display in the header
- Cart persistence using localStorage for non-authenticated users
- Cart persistence using Firestore for authenticated users
- Cart item management (update quantity, remove items)

#### Database Setup
- Firebase and Firestore integration
- User data storage
- Cart data storage
- Order data storage

#### Basic Checkout Flow
- Multi-step checkout process (cart → shipping → payment → confirmation)
- Form validation
- Order summary display
- Cash on Delivery (COD) payment option

#### Order Confirmation
- Order details display
- Order ID generation
- Shipping details summary
- Order items summary

### Technical Implementation Details

#### Authentication Context
- Created an AuthContext to manage authentication state across the application
- Implemented user signup, login, and password reset functionality
- Added user profile management

#### Cart Context
- Created a CartContext to manage cart state across the application
- Implemented cart persistence using localStorage and Firestore
- Added cart item management functionality

#### UI Components
- Updated the Header component to display authentication state and cart count
- Created responsive checkout forms
- Implemented product detail page with size selection and add to cart functionality
- Added toast notifications for user feedback

#### Database Structure
- Users collection: Stores user profile information
- Carts collection: Stores user cart data
- Orders collection: Stores order information

### Next Steps (Phase 2)
- Email notification system for order confirmations
- Order management workflow
- Admin dashboard for order management
- User account & order history features

---

*Note: This implementation follows the Next.js App Router architecture and uses Firebase/Firestore for backend services.*

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details..
