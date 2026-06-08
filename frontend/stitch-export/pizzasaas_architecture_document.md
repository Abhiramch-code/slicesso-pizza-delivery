# PizzaSaaS Frontend Architecture

## Project Structure
```text
pizza-saas/
├── src/
│   ├── assets/             # Images and static assets
│   ├── components/         # Reusable UI components
│   │   ├── layout/         # Navbar, Sidebar, Footer
│   │   ├── ui/             # Buttons, Cards, Inputs (Shadcn-like)
│   │   └── features/       # Feature-specific components (PizzaCard, InventoryTable)
│   ├── pages/              # Page components (Routes)
│   ├── styles/             # Global CSS and Tailwind config
│   ├── hooks/              # Custom React hooks
│   ├── context/            # React Context for Auth, Cart, etc.
│   ├── App.jsx             # Main App component with Router
│   └── main.jsx            # Entry point
├── tailwind.config.js      # Tailwind configuration
└── vite.config.js          # Vite configuration
```

## Routing Strategy
- `/` - Landing Page
- `/login` - Auth (Login/Register)
- `/dashboard` - User Dashboard
- `/builder` - Pizza Builder Wizard
- `/cart` - Shopping Cart
- `/track/:id` - Order Tracking
- `/admin` - Admin Dashboard (Metrics)
- `/admin/inventory` - Inventory Management
- `/admin/analytics` - Analytics Deep Dive

## Component Extraction Plan
- **Layouts**: 
    - `MainLayout`: Navbar + Footer (for customer pages)
    - `AdminLayout`: Sidebar + Header (for admin pages)
    - `AuthLayout`: Split screen for Login/Register
- **Shared Components**:
    - `TopNavBar`: From {{DATA:COMPONENTS:COMPONENTS_3}}
    - `SideNavBar`: From {{DATA:COMPONENTS:COMPONENTS_3}}
    - `Footer`: From {{DATA:COMPONENTS:COMPONENTS_3}}
    - `GlassCard`: Reusable glassmorphism wrapper
    - `PizzaPreview`: Live pizza visual component
