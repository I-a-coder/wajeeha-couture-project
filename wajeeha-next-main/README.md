# Wajeeha Couture - E-commerce Website

A modern e-commerce platform for Wajeeha Couture, built with Next.js, Firebase, and Tailwind CSS.

## Features

### Phase 1 (Completed)
- **Responsive Design**: Fully responsive design that works on all devices
- **Product Catalog**: Browse products by collections, new arrivals, and clearance sales
- **Product Details**: Detailed product pages with size selection and stock status
- **Shopping Cart**: Add products to cart and manage quantities
- **User Authentication**: Sign up, login, and profile management
- **Basic Order Management**: View and track orders
- **Firebase Integration**: Real-time database, authentication, and storage

### Phase 2 (New Features)
- **Email Notification System**: Automated email notifications for order confirmations, status updates, shipping, and delivery
- **Advanced Order Management Workflow**: Complete order lifecycle management with status tracking
- **Admin Dashboard**: Comprehensive admin interface for managing orders, viewing statistics, and system settings
- **Enhanced User Account & Order History**: Improved user profile with recent orders, quick actions, and better order tracking

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Email Service**: Nodemailer with Gmail SMTP
- **State Management**: React Context API
- **Deployment**: Vercel/Cloudflare

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Gmail account for email notifications

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

   # Email configuration (for nodemailer)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password_here
   ```

   **Note**: For Gmail, you need to use an App Password, not your regular password. Generate an App Password at: https://support.google.com/accounts/answer/185833

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

## Admin Access

The admin dashboard is accessible to users with the following email addresses:
- `admin@wajeehacouture.com`
- `wajeehahashmi1995@gmail.com`
- `hamnashafeeq10@gmail.com`

To access the admin panel, log in with one of these accounts and navigate to `/admin`.

## Email Notifications

The system sends automated email notifications for:
- **Order Confirmation**: Sent when an order is placed
- **Status Updates**: Sent when order status changes
- **Order Shipped**: Sent when order is marked as shipped
- **Order Delivered**: Sent when order is marked as delivered

Email templates are customizable and include:
- Professional HTML formatting
- Order details and customer information
- Status-specific messaging
- Branded styling

## Admin Dashboard Features

### Orders Management
- View all orders with filtering by status
- Update order status with automatic email notifications
- View detailed order information including customer details and items
- Export orders data to CSV

### System Statistics
- Total orders, products, collections, and users
- Real-time dashboard with key metrics
- Visual status indicators

### Email Settings
- Configure email notification preferences
- Toggle different types of notifications
- Save settings to Firestore

### Data Export
- Export orders data to CSV format
- Download includes order details, customer information, and status

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
│   │   │   ├── orders/        # Orders management
│   │   │   ├── setup/         # System settings
│   │   │   └── layout.js      # Admin layout
│   │   ├── cart/              # Shopping cart
│   │   ├── collections/       # Collections pages
│   │   ├── login/             # Login page
│   │   └── ...                # Other pages
│   ├── data/          # Static data files
│   ├── firebase.js    # Firebase configuration
│   ├── pages/         # API routes
│   │   └── api/
│   │       └── email/         # Email notification endpoints
│   └── utilities/     # Utility components and functions
│       ├── AuthContext.js    # Authentication context
│       ├── CartContext.js    # Shopping cart context
│       ├── DataService.js    # Data service functions
│       ├── EmailService.js   # Email notification service
│       └── ...               # Other utilities
├── .gitignore         # Git ignore file
├── next.config.mjs    # Next.js configuration
├── package.json       # Dependencies and scripts
├── firestore.rules    # Firestore security rules
└── tailwind.config.js # Tailwind CSS configuration
```

## API Endpoints

### Email Notifications
- `POST /api/email/send-order-notification` - Send order-related email notifications

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

## Environment Variables

Make sure to set up the following environment variables in your deployment platform:

### Required Variables
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `EMAIL_USER`
- `EMAIL_PASSWORD`

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For any inquiries, please contact [your-email@example.com](mailto:your-email@example.com).
