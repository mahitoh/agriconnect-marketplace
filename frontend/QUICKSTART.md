# 🚀 Quick Start Guide

## Installation

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Development Server

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Building for Production

To create a production build:
```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx      # Navigation bar component
│   │   │   └── Footer.jsx       # Footer component
│   │   ├── ProductCard.jsx      # Reusable product card
│   │   └── FarmerCard.jsx       # Reusable farmer card
│   ├── pages/
│   │   ├── Home.jsx             # Landing page
│   │   ├── Marketplace.jsx     # Product listing page
│   │   ├── Farmers.jsx         # Farmers listing page
│   │   └── About.jsx           # About page
│   ├── data/
│   │   └── mockData.js         # Mock data for UI development
│   ├── styles/
│   │   └── global.css          # Global styles
│   ├── App.jsx                 # Main app component with routing
│   └── main.jsx                # Entry point
├── package.json
└── README.md
```

## Features

✅ All emoji icons replaced with React Icons  
✅ Responsive design (mobile & desktop)  
✅ React Router for navigation  
✅ Component-based architecture  
✅ Clean, professional UI  
✅ UI-only (no backend connection yet)

## Next Steps

- Connect to backend APIs
- Add authentication pages (Login/Register)
- Implement shopping cart functionality
- Add user dashboards (Farmer/Consumer/Admin)
