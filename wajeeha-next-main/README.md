# Wajeeha Couture - E-commerce Website

A modern e-commerce platform for Wajeeha Couture, built with Next.js, Firebase, and Tailwind CSS.

## Features

- **Responsive Design**: Fully responsive design that works on all devices
- **Product Catalog**: Browse products by collections, new arrivals, and clearance sales
- **Product Details**: Detailed product pages with size selection and stock status
- **Shopping Cart**: Add products to cart and manage quantities
- **User Authentication**: Sign up, login, and profile management
- **Order Management**: View and track orders
- **Admin Panel**: Manage products, collections, and orders (admin access only)
- **Firebase Integration**: Real-time database, authentication, and storage

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **State Management**: React Context API
- **Deployment**: Vercel/Cloudflare

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wajeeha-couture.git
   cd wajeeha-couture
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # Firebase configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Set up Storage
5. Deploy Firestore rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
6. Deploy Storage rules:
   ```bash
   firebase deploy --only storage:rules
   ```

## Project Structure

```
wajeeha-next-main/
├── public/            # Static files
│   └── assets/        # Images and other assets
├── src/
│   ├── app/           # Next.js app directory
│   │   ├── [collection]/[id]/  # Product detail pages
│   │   ├── accessories/        # Accessories page
│   │   ├── admin/             # Admin pages
│   │   ├── cart/              # Shopping cart
│   │   ├── collections/       # Collections pages
│   │   ├── login/             # Login page
│   │   └── ...                # Other pages
│   ├── data/          # Static data files
│   ├── firebase.js    # Firebase configuration
│   ├── pages/         # API routes
│   └── utilities/     # Utility components and functions
│       ├── AuthContext.js    # Authentication context
│       ├── CartContext.js    # Shopping cart context
│       ├── DataService.js    # Data service functions
│       └── ...               # Other utilities
├── .gitignore         # Git ignore file
├── next.config.mjs    # Next.js configuration
├── package.json       # Dependencies and scripts
└── tailwind.config.js # Tailwind CSS configuration
```

## Deployment

The application can be deployed to Vercel or any other hosting platform that supports Next.js:

```bash
# Build the application
npm run build
# or
yarn build

# Deploy to Vercel
vercel --prod
```

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For any inquiries, please contact [your-email@example.com](mailto:your-email@example.com).
