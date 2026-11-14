# fintrack-frontend

Modern FinSet Financial Dashboard & Expense Tracker client built with **React 19**, **Vite**, and **Lucide Icons**, connected to the live Render Cloud Backend API and MongoDB Atlas.

## Overview
A high-performance personal finance management interface featuring:
- **Exact FinSet Dashboard:** Financial overview with dual-line SVG area chart, comparing budget and expense capsule bars, and statistics donut chart.
- **Credit & Debit Transactions:** Real-time ledger with search, category filtering, type filtering (credit/debit), date range queries, and add/edit/delete modal workflows.
- **Monthly Bills Management:** Manage recurring bills with due days, paid/unpaid/overdue statuses, and one-click bill payment with automated transaction creation.
- **Upcoming Bill Calendar:** Interactive monthly grid displaying bill due days, day-cell indicators, and countdown timeline.
- **Monthly Excel Sheet Reports:** Export formatted Microsoft Excel (`.xlsx`) workbooks with dedicated Month & Year selection popup modal or whole data export.
- **Light & Dark Theme Engine:** Seamless switching between crisp light aesthetic and night dark theme with persistent CSS variables.
- **User Authentication:** Login and Sign Up modals with password hashing and demo login.
- **Connected Backend:** Configured to communicate with the live Render Cloud Backend (`https://fintrack-backend-itqd.onrender.com`).

## Tech Stack
- **Framework:** React 19 + Vite 8
- **Icons:** Lucide React
- **Styling:** Custom FinSet CSS Design System with responsive variables & dark mode
- **Deployment Ready:** Vercel, Netlify, Render Static Site, GitHub Pages

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Alaudeen407/fintrack-frontend.git
cd fintrack-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory (or use `.env.example`):
```env
VITE_API_BASE_URL=https://fintrack-backend-itqd.onrender.com/api
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.

## Live Backend API
- **Render Production Backend:** [https://fintrack-backend-itqd.onrender.com](https://fintrack-backend-itqd.onrender.com)
- **Database:** MongoDB Atlas Cloud (`finset_db`)
