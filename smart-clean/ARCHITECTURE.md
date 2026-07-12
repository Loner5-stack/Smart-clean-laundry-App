# Smart-Clean: Core Architecture & State

## 1. The Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Neon (PostgreSQL) - Serverless setup.
- **ORM:** Prisma v7 (Using `prisma.config.ts` pattern).
- **Currency:** USD exclusively (No local currency).

## 2. Global Brand Tokens

- **Primary:** Electric Cobalt (`#2962FF`)
- **Secondary:** Sunset Pop (`#FC9D41`)
- **Accent:** Boutique Gold (`#C5A572`)
- **Dark Base:** Obsidian (`#0B1118`) / **Light Base:** Pure White (`#FFFFFF`)

## 3. Data Schema & Logic

- **User Roles (RBAC):** `CUSTOMER`, `STAFF`, `RIDER`, `ADMIN`.
- **Database Structure:** \* `User` table (UUIDs, Role Enum, JSON Metadata for preferences).
  - `Order` table (Relational mapping to User, JSON Cart, strict `OrderStatus` Enum).
- **Middleware:** Implemented route-protection (e.g., blocking CUSTOMER from `/admin`).

## 4. Current Milestone Status

- Next.js initialized with Tailwind CSS.
- Prisma initialized, connected to Neon, and `db push` executed successfully.
- Prisma Client instantiated safely using `globalThis` singleton pattern.
- Next step: Frontend implementation of the Authentication (Login/Signup) screens.
