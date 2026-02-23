# � AgriConnect Marketplace

### A Digital Farmer-to-Consumer Marketplace Platform

AgriConnect is a full-stack web application that connects local farmers in Cameroon directly with consumers, enabling them to list, discover, and purchase fresh agricultural products online with secure MTN Mobile Money payments.

---

## 📌 Project Overview

The agricultural sector in Cameroon faces challenges in connecting small-scale farmers with consumers. AgriConnect bridges this gap by providing a digital marketplace where:

- **Farmers** can list their products, manage inventory, track orders, and receive payments
- **Consumers** can browse products, discover local farmers, place orders, and pay via mobile money
- **Administrators** can oversee the platform, approve farmers, manage users, and monitor transactions

---

## 🧱 Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React.js 18** | Component-based UI development |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first responsive styling |
| **React Router v6** | Client-side routing and navigation |
| **React Query (TanStack)** | Server state management and data fetching |
| **Framer Motion** | Animations and transitions |
| **Axios** | HTTP client for API communication |
| **Context API** | Auth, Cart, and Favorites global state |
| **Radix UI** | Accessible headless UI primitives |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js v5** | REST API framework |
| **Supabase** | PostgreSQL database + Auth + Storage |
| **JWT (jsonwebtoken)** | Token-based authentication |
| **bcryptjs** | Password hashing |
| **Multer** | File/image uploads |
| **express-validator** | Request validation |
| **Axios** | External API calls (MTN MoMo) |

### External Services
| Service | Purpose |
|---|---|
| **Supabase** | Database (PostgreSQL), file storage, and auth |
| **MTN Mobile Money API** | Payment processing |

---

## ✅ Features Implemented

### Authentication & Authorization
- User registration with role selection (Farmer / Consumer)
- Login with JWT-based authentication
- Role-based access control (Consumer, Farmer, Admin)
- Protected routes per user role

### 🛒 Consumer Features
- Browse marketplace with search, category filters, location filters, and sorting
- View detailed product pages
- Add products to cart (grouped by farmer)
- Checkout with MTN Mobile Money payment
- Order history and tracking
- Wishlist / favorites (products and farmers)
- Rate and review purchased products
- Consumer dashboard with order overview

### 👩‍🌾 Farmer Features
- Farmer dashboard with sales overview and statistics
- Add, edit, and delete products with image upload
- Inventory management with low-stock alerts
- Order management (view and track incoming orders)
- Notification system (orders, reviews, stock alerts)
- Profile management with avatar and farm banner upload
- Public farmer profile page visible to consumers

### 🛠️ Admin Features
- Admin dashboard with platform statistics and activity feed
- User management (view, suspend, unsuspend, delete users)
- Farmer approval system (approve/reject pending farmers)
- Transaction monitoring and reporting
- Top farmers leaderboard
- Add new admin accounts

### 💳 Payment Integration
- MTN Mobile Money payment initiation
- Real-time payment status checking
- Payment confirmation and order creation
- Transaction history

### 🎨 UI/UX
- Fully responsive design (mobile + desktop)
- Skeleton loading states for smooth perceived performance
- Animated transitions with Framer Motion
- Agricultural-themed color palette
- Role-based navigation and sidebar

---

## 📁 Project Structure

```
agriconnect-marketplace/
├── backend/
│   ├── src/
│   │   ├── server.js              # Express app entry point
│   │   ├── config/
│   │   │   └── supabase.js        # Supabase client configuration
│   │   ├── controllers/           # Route handler logic
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── orderController.js
│   │   │   ├── adminController.js
│   │   │   ├── paymentController.js
│   │   │   ├── reviewController.js
│   │   │   ├── inventoryController.js
│   │   │   └── ...
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT authentication middleware
│   │   │   ├── errorHandler.js    # Global error handling
│   │   │   └── multer.js          # File upload config
│   │   ├── routes/                # API route definitions
│   │   └── services/
│   │       └── mtnPayment.js      # MTN MoMo integration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Root component with routing
│   │   ├── main.jsx               # App entry point
│   │   ├── components/
│   │   │   ├── layout/            # Navbar, Footer
│   │   │   ├── ui/                # Reusable UI (Button, Input, Skeleton, etc.)
│   │   │   ├── farmer/            # Farmer profile components
│   │   │   ├── ProductCard.jsx
│   │   │   ├── FarmerCard.jsx
│   │   │   └── PaymentForm.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Marketplace.jsx
│   │   │   ├── Farmers.jsx
│   │   │   ├── FarmerProfile.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── dashboard/         # Farmer & Consumer dashboards
│   │   │   └── admin/             # Admin dashboard
│   │   ├── context/               # AuthContext, CartContext, FavoritesContext
│   │   ├── hooks/                 # React Query hooks
│   │   ├── config/                # API configuration
│   │   ├── data/                  # Mock/static data
│   │   └── utils/                 # Auth fetch helper
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🔌 API Endpoints

| Route | Description |
|---|---|
| `/api/auth` | Register, login, password reset |
| `/api/products` | CRUD operations for products |
| `/api/orders` | Order creation and management |
| `/api/reviews` | Product reviews and ratings |
| `/api/favorites` | Wishlist and farmer following |
| `/api/profile` | User profile management |
| `/api/inventory` | Stock management and alerts |
| `/api/marketplace` | Public product and farmer listings |
| `/api/notifications` | Farmer notification system |
| `/api/payment` | MTN Mobile Money payments |
| `/api/cart` | Shopping cart operations |
| `/api/admin` | Admin user/platform management |
| `/api/moderation` | Content moderation |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A Supabase account and project
- MTN MoMo API credentials (for payments)

### 1. Clone the repository
```bash
git clone https://github.com/mahitoh/agriconnect-marketplace.git
cd agriconnect-marketplace
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
MTN_API_KEY=your_mtn_api_key
MTN_API_SECRET=your_mtn_secret
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
```

Start the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🔁 User Flows

### Consumer Flow
```
Home → Marketplace → Product Details → Add to Cart → Checkout → MTN MoMo Payment → Order Confirmation
```

### Farmer Flow
```
Register as Farmer → Await Approval → Dashboard → Add Products → Receive Orders → View Payments
```

### Admin Flow
```
Login → Admin Dashboard → Approve Farmers → Manage Users → Monitor Transactions
```

---

## 📱 Responsiveness

- Mobile-first design using Tailwind CSS
- Responsive grid layouts for product and farmer listings
- Collapsible sidebar navigation on dashboards
- Touch-friendly interactions

---

## 👨‍🎓 Author

**Name:** Mahito  
**Department:** Information and Communication Technology  
**Institution:** The ICT University, Cameroon

---

## 📜 License

This project is developed for academic purposes as part of a university project at The ICT University, Cameroon.
