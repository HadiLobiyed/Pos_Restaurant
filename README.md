# Restaurant POS System

A full-stack Restaurant POS with **Admin/Staff dashboard** and **Client QR menu ordering**, built with Next.js 14, TypeScript, Prisma, PostgreSQL, TailwindCSS, and NextAuth.

## Features

- **Admin / Staff**: Login, Dashboard (sales & orders today), Sales (filter by date), Menu management (categories + items, visibility), Table management (QR codes, reserve), Kitchen display (orders with status: Pending → In progress → Done, auto-refresh).
- **Client**: Scan table QR → Menu by category → Cart (quantity, comments per item) → Place order (sends to kitchen).

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Prisma ORM** + **PostgreSQL**
- **TailwindCSS**
- **NextAuth** (credentials)
- **QR codes** for table links to `/menu?table=TABLE_ID`

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and set:

   - `DATABASE_URL` – PostgreSQL connection string (e.g. `postgresql://user:password@localhost:5432/restaurant_pos`)
   - `NEXTAUTH_URL` – App URL (e.g. `http://localhost:3000`)
   - `NEXTAUTH_SECRET` – Random secret (e.g. `openssl rand -base64 32`)

3. **Database**

   ```bash
   npx prisma db push
   npm run db:seed
   ```

   Seed creates admin user: **admin@restaurant.com** / **admin123**. Change in production.

4. **Run**

   ```bash
   npm run dev
   ```

   - App: http://localhost:3000  
   - Admin: http://localhost:3000/admin/login  
   - Menu (with table): http://localhost:3000/menu?table=TABLE_ID (use Table Management to get table IDs and QR)

## Scripts

- `npm run dev` – Development server
- `npm run build` – Production build
- `npm run start` – Production server
- `npm run db:push` – Push Prisma schema to DB (no migrations)
- `npm run db:migrate` – Run migrations
- `npm run db:seed` – Seed admin user

## Project Structure

- `app/` – Next.js App Router (pages, layouts)
- `app/admin/` – Admin dashboard (dashboard, sales, menu, tables, kitchen, login)
- `app/menu/` – Client QR menu (categories, cart, place order)
- `app/api/` – API routes (auth, categories, menu, tables, orders, payments)
- `components/` – Reusable UI (admin sidebar, forms, menu client, cart, kitchen cards)
- `lib/` – Prisma client, NextAuth config
- `prisma/` – Schema and seed

## Kitchen real-time updates

Kitchen page polls `/api/orders/kitchen` every 4 seconds so new orders and status changes appear without refresh.
