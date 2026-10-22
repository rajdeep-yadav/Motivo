# Motivo — Vehicle Rental Management System

> **Tagline:** Your Journey, Your Way.  
> **Project Scope:** Enterprise-Grade Full-Stack Vehicle Rental Management System (Academic Capstone & Industry Practicals).  
> **Repository:** [https://github.com/rajdeep-yadav/Motivo.git](https://github.com/rajdeep-yadav/Motivo.git)

---

## 1. Executive Summary & Problem Statement

Modern vehicle rental systems frequently suffer from severe design and architectural flaws:
- **Price Drift & Client-Side Calculation Vulnerabilities:** Rental prices calculated or submitted from browsers can be tampered with.
- **Booking Overlaps & Concurrency Collisions:** Naive booking checks allow double-booking during concurrent reservations.
- **Hidden Fees & Complex Minimum Billing:** Opaque deposit calculations and fractional-hour ambiguities confuse clients.
- **Disconnected Dashboards & Static Mockups:** Prototypes that showcase UI without persistent state or functional administrative oversight.

**Motivo** solves these challenges by providing an architectural, production-ready platform that combines:
1. **Understated Luxury Automotive Aesthetics:** Warm ivory (`#F7F6F2`), charcoal (`#20221F`), and muted sage (`#606D5B`) with fluid micro-interactions, dark/light themes, and responsive layouts.
2. **Authoritative 24-Hour Rate Calculation:** Strict server-side ceiling logic where any fraction of a 24-hour cycle advances to the next billable day.
3. **Deterministic Atomic Availability:** Mathematical interval collision checking that permits seamless adjacent handovers while blocking overlapping slots.
4. **End-to-End Enterprise Role Separation:** Separate secure portals for Guests, Registered Customers, and Fleet Command Administrators.

---

## 2. Technology Stack

### Frontend Architecture
- **Framework:** React 19 (Vite Build Tooling)
- **Primary Language:** JavaScript / React JSX
- **Styling & Design System:** Tailwind CSS v4 with custom CSS design tokens (`--bg-main`, `--text-primary`, `--accent-sage`, `--surface-sage`, `--border-fine`, `--card-bg`)
- **Icons:** Lucide React (geometric, high-contrast)
- **Analytics & Visualizations:** Recharts (Area charts for revenue curve, Bar charts for volume)
- **Routing:** React Router v7

### Backend Architecture
- **Runtime:** Node.js (v18+ LTS, v20, v22, v24 verified)
- **Framework:** Express.js RESTful API
- **Execution:** Pure JavaScript (`node dist/server.js` or `npm run dev:js`) compiled from structured models
- **Database & ODM:** MongoDB Atlas with Mongoose
- **Security & Middleware:** Helmet, CORS, Express-Rate-Limit, Bcrypt.js (12 salt rounds), JSON Web Tokens (JWT)
- **Resilience:** Dual-mode persistence engine with automatic in-memory fallback store

---

## 3. Core Engine Specifications

### A. Authoritative 24-Hour Pricing Engine
All financial computations are strictly executed by the backend. Client-submitted prices are rejected.
$$\text{billableDays} = \max\left(1, \left\lceil \frac{\text{returnDateTime} - \text{pickupDateTime}}{24 \times 60 \times 60 \times 1000} \right\rceil\right)$$

- **Base Charge:** $\text{dailyRate} \times \text{billableDays}$
- **Zero-Dep Insurance (Optional):** ₹350 per billable day
- **GST (Goods & Services Tax):** Exactly 18% computed on net billable services
- **Total Amount:** $\text{Base Charge} + \text{Add-ons} - \text{Discounts} + \text{GST}$

### B. Mathematical Availability & Collision Avoidance
To prevent overlapping reservations while strictly allowing adjacent bookings (e.g., Return at 10:00 AM, Pickup at 10:00 AM on the same day):
$$\text{existingPickup} < \text{requestedReturn} \quad\land\quad \text{existingReturn} > \text{requestedPickup}$$
Active blocking states: `Pending`, `Confirmed`, and `Active`. Non-blocking states: `Completed`, `Cancelled`, and `Rejected`.

---

## 4. Repository Structure

```text
motivo/
├── client/                     # Frontend Single-Page Application (React 19 + Vite)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, Modal dialogues, Cards
│   │   ├── context/            # AuthContext (JWT session), ThemeContext (dark/light)
│   │   ├── pages/              # Home, Catalogue, Detail, Dashboards, Notifications
│   │   ├── services/           # api.js API client with auto-injected Bearer tokens
│   │   ├── App.jsx / App.tsx   # Top-level routing and ProtectedRoute wrappers
│   │   └── index.css           # Global tokens, animations, custom scrollbars
│   ├── package.json
│   └── vite.config.ts
├── server/                     # Backend REST API (Node.js + Express + Mongoose)
│   ├── dist/                   # Compiled, ready-to-run pure JavaScript server files
│   │   ├── server.js           # Production JavaScript server entrypoint
│   │   ├── app.js              # Express app with security middlewares
│   │   ├── controllers/        # Auth, Booking, Vehicle, Admin, Payment controllers
│   │   ├── models/             # Mongoose schemas: User, Vehicle, Booking, Payment, Notification
│   │   └── services/           # PricingService, AvailabilityService
│   ├── src/                    # Source architecture definitions
│   ├── package.json            # Scripts including dev:js, start:js, test
│   └── .env.example            # Safe environment template
├── .gitignore                  # Git privacy rules (protects .env and credentials)
└── README.md                   # Complete architectural guide
```

---

## 5. Setup & Local Installation

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **MongoDB Atlas** cluster URI or local MongoDB instance

### Quick Start Guide

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/rajdeep-yadav/Motivo.git
   cd Motivo
   ```

2. **Install Dependencies:**
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client && npm install

   # Install server dependencies
   cd ../server && npm install
   cd ..
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` in `server/` to `server/.env`:
   ```bash
   cp server/.env.example server/.env
   ```
   Provide your values in `server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_ORIGIN=http://localhost:5173
   MONGODB_URI=mongodb+srv://motivo_app:<db_password>@motivo.cluster.mongodb.net/motivo?retryWrites=true&w=majority
   JWT_SECRET=your_secure_jwt_secret_key_here
   ```

4. **Seed Demonstration Data (Optional):**
   Populate MongoDB with 12 Indian vehicles (Thar 4x4, Tata Safari, Royal Enfield Himalayan, Audi, Porsche):
   ```bash
   npm run seed --prefix server
   ```

5. **Start Both Applications:**

   **Backend (JavaScript / Node.js):**
   ```bash
   # Run compiled JavaScript server
   npm run start:js --prefix server
   # Or run with auto-reload:
   npm run dev --prefix server
   ```

   **Frontend (Vite / React):**
   ```bash
   npm run dev --prefix client
   ```

   Open your browser at **[http://localhost:5173](http://localhost:5173)**. The Vite server automatically proxies `/api` requests to port `5000`.

---

## 6. Demonstration Credentials

For instant grading, evaluation, or pair-programming demos, fast-fill demo buttons are provided on the `/login` route:

| Role | Account Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Fleet Administrator** | `admin@motivo.com` | `Admin@Motivo2026` | Full Fleet Command, Telemetry Map, Booking Confirmations, Revenue Charts |
| **Verified Customer** | `rajdeep@motivo.com` | `Customer@Motivo2026` | Vehicle reservations, simulated payment checkout, PDF-ready invoices, trip ledger |

---

## 7. Verified API Endpoint Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Server uptime and health check |
| `POST` | `/api/auth/register` | Public | Register new customer account (rate-limited) |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue signed JWT |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current authenticated user profile |
| `GET` | `/api/vehicles` | Public | Browse fleet with search, filter, pagination, & sorting |
| `GET` | `/api/vehicles/:id` | Public | Retrieve single vehicle specifications & availability |
| `POST` | `/api/bookings` | Customer | Create a booking with server-side pricing |
| `GET` | `/api/bookings/my` | Customer | Retrieve customer's personal booking ledger |
| `PUT` | `/api/bookings/:id/cancel`| Customer/Admin | Cancel eligible pending/confirmed booking |
| `POST` | `/api/payments/simulate`| Customer | Complete simulated payment generating invoice |
| `GET` | `/api/payments/:id/receipt`| Customer/Admin | Retrieve detailed transaction receipt |
| `GET` | `/api/admin/dashboard` | Admin Only | Real-time fleet KPI tiles, category breakdown, & charts |
| `POST` | `/api/admin/vehicles` | Admin Only | Add new vehicle to fleet registry |
| `PATCH`| `/api/admin/vehicles/:id/status`| Admin Only | Toggle operational status (Available / Maintenance) |
| `PATCH`| `/api/admin/bookings/:id/status`| Admin Only | Advance booking status (Confirmed, Active, Completed) |

---

## 8. Automated Testing & Verification

Motivo includes an automated test suite verifying mathematical price boundaries and collision avoidance:

```bash
npm test --prefix server
```

**Verified Test Coverage:**
- Rental durations of exactly 1h, 24h, 25h, 48h, and 49h.
- Mathematical booking overlap logic allowing adjacent handovers.
- Negative rate and invalid schedule rejection.
- Zero-dep insurance daily rate multipliers.

---

## 9. Security & Privacy Guarantees

- **Credential Hygiene:** Real MongoDB connection strings, JWT keys, and environment files are strictly excluded from version control via `.gitignore`.
- **Zero Real Banking Risk:** Simulated payments use deterministic sandbox logic and generate realistic invoice numbers (`INV-MOT-XXXXXX`) without requesting real credit cards.
- **OWASP Alignment:** Protected routes enforce token validation and role checks; users cannot inspect other accounts' bookings or invoices.

---

## 10. Authors & Institutional Attribution

- **Project Lead:** Rajdeep Yadav  
- **Engineering Hub:** TCET Mumbai, Maharashtra, India  
- **Official Inquiries:** `zenovaontop@gmail.com`  
- **License:** MIT License
