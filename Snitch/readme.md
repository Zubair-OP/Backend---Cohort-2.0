# Snitch

Snitch is a full-stack e-commerce application with seller and buyer flows, Google authentication, cart and checkout, Stripe payments, ImageKit media handling, and a built-in AI chat experience.

This repository contains a Node.js/Express backend and a React/Vite frontend.

## What This Project Does

- Lets users register, log in, and continue with Google.
- Supports role-based access for buyers and sellers.
- Allows sellers to create products, add variants, and manage listings.
- Allows buyers to browse products, filter/search, manage cart items, and complete checkout.
- Uses Stripe for payment intent creation and webhook-based payment confirmation.
- Uses ImageKit for product media.
- Includes a chat endpoint for streaming AI responses.

## Tech Stack

### Backend

- Node.js
- Express 5
- MongoDB + Mongoose
- Passport Google OAuth 2.0
- JWT cookies
- Stripe
- ImageKit
- Redis
- Helmet, CORS, Morgan, Multer

### Frontend

- React 19
- Vite
- React Router
- Redux Toolkit
- Axios
- Stripe React SDK
- React Toastify
- Tailwind CSS v4

## Project Structure

```text
Snitch/
├── backend/
│   ├── server.js
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── validator/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── store.js
│   │   └── main.jsx
│   └── package.json
└── readme.md
```

## Main User Flow

### Buyer Flow

1. Open the homepage.
2. Browse products or search/filter them.
3. Open a product detail page.
4. Add the product to cart.
5. Go to cart and adjust quantities.
6. Proceed to checkout.
7. Create a Stripe payment intent.
8. Complete payment.
9. Payment success is confirmed through the Stripe webhook.

### Seller Flow

1. Sign in as a seller.
2. Open the seller dashboard.
3. Create products.
4. Add or update product variants.
5. View and manage listed products.

### Google Login Flow

1. Click Continue with Google.
2. Browser goes to the backend Google auth endpoint.
3. Google sends the user back to the callback URL.
4. Backend creates or finds the user.
5. Backend sets the session cookie.
6. User is redirected to the frontend app.

## Routes

### Frontend Routes

- `/` - Home
- `/register` - Register
- `/login` - Login
- `/Dashboard` - Seller dashboard
- `/create-product` - Create product
- `/product/:id` - Product detail
- `/seller-product/:Productid` - Seller product detail
- `/cart` - Cart
- `/checkout` - Checkout
- `/payment-success` - Payment success page

### Backend Auth Routes

- `POST /api/auth/register`
- `GET /api/auth/google`
- `GET /api/auth/google/callback`
- `POST /api/auth/login`
- `GET /api/auth/get-me`
- `GET /api/auth/logout`

### Backend Product Routes

- `POST /api/products/add`
- `GET /api/products/list`
- `GET /api/products/user-list`
- `GET /api/products/filter`
- `GET /api/products/details/:id`
- `POST /api/products/variants/:productId`
- `PUT /api/products/variants/:productId/:variantId`
- `DELETE /api/products/variants/:productId/:variantId`

### Backend Cart Routes

- `POST /api/cart/add/:productId`
- `POST /api/cart/add/:productId/:variantId`
- `PATCH /api/cart/increment/:productId`
- `PATCH /api/cart/increment/:productId/:variantId`
- `PATCH /api/cart/decrement/:productId`
- `PATCH /api/cart/decrement/:productId/:variantId`
- `GET /api/cart/get`
- `DELETE /api/cart/clear`

### Backend Payment Routes

- `POST /api/payments/create-intent`
- `GET /api/payments/:paymentId`
- `POST /api/payments/webhook`

### Backend Chat Route

- `POST /api/chat/stream`

## Prerequisites

- Node.js 18+ recommended
- MongoDB connection string
- Redis connection details
- Stripe secret and webhook secret
- Google OAuth credentials
- ImageKit credentials
- Frontend and backend URLs for local or production use

## Local Setup

### 1) Backend

Install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`.

Example local backend env:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
IMG_KIT_PRIVATE_KEY=your_imagekit_private_key
IMG_KIT_PUBLIC_KEY=your_imagekit_public_key
IMG_KIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
GROQ_API_KEY=your_groq_api_key
```

Run backend:

```bash
npm run dev
```

By default the backend runs on port `3000`.

### 2) Frontend

Install dependencies:

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`.

Example local frontend env:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Run frontend:

```bash
npm run dev
```

Frontend typically runs on `http://localhost:5173`.

## Production / Render Setup

If the app is deployed on Render, use the live Render URL consistently.

### Backend Render env

```env
FRONTEND_URL=https://backend-cohort-2-0-1-xbxh.onrender.com
GOOGLE_CALLBACK_URL=https://backend-cohort-2-0-1-xbxh.onrender.com/api/auth/google/callback
```

### Frontend Render env

```env
VITE_API_BASE_URL=https://backend-cohort-2-0-1-xbxh.onrender.com
```

### Google Cloud Console

Add these Authorized Redirect URIs:

```text
https://backend-cohort-2-0-1-xbxh.onrender.com/api/auth/google/callback
http://localhost:3000/api/auth/google/callback
```

Important:

- The redirect URI must match exactly.
- Do not add extra trailing slashes.
- Do not mix `http` and `https`.
- Use the Render base URL for production and localhost only for local development.

## Important Notes

- Authentication uses HttpOnly cookies.
- Production cookies are configured for cross-site usage with `SameSite=None` and `Secure`.
- Stripe webhook processing requires the raw request body route to stay before `express.json()`.
- Images from ImageKit and Unsplash are allowed by the backend CSP.
- The backend trusts the proxy in production so Render can forward the correct request scheme.

## Environment Variable Rules

### Local

- `FRONTEND_URL=http://localhost:5173`
- `GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback`
- `VITE_API_BASE_URL=http://localhost:3000`

### Production

- `FRONTEND_URL=https://backend-cohort-2-0-1-xbxh.onrender.com`
- `GOOGLE_CALLBACK_URL=https://backend-cohort-2-0-1-xbxh.onrender.com/api/auth/google/callback`
- `VITE_API_BASE_URL=https://backend-cohort-2-0-1-xbxh.onrender.com`

## Troubleshooting

### Google login shows `redirect_uri_mismatch`

- Check the exact callback URL in Google Cloud Console.
- Make sure the Render `GOOGLE_CALLBACK_URL` matches the registered URI exactly.
- Redeploy backend after editing env values.

### `401 Unauthorized` on `/get-me`

- Make sure the cookie is being sent.
- In production, both frontend and backend must use the deployed Render URL.
- Clear browser cookies and hard refresh after deployment.

### Images are blocked by CSP

- Make sure the backend CSP allows the image host.
- Product images use ImageKit, while some UI images use Unsplash.

### Payment page fails to load Stripe.js

- Verify the backend CSP includes `https://js.stripe.com`.
- Verify the frontend Stripe publishable key is present.

## Development Commands

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm run dev
npm run build
```

## Summary

Snitch is a role-based e-commerce platform with Google authentication, product management, cart and checkout, Stripe payments, image uploads, and streaming chat. This README is meant to help a new developer understand the whole project quickly and run it both locally and in production.