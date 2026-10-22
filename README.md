# Motivo — Vehicle Rental Management System

> **Tagline:** Your Journey, Your Way.  
> **Project Scope:** Full-Stack Industry Practicals Engineering Project.  
> **Repository:** [https://github.com/rajdeep-yadav/Motivo.git](https://github.com/rajdeep-yadav/Motivo.git)

---

## 1. Executive Summary

**Motivo** is an architectural full-stack vehicle rental management system featuring an understated, modern automotive design aesthetic inspired by high-end mobility studios. It integrates a React 19 + TypeScript frontend styled with warm ivory (`#F7F6F2`), charcoal (`#20221F`), and muted sage accents (`#606D5B`) with an Express.js & MongoDB Atlas backend.

---

## 2. Technology Stack

### Frontend
- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (Design tokens: warm ivory, charcoal, muted sage, full dark mode toggle)
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Analytics Charts:** Recharts

### Backend
- **Runtime:** Node.js v24
- **Framework:** Express.js RESTful API
- **Language:** TypeScript
- **Database ODM:** Mongoose with MongoDB Atlas
- **Security:** Helmet, CORS, Express-Rate-Limit, Bcrypt.js, JWT

---

## 3. Key Architecture & Features

1. **Editorial Automotive Visual Design:** Follows a curated editorial layout, minimalist silhouette iconography, and real-time fleet metrics inspired by the visual reference.
2. **Authoritative 24-Hour Server-Side Pricing:**
   $$\text{billableDays} = \lceil \frac{\text{rentalDuration}}{24 \text{ hours}} \rceil$$
   Prevents price tampering from browser state.
3. **Mathematical Availability & Concurrency Protection:**
   $$\text{existingPickup} < \text{requestedReturn} \quad\land\quad \text{existingReturn} > \text{requestedPickup}$$
   Guarantees collision-free booking windows while supporting adjacent bookings.
4. **Lifecycle State Machine:**
   `Pending` $\rightarrow$ `Confirmed` $\rightarrow$ `Active` (Pickup recorded) $\rightarrow$ `Completed` (Return recorded), plus `Cancelled` and `Rejected`.
5. **Simulated Payment Sandbox:**
   Realistic checkout simulation producing numbered receipts (`INV-MOT-XXXXXX`) and transaction IDs without storing real banking credentials.
6. **Role-Based Access Control:**
   - **Guest:** Fleet discovery, filtering, specifications, date check.
   - **Customer:** Profile management, booking creation, cancellation, simulated payment, in-app notifications.
   - **Administrator:** Fleet additions & operational status toggles, booking lifecycle confirmations, customer directory, revenue trend charts.

---

## 4. Setup and Installation

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- MongoDB Atlas cluster URI

### Installation Commands

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rajdeep-yadav/Motivo.git
   cd Motivo
   ```

2. **Install dependencies:**
   ```bash
   # Install root, client, and server dependencies
   npm install
   cd client && npm install
   cd ../server && npm install
   cd ..
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `server` directory (or see `server/.env.example`):
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_ORIGIN=http://localhost:5173
   MONGODB_URI=mongodb+srv://motivo_app:<db_password>@motivo.i7x6660.mongodb.net/motivo?retryWrites=true&w=majority
   JWT_SECRET=motivo_production_secret_key_change_in_real_env_2026
   ```

4. **Seed Demonstration Data:**
   Once your MongoDB URI is configured:
   ```bash
   npm run seed --prefix server
   ```

5. **Start Development Servers:**
   ```bash
   # Terminal 1 (Backend API):
   npm run dev --prefix server

   # Terminal 2 (Frontend Client):
   npm run dev --prefix client
   ```
   Open `http://localhost:5173` in your browser.

---

## 5. Demo Accounts

For instant academic evaluation, use the one-click fast login buttons on the login page, or use:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@motivo.com` | `Admin@Motivo2026` |
| **Customer** | `rajdeep@motivo.com` | `Customer@Motivo2026` |

---

## 6. Automated Testing

Run the automated test suite verifying server pricing and availability math:
```bash
npm test --prefix server
```
**Results:** 11 / 11 tests passing.
