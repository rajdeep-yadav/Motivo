# Motivo API Architecture & Endpoint Reference

Motivo adheres to a clean RESTful contract. All endpoints respond in JSON format with standard HTTP status codes.

---

## Base URL
`/api`

---

## 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer account (`name`, `email`, `password`, `phone`, `drivingLicense`). |
| `POST` | `/api/auth/login` | Public | Authenticate user, return JWT and profile object. |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile. |
| `PUT` | `/api/auth/profile` | Authenticated | Update user's personal details. |

---

## 2. Vehicles Endpoints (`/api/vehicles`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/vehicles` | Public | List fleet vehicles with filters (`search`, `category`, `transmission`, `fuelType`, `seats`, `maxPrice`, `pickupDate`, `returnDate`, `sortBy`, `order`, `page`, `limit`). |
| `GET` | `/api/vehicles/:id` | Public | Retrieve detailed vehicle specifications by ID. |
| `GET` | `/api/vehicles/:id/availability` | Public | Check if vehicle is available between `pickupDate` and `returnDate`. |
| `POST` | `/api/vehicles` | Admin | Register new vehicle into the fleet. |
| `PUT` | `/api/vehicles/:id` | Admin | Update vehicle metadata or operational status (`Available`, `Maintenance`, `Retired`). |
| `DELETE`| `/api/vehicles/:id` | Admin | Remove vehicle from fleet. |

---

## 3. Bookings Endpoints (`/api/bookings`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Customer | Create booking reservation with server-side price calculation and availability verification. |
| `GET` | `/api/bookings/my` | Customer | List all bookings belonging to the authenticated customer. |
| `GET` | `/api/bookings/:id` | Authenticated | Retrieve booking by ID (ownership enforced). |
| `PUT` | `/api/bookings/:id/cancel` | Authenticated | Cancel booking according to lifecycle policy (`Pending`, `Confirmed`). |
| `GET` | `/api/bookings` | Admin | List all fleet bookings with optional status filters. |
| `PUT` | `/api/bookings/:id/status` | Admin | Update booking lifecycle status (`Confirmed`, `Rejected`, `Active`, `Completed`). |

---

## 4. Simulated Payments Endpoints (`/api/payments`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/simulate` | Customer | Execute sandbox simulated payment transaction (`Successful`, `Failed`). |
| `GET` | `/api/payments/receipt/:paymentId` | Authenticated | Retrieve generated invoice and payment receipt. |

---

## 5. In-App Notifications Endpoints (`/api/notifications`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | Customer | Retrieve recent notifications and unread count. |
| `PUT` | `/api/notifications/:id/read` | Customer | Mark single notification as read. |
| `PUT` | `/api/notifications/read-all` | Customer | Mark all notifications as read. |

---

## 6. Admin Intelligence & Reports (`/api/admin`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Admin | Aggregate metrics (fleet count, active rentals, pending bookings, client roster, total revenue). |
| `GET` | `/api/admin/reports` | Admin | 7-day revenue trend calculated directly from successful payment transactions. |
| `GET` | `/api/admin/customers` | Admin | Customer roster excluding sensitive password hashes. |
