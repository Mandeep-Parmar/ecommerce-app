# Ecommerce App (MERN + Admin Panel)

A **production-ready full-stack e-commerce application** built with the MERN stack, featuring a customer storefront, admin dashboard, and a secure backend API with **Razorpay payment integration**.

---

## 🌐 Live Demo

-  **Frontend (User App)**  
  https://forever-by-mandeep.vercel.app/

-  **Admin Panel**  
  https://forever-admin-by-mandeep.vercel.app/

-  **Backend API**  
  https://ecommerce-app-o0th.onrender.com/

---

## Project Highlights

- Modern React apps powered by Vite and Tailwind CSS
- Centralized REST API with Express + MongoDB (Mongoose)
- JWT-based auth for users and admin-only protected endpoints
- Product image handling through Cloudinary + Multer uploads
- Cart and order management with COD and Razorpay checkout flows
- Fully functional **Admin Dashboard**
- Clean UI with **empty state handling & UX improvements**

---

## Tech Stack

### Frontend (Customer)

* React (Vite)
* Tailwind CSS
* Axios
* React Router
* Context API

### Admin Panel

* React (Vite)
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Bcrypt

### Integrations

* Razorpay (Payments)
* Cloudinary (Image Uploads)
* Multer (File Handling)

---

## Monorepo Structure

```text
ecommerce-app/
  frontend/   # Customer-facing storefront
  admin/      # Admin dashboard
  backend/    # REST API + business logic
```

---

## Core Features

###  Customer App (`frontend`)

* Browse products & collections
* Add to cart (size-based selection)
* Search and filter products
* Update quantities & manage cart
* Prevent checkout with empty cart (multi-layer validation)
* Place orders via:

  * Cash on Delivery (COD)
  * Razorpay (online payment)
* View order history with status tracking

---

### Admin App (`admin`)

* Admin authentication
* Add products with image uploads (Cloudinary)
* View product list
* Manage orders & update order status

---

### Backend API (`backend`)

* JWT-based user authentication
* Admin-protected routes
* Product CRUD operations
* Cart synchronization with DB
* Order placement & payment verification
* Razorpay order creation + verification

---

## Environment Variables

### `backend/.env`

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_secret

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

---

### `frontend/.env`

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your_key
```

---

### `admin/.env`

```env
VITE_BACKEND_URL=http://localhost:4000
```

---

## Local Setup

### 1) Clone the repository

```bash
git clone <your-repo-url>
cd ecommerce-app
```

### 2) Install dependencies

Install each app separately:

```bash
cd backend && npm install
cd ../frontend && npm install
cd ../admin && npm install
```

### 3) Add environment variables

Create the `.env` files shown above inside `backend`, `frontend`, and `admin`.

### 4) Start services (three terminals)

Backend:

```bash
cd backend
npm run server
```

Frontend:

```bash
cd frontend
npm run dev
```

Admin:

```bash
cd admin
npm run dev
```

## API Overview

Base URL: `http://localhost:4000`

### Main Routes:

* `/api/user` → Authentication
* `/api/product` → Product APIs
* `/api/cart` → Cart management
* `/api/order` → Orders & payments

---

## Deployment Notes

- Deploy backend and set all backend env vars in your host
- Deploy `frontend` and `admin` as static apps (Vite build output)
- Set `VITE_BACKEND_URL` to your deployed API URL in both frontend apps
- Configure CORS in backend for production frontend/admin origins

---


# Author

**Mandeep Parmar**

* GitHub: https://github.com/Mandeep-Parmar
* LinkedIn: https://www.linkedin.com/in/mandeep-p-b44930327/

---

## License

This project is created for **educational purposes**.
