# 🎨 AgriConnect Frontend
## User Interface for the Digital Farmer-to-Consumer Marketplace

---

## 📌 Overview

The **AgriConnect Frontend** is a responsive web interface that enables farmers, consumers, and administrators to interact with the AgriConnect digital marketplace. It provides an intuitive, accessible, and user-friendly experience for browsing agricultural products, managing orders, and making secure payments via MTN Mobile Money.

The frontend communicates with the backend through RESTful APIs and ensures seamless navigation across all user roles.

---

## 🎯 Frontend Objectives

- Provide a clean and intuitive user interface
- Enable easy navigation for different user roles
- Display real-time product and transaction data
- Ensure mobile and desktop responsiveness
- Facilitate secure payment initiation via MTN Mobile Money

---

## 🧱 Frontend Technology Stack

- **React.js** – Component-based UI development
- **Tailwind CSS** – Responsive and modern styling
- **React Router** – Client-side routing
- **Axios** – API communication
- **Context API** – Authentication and global state management

---

## 🧭 Application Navigation Structure

The frontend uses **role-based navigation**, meaning menus and pages change depending on whether the user is a **Farmer**, **Consumer**, or **Administrator**.

---

## 🗂️ Pages & Screens

### 🔓 Public Pages (Accessible to All Users)

| Page | Description |
|----|----|
| Home | Landing page introducing the platform |
| Login | User authentication page |
| Register | User account creation page |
| Marketplace | Public product browsing page |
| Product Details | Detailed view of a selected product |
| About | Information about the platform |
| Contact | Support and contact information |

---

### 👩‍🌾 Farmer Pages

| Page | Description |
|----|----|
| Farmer Dashboard | Overview of sales, orders, and products |
| Add Product | Form to upload new agricultural products |
| Manage Products | Edit or delete existing products |
| Orders | View and manage incoming consumer orders |
| Payments | View received payments and transaction history |
| Profile | Manage farmer account details |

---

### 🛒 Consumer Pages

| Page | Description |
|----|----|
| Consumer Dashboard | Overview of orders and spending |
| Cart | View selected products before checkout |
| Checkout | Order confirmation and payment initiation |
| Payment Status | Display MTN MoMo payment result |
| Orders | Track placed orders |
| Profile | Manage consumer account information |

---

### 🛠️ Administrator Pages

| Page | Description |
|----|----|
| Admin Dashboard | System overview and statistics |
| User Management | Approve or suspend farmers |
| Product Management | Monitor all listed products |
| Transaction Logs | View payment and order records |
| Reports | Platform activity summaries |

---

## 🧩 Reusable UI Components

### Core Components
- Navbar
- Footer
- Sidebar (role-based)
- Product Card
- Order Card
- Payment Modal
- Alert / Notification Component
- Loader / Spinner

### Form Components
- Input Fields
- Select Dropdowns
- Buttons
- Validation Messages

---

## 🔁 User Flow (Frontend Perspective)

### Consumer Flow
```
Home → Marketplace → Product Details → Cart → Checkout → MTN MoMo Payment → Order Confirmation
```

### Farmer Flow
```
Login → Farmer Dashboard → Add Product → Receive Orders → View Payments
```

### Admin Flow
```
Login → Admin Dashboard → User Approval → Transaction Monitoring
```

---

## 💳 Payment UI Integration (MTN MoMo)

The frontend initiates payments by:
- Collecting phone number and amount
- Sending payment request to backend
- Displaying payment status (pending, success, failed)
- Redirecting user after confirmation

All sensitive payment logic is handled by the backend.

---

## 📁 Frontend Folder Structure

```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   ├── data/
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── README.md
```

---

## 📱 Responsiveness & Accessibility

- Mobile-first design approach
- Responsive layouts using Tailwind CSS
- Accessible buttons, forms, and navigation
- Consistent color scheme and typography

---

## 🧪 Frontend Testing

- Manual UI testing
- Form validation testing
- Role-based navigation testing
- Payment flow testing with MTN MoMo sandbox

---

## 🎨 UI/UX Design Guidelines

- Minimalist and clean design
- Agricultural-themed color palette
- Clear call-to-action buttons
- Non-AI-generated layout approach
- Consistent spacing and typography

---

## 📈 Future Frontend Enhancements

- Mobile app UI
- Dark mode
- Multi-language support
- Real-time notifications
- Product reviews and ratings

---

## 📚 Academic Justification

The frontend design ensures usability, accessibility, and transparency, making it suitable for real-world agricultural trade systems and aligning with software engineering best practices taught at The ICT University.

---

## 👨‍🎓 Author

**Name:** [Your Full Name]  
**Department:** Information and Communication Technology  
**Institution:** The ICT University, Cameroon  

---

## 📜 License

This frontend application is developed strictly for academic purposes.
