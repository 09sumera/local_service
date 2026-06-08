# Local Service Booking System

A complete production-ready full-stack application built with React, Vite, Tailwind CSS, Node.js, Express, and MySQL.

## Features

- **Role-based Access Control**: Customer, Service Provider, and Admin roles.
- **Customer**: Browse services, book appointments, make payments (demo), write reviews, manage profile.
- **Provider**: Add/edit/delete services, accept/reject/complete bookings, view earnings.
- **Admin**: Dashboard with system stats, manage users, delete reviews.
- **Modern UI**: Tailwind CSS, Dark Mode support, fully responsive.
- **Secure**: JWT Authentication and password hashing with bcrypt.

## Prerequisites

- Node.js (v16+)
- MySQL

## Setup Instructions

1. **Install Dependencies**
   Run the following command in the root directory to install concurrently:
   ```bash
   npm install
   ```
   Install backend and frontend dependencies (this was automatically done during generation, but if not):
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Database Setup**
   Ensure MySQL is running.
   Configure `backend/.env` with your database credentials (an `.env.example` is provided).
   Run the setup script from the root to create the database, tables, and the default admin user:
   ```bash
   node backend/setupDb.js
   ```
   **Default Admin Account:**
   - Email: `admin@gmail.com`
   - Password: `admin123`

3. **Environment Variables**
   Make sure you copy `.env.example` to `.env` in the `backend` folder and update `JWT_SECRET` for production.

4. **Run the Application**
   From the root folder, run:
   ```bash
   npm run dev
   ```
   This uses `concurrently` to start both the Express server (port 5000) and the Vite development server (port 3000) simultaneously.

## Deployment

### 1. Database (Railway)
- Create a MySQL instance on Railway.
- Get the `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` and add them to your Render environment variables.
- You can connect to the Railway DB via a tool like MySQL Workbench and run `schema.sql` to initialize tables.

### 2. Backend (Render)
- Connect your GitHub repository to Render.
- Create a new "Web Service".
- Set Root Directory to `backend`.
- Build Command: `npm install`
- Start Command: `node server.js`
- Add all Environment Variables from your `.env` file.

### 3. Frontend (Vercel)
- Connect your GitHub repository to Vercel.
- Set the framework preset to "Vite".
- Set Root Directory to `frontend`.
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Make sure to update your API calls to point to the deployed Render backend URL (e.g., using `import.meta.env.VITE_API_URL` instead of relative paths, or configure Vercel rewrite rules).
