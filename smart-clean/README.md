# Smart-Clean — Premium Laundry Service Platform

Smart-Clean is a full-stack, production-grade laundry logistics platform built for the Nigerian market. It connects customers who need their clothes cleaned with a managed fleet of riders and a powerful admin operations centre — all in one unified system.

---

## Table of Contents

1. [Product Overview](#product-overview)
2. [The Three Worlds Architecture](#the-three-worlds-architecture)
3. [Full Technology Stack](#full-technology-stack)
4. [System Architecture](#system-architecture)
5. [Project Structure](#project-structure)
6. [Data Schema](#data-schema)
7. [Order Lifecycle](#order-lifecycle)
8. [Loyalty & Subscription System](#loyalty--subscription-system)
9. [Brand Design System](#brand-design-system)
10. [Development Setup](#development-setup)
11. [Environment Variables](#environment-variables)
12. [Deployment](#deployment)
13. [Current Milestone Status](#current-milestone-status)

---

## Product Overview

Smart-Clean is a mobile-first web application that allows customers in Nigeria to:

- Browse and book professional laundry services (Wash & Fold, Dry Clean, Suit Preservation, Shoe Cleaning, and more)
- Schedule a rider pickup from their door
- Track their order through a live 6-stage pipeline
- Manage subscriptions for recurring laundry plans
- Build loyalty through a 3-tier rewards programme

The platform is built to scale to millions of users and is designed with strict persona isolation — customers, riders, and admins each operate in completely separate, secured worlds.

---

## The Three Worlds Architecture

The application enforces a strict **"Three Worlds"** persona isolation model. This prevents data leakage and ensures each user type only sees and does exactly what their role permits.

```
┌─────────────────────────────────────────────────────┐
│                    ADMIN WORLD                       │
│  Full operational visibility and control over both  │
│  Customer and Rider worlds.                          │
│                                                      │
│  ┌─────────────────┐     ┌─────────────────┐        │
│  │  CUSTOMER WORLD │     │   RIDER WORLD   │        │
│  │                 │     │                 │        │
│  │ - Books orders  │◄────│ - Sees pickup   │        │
│  │ - Tracks status │     │   address only  │        │
│  │ - Blind to      │     │ - Blind to      │        │
│  │   rider/admin   │     │   admin/other   │        │
│  │                 │     │   customers     │        │
│  └─────────────────┘     └─────────────────┘        │
└─────────────────────────────────────────────────────┘
```

### Customer World (`/dashboard/*`)
- Public self-registration
- Browse and book cleaning services
- 4-step order wizard with bag-size or per-item selection
- Active order tracking with live status
- Loyalty tier progress and subscription management
- Support ticket submission

### Rider World (`/rider/*`)
- Invitation-only — riders are created exclusively by Admin
- Mobile-first map view showing current pickup/delivery task
- Task list with pending and completed deliveries
- Status update capability (moves orders through the pipeline)
- Blind to admin controls and other customer data

### Admin World (`/admin/*`)
- Full operational oversight of all orders, customers, and riders
- Live order pipeline Kanban with bottleneck detection
- Rider fleet management (invite, suspend, assign, track performance)
- Service catalogue management with live customer preview
- Subscription plan management and subscriber tracking
- Support ticket inbox and FAQ management
- System settings (delivery fee, SLA thresholds, operating zones)
- Security audit log

---

## Full Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 15 (App Router) | Framework for all three UI worlds |
| TypeScript | Type safety across the entire codebase |
| Tailwind CSS v4 | Styling — strict v4 only, no v3 config |
| Framer Motion | Page transitions and component animations |
| shadcn/ui + Radix UI | Accessible component primitives |
| Recharts | Data visualisation in admin dashboard |
| next-themes | Dark / Light mode |

### Backend
| Technology | Purpose |
|---|---|
| Fastify (Node.js) | High-performance REST API server — hosted on Render |
| Prisma v7 | ORM with type-safe database queries — runs on Render |

### Authentication
| Technology | Where It Lives | Purpose |
|---|---|---|
| NextAuth.js v5 (Auth.js) | Vercel (Next.js) | Session management, JWT creation, Google OAuth, cookie handling |
| JWT Verification | Render (Fastify) | Verifies NextAuth-issued JWTs on every incoming API request |

NextAuth runs entirely inside the Next.js app on Vercel. It is **not** a backend service on Render. The Fastify server never creates sessions — it only verifies them. See [API Security Pattern](#api-security-pattern) below.

### Infrastructure
| Technology | Purpose | Host |
|---|---|---|
| PostgreSQL | Primary relational database | Supabase |
| Supabase Storage | Service images, order attachments | Supabase |
| Supabase Realtime | Live order status updates | Supabase |
| Paystack | Payment processing (card + bank transfer) | Paystack |
| Resend | Transactional email notifications | Resend |
| Vercel | Frontend hosting (Next.js) | Vercel |
| Render | Backend API server (Fastify) | Render |

### Why Fastify on Render (not Server Actions)

Smart-Clean is built to handle millions of users from day one. Keeping all data logic inside Next.js Server Actions would create a tight coupling between the UI and the database, and would eventually hit Vercel's serverless function limitations under heavy load.

By hosting a dedicated Fastify API on Render:
- The API runs as a **persistent, always-on server** — no cold starts, no timeout limits
- All three frontends (customer, rider, admin) call the **same centralised API**
- Business logic (order state machine, rider assignment, payment reconciliation) lives in one place
- **Background jobs** (SLA alerts, cron tasks, webhook processing) run reliably on the Render server
- The system can scale the API independently of the frontend
- WebSocket connections for real-time tracking are persistent and stable

Fastify was chosen over Express for its significantly higher throughput (~40% faster), first-class TypeScript support, and built-in schema validation.

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         VERCEL                               │
│                    (Next.js Frontend)                        │
│                                                              │
│   /dashboard/*     /rider/*      /admin/*     /login        │
│   Customer UI    Rider UI       Admin UI      Auth UI       │
│                                                              │
│   NextAuth.js (session management, role-based middleware)    │
└───────────────────────────┬──────────────────────────────────┘
                            │  HTTPS (REST API calls)
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                         RENDER                               │
│               (Fastify Node.js API Server)                   │
│                                                              │
│   /api/auth/*      Authentication endpoints                  │
│   /api/orders/*    Order management & state transitions      │
│   /api/riders/*    Rider assignment & tracking               │
│   /api/customers/* Customer profile & history                │
│   /api/services/*  Service catalogue                         │
│   /api/payments/*  Paystack webhook receiver                 │
│   /api/admin/*     Admin operations                          │
│                                                              │
│   Prisma ORM ──────────────────────────────────────────────► │
│   Resend (email triggers)                                    │
│   Paystack SDK (payment processing)                          │
│   Node-cron (scheduled jobs)                                 │
└───────────────────────────┬──────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
┌─────────▼──────┐ ┌───────▼───────┐ ┌──────▼──────────┐
│   SUPABASE     │ │   SUPABASE    │ │    PAYSTACK     │
│   PostgreSQL   │ │   Storage     │ │   Payment API   │
│                │ │               │ │                 │
│  All relational│ │ Service images│ │ Card + Bank     │
│  data, RBAC,   │ │ Order photos  │ │ Transfer        │
│  order history │ │ Stain reports │ │                 │
└────────────────┘ └───────────────┘ └─────────────────┘
```

---

## API Security Pattern

Every request from the Next.js frontend (Vercel) to the Fastify API (Render) must carry two credentials in the HTTP headers:

```
Authorization: Bearer <nextauth-jwt>
X-API-Secret: <api-secret-key>
```

### How It Works

```
┌─────────────────────────────────┐
│     VERCEL (Next.js)            │
│                                 │
│  1. User logs in via NextAuth   │
│  2. NextAuth issues a JWT and   │
│     sets a secure cookie        │
│  3. On any data request, the    │
│     Next.js app reads the JWT   │
│     from the session and sends  │
│     it to Render along with the │
│     API_SECRET_KEY              │
└──────────────┬──────────────────┘
               │
               │  Headers:
               │  Authorization: Bearer <jwt>
               │  X-API-Secret: <secret>
               │
┌──────────────▼──────────────────┐
│     RENDER (Fastify)            │
│                                 │
│  4. Fastify middleware checks   │
│     X-API-Secret — proves the   │
│     request came from our own   │
│     frontend, not a random      │
│     caller                      │
│                                 │
│  5. Fastify verifies the JWT    │
│     signature using the shared  │
│     NEXTAUTH_SECRET — confirms  │
│     who the user is and their   │
│     role (CUSTOMER/RIDER/ADMIN) │
│                                 │
│  6. Business logic runs with    │
│     the verified user identity  │
└─────────────────────────────────┘
```

### Why Both Credentials?

- **`X-API-Secret` alone** would allow anyone who found the secret to impersonate any user. It only proves the request source, not who the user is.
- **`JWT alone`** would allow any valid NextAuth token from any other app using the same secret to call your API. The shared secret binds the API exclusively to this frontend.
- **Together** they enforce: *"This request came from our frontend AND this specific authenticated user made it."*

### Role Enforcement on Render

Once the JWT is verified, the Fastify route handler reads the `role` field from the decoded token and enforces access:

```
CUSTOMER token  →  can only access /api/orders (own orders), /api/services, /api/subscriptions
RIDER token     →  can only access /api/riders/tasks, /api/orders/:id/status
ADMIN token     →  can access all /api/* routes
```

Any mismatch between the token role and the route returns `403 Forbidden` immediately — before any database query runs.

---

## Project Structure

```
smart-clean/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── (portal)/          # Protected admin portal
│   │   │   │   ├── page.tsx        # Overview / Command Centre
│   │   │   │   ├── orders/         # Order routing & management
│   │   │   │   ├── customers/      # Customer list & profiles
│   │   │   │   ├── riders/         # Rider fleet management
│   │   │   │   ├── services/       # Service catalogue management
│   │   │   │   ├── subscriptions/  # Plans & subscriber management
│   │   │   │   ├── support/        # Tickets & FAQ management
│   │   │   │   └── settings/       # Platform configuration
│   │   │   └── login/              # Admin-specific login
│   │   │
│   │   ├── dashboard/             # Customer portal
│   │   │   ├── page.tsx            # Home (returning + first-time user views)
│   │   │   ├── orders/
│   │   │   │   ├── new/            # 4-step order wizard
│   │   │   │   ├── confirmed/      # Post-order confirmation
│   │   │   │   └── [id]/           # Live order tracking
│   │   │   ├── services/           # Full service catalogue
│   │   │   ├── subscriptions/      # Subscription plans
│   │   │   ├── accountability/     # Loyalty tiers & brand pillars
│   │   │   ├── account/            # Profile management
│   │   │   │   └── edit/           # Edit profile form
│   │   │   └── support/            # Customer support & FAQ
│   │   │
│   │   ├── rider/
│   │   │   ├── (portal)/          # Protected rider portal
│   │   │   │   ├── page.tsx        # Map dashboard with active task
│   │   │   │   ├── deliveries/     # Task list (pending/completed)
│   │   │   │   └── profile/        # Rider profile & earnings
│   │   │   └── login/              # Rider-specific login
│   │   │
│   │   ├── login/                 # Customer login
│   │   ├── signup/                # Customer registration
│   │   └── about/                 # Public about page
│   │
│   ├── components/
│   │   ├── admin/                 # Admin-specific components
│   │   │   ├── sidebar.tsx
│   │   │   ├── top-header.tsx
│   │   │   └── order-side-panel.tsx
│   │   ├── dashboard/             # Customer-specific components
│   │   │   ├── order-wizard/      # 4-step order flow components
│   │   │   └── support/           # Contact form, FAQ accordion
│   │   ├── rider/                 # Rider-specific components
│   │   │   └── bottom-nav.tsx
│   │   ├── auth/                  # Shared auth layout components
│   │   └── ui/                    # Shared UI primitives
│   │
│   ├── data/
│   │   ├── mock-dashboard.ts      # Customer mock data
│   │   ├── mock-admin.ts          # Admin mock data & interfaces
│   │   ├── mock-shared.tsx        # Shared: OrderStatus, subscription plans, loyalty config
│   │   ├── order-wizard-data.ts   # Garment items, time slots
│   │   └── (mock-plans.ts merged into mock-shared.tsx)
│   │
│   ├── lib/
│   │   ├── prisma.ts              # Prisma singleton
│   │   ├── api.ts                 # API call stubs (→ Render backend)
│   │   └── utils.ts               # Shared utility functions
│   │
│   ├── types/
│   │   └── order-wizard.ts        # Order state types
│   │
│   └── middleware.ts              # Role-based route protection
│
├── prisma/
│   └── schema.prisma              # Database schema
│
├── public/
│   └── images/
│       └── services/              # Service card images
│
├── ARCHITECTURE.md                # Architecture quick reference
└── README.md                      # This file
```

---

## Data Schema

The Prisma schema defines 4 user roles and 6 order statuses.

### User Roles (RBAC)
| Role | Description |
|---|---|
| `CUSTOMER` | Public registration, places and tracks orders |
| `RIDER` | Invitation-only, handles pickups and deliveries |
| `STAFF` | Facility staff (future — merged under ADMIN for now) |
| `ADMIN` | Full platform control |

### Order Status Lifecycle
| Status | Human Label | Who Sets It |
|---|---|---|
| `PENDING` | Order Placed | System (on checkout) |
| `PICKUP_ASSIGNED` | Rider Assigned | Admin |
| `AT_HUB` | At Cleaning Hub | Rider / Admin |
| `IN_PRODUCTION` | Being Cleaned | Admin |
| `OUT_FOR_DELIVERY` | Out for Delivery | Rider / Admin |
| `COMPLETED` | Delivered | Rider on delivery confirmation |

### Current Models
```prisma
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  role      UserRole  @default(CUSTOMER)
  metadata  Json?     // preferences: starch level, scent, etc.
  orders    Order[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Order {
  id          String      @id @default(uuid())
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  status      OrderStatus @default(PENDING)
  totalAmount Decimal     @db.Decimal(10, 2)  // Naira, exact
  items       Json        // cart items + pickup metadata
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

### Planned Schema Additions (Backend Phase)
The following models will be added when the Fastify backend is built:

- `Rider` — vehicle type, availability status, join date, performance stats
- `Service` — name, category, price, unit, description, isActive, imagePath
- `Subscription` — planName, billingCycle, amount, customerId, status, renewalDate
- `SupportTicket` — subject, message, customerId, status, createdAt
- `AuditLog` — adminId, action, entityType, entityId, timestamp
- `Notification` — userId, type, message, isRead, createdAt

---

## Order Lifecycle

A complete Smart-Clean order flows as follows:

```
Customer places order (Step 4 of wizard)
            │
            ▼
    [PENDING] ─── Admin assigns rider ──► [PICKUP_ASSIGNED]
                                                  │
                                    Rider picks up items
                                                  │
                                                  ▼
                                           [AT_HUB]
                                                  │
                                    Facility begins cleaning
                                                  │
                                                  ▼
                                         [IN_PRODUCTION]
                                                  │
                                    Cleaning complete, rider dispatched
                                                  │
                                                  ▼
                                       [OUT_FOR_DELIVERY]
                                                  │
                                    Rider delivers to customer
                                                  │
                                                  ▼
                                           [COMPLETED]
```

At each stage transition:
- The customer's tracking page updates (polling every 30s, upgrading to Supabase Realtime)
- A notification is sent to the relevant party (Resend email + push notification)
- The admin pipeline Kanban updates in real time

---

## Order Wizard Flow

The customer booking experience is a 4-step wizard:

```
Step 1: Choose Service
        └── Everyday Laundry (Standard) | Specialist Care (Premium)
        └── Info tooltips per service
        └── Tap a service card → advances to Step 2

Step 2: Add Items
        ├── Weight-based services (Wash & Fold):
        │   ├── By Bag Size (Quick estimate — Small / Medium / Large)
        │   └── By Item (Exact pricing per garment)
        ├── Specialist services:
        │   └── Per-item selection with quantity controls
        ├── Inline stain report (optional, both modes)
        └── "Add Another Service" to build a multi-service order

Step 3: Pickup Details
        ├── Location (home address from profile or new address)
        ├── Pickup Date (next 7 days, horizontally scrollable)
        └── Time Slot (Morning / Afternoon / Evening — 3-column grid)

Step 4: Review & Confirm
        ├── Full order summary (items, bags, stain report)
        ├── Pickup details
        ├── Payment method (Card via Paystack / Bank Transfer)
        └── Place Order → Confirmation screen
```

---

## Loyalty & Subscription System

### Loyalty Tiers
| Tier | Requirement | Discount |
|---|---|---|
| Tier 1 | 0–10 orders | 0% |
| Tier 2 | 11–30 orders | 1% on all orders |
| Tier 3 | 31+ orders | 2% on all orders + Priority Queue |

Tiers are calculated automatically from order count. Admin can manually override a customer's tier from the Customer Profile page.

### Subscription Plans
| Plan | Monthly Price | Pieces / Month | Pickups |
|---|---|---|---|
| Basic | ₦15,000 | 30 pieces | 2 pickups |
| Standard | ₦25,000 | 60 pieces | 4 pickups (weekly) |
| Premium Family | ₦45,000 | 120 pieces | Unlimited |

Quarterly billing available at 10% discount. Premium items (Wedding Dress, Carpet) are excluded from subscription plans and must be ordered separately.

---

## Brand Design System

### Colour Tokens
| Name | Hex | Usage |
|---|---|---|
| Electric Cobalt | `#2962FF` | Primary actions, active states, brand identity |
| Sunset Pop | `#FC9D41` | Highlights, cart badge, current order stage |
| Boutique Gold | `#C5A572` | Premium service accents, decorative borders |
| Obsidian | `#0B1118` | Dark mode base background |
| Pure White | `#FFFFFF` | Light mode base, card backgrounds |

### Contrast Rules
- Sunset Pop (`#FC9D41`) **must never** be used as text on white — contrast ratio fails WCAG AA
- Boutique Gold (`#C5A572`) **must never** be used as body text on light backgrounds
- All primary text uses Obsidian on light and white on dark for maximum contrast

### Typography
- Font: Geist (loaded via `next/font`)
- All font weights: 400 (normal), 600 (semibold), 700 (bold), 800 (extrabold), 900 (black)

---

## Development Setup

### Prerequisites
- Node.js 20+
- npm or yarn
- A Supabase project (free tier)
- Git

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd smart-clean

# Install dependencies
npm install

# Set up environment variables (see below)
cp .env.example .env

# Push the Prisma schema to your database
npx prisma db push

# Generate the Prisma client
npx prisma generate

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the customer dashboard.

### Development URLs
| URL | World |
|---|---|
| `localhost:3000/dashboard` | Customer portal |
| `localhost:3000/admin` | Admin control centre |
| `localhost:3000/rider` | Rider portal |
| `localhost:3000/login` | Customer login |
| `localhost:3000/admin/login` | Admin login |
| `localhost:3000/rider/login` | Rider login |

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# ── Database ─────────────────────────────────────────────────────
DATABASE_URL="postgresql://..."           # Supabase PostgreSQL connection string

# ── NextAuth ─────────────────────────────────────────────────────
NEXTAUTH_SECRET="your-secret-here"        # Random 32+ char string
NEXTAUTH_URL="http://localhost:3000"      # Your app URL

# ── Google OAuth (for "Continue with Google") ────────────────────
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# ── Supabase Storage ─────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="..."

# ── Paystack ─────────────────────────────────────────────────────
PAYSTACK_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_live_..."

# ── Resend (Email) ────────────────────────────────────────────────
RESEND_API_KEY="re_..."

# ── Render API (Backend) ─────────────────────────────────────────
NEXT_PUBLIC_API_URL="https://smart-clean-api.onrender.com"
API_SECRET_KEY="..."                      # Shared secret for frontend→backend auth
```

---

## Deployment

### Frontend — Vercel

1. Push the repository to GitHub
2. Connect the repository to Vercel
3. Add all environment variables in the Vercel dashboard
4. Deploy — Vercel automatically handles Next.js builds

### Backend API — Render

The Fastify API server (to be built) will be a separate repository deployed to Render as a **Web Service**:

1. Create a new Web Service on Render
2. Connect the API repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add all backend environment variables
6. Render provides a persistent URL (`https://smart-clean-api.onrender.com`)

### Database — Supabase

1. Create a new project on [supabase.com](https://supabase.com)
2. Copy the connection string from Settings → Database
3. Set it as `DATABASE_URL` in your environment
4. Run `npx prisma db push` to create all tables

---

## Current Milestone Status

### ✅ Completed — Frontend

**Customer World**
- [x] Public landing page and splash screen
- [x] Login and signup screens (auth layout, form components)
- [x] Customer dashboard — home (first-time + returning user views)
- [x] 4-step order wizard (service → items → pickup → review)
  - [x] Bag size mode for weight-based services
  - [x] Per-item mode for specialist services
  - [x] Multi-service order support
  - [x] Inline stain report
  - [x] Mobile cart drawer (FAB)
  - [x] Draft order persistence (sessionStorage)
- [x] Order tracking page with live 6-stage timeline
- [x] Order history (Active / Past tabs)
- [x] Order confirmation screen
- [x] Full service catalogue with Standard / Premium filter
- [x] Subscription plans page (monthly / quarterly billing toggle)
- [x] Accountability & loyalty tiers page
- [x] Account & Edit Profile pages
- [x] Support page (contact form, FAQ accordion)

**Admin World**
- [x] Admin login screen
- [x] Overview / Command Centre (KPI cards, pipeline Kanban, activity feed, revenue chart)
- [x] Order routing page (table, filters, bulk actions, side panel with status update / rider assignment / cancel / refund)
- [x] Customer management (list, profile with order history, loyalty, account controls)
- [x] Rider fleet management (list, invite modal, profile with performance charts, suspend / force-offline)
- [x] Service catalogue management (edit with live preview, availability toggle, new service creation)
- [x] Subscription management (plan editing, subscriber table with actions)
- [x] Support & FAQ management (ticket table, FAQ editor)
- [x] System settings (platform rules, notifications, security, audit log, zones)

**Rider World**
- [x] Rider login screen
- [x] Map dashboard with active task bottom sheet
- [x] Task list (pending / completed deliveries)
- [x] Rider profile with vehicle info

**Shared Infrastructure**
- [x] Three Worlds role isolation and routing
- [x] Prisma schema with User and Order models
- [x] Shared data layer (`mock-shared.tsx` — OrderStatus, plans, loyalty tiers)
- [x] `src/lib/api.ts` stubs (typed functions returning mock data, ready for backend swap)
- [x] Page transition animations (smart — no flash on dashboard navigation)
- [x] Dark / Light mode
- [x] Responsive design (320px → 1440px)

### 🔲 Next — Backend (Fastify + Render)

- [ ] Fastify API server setup and deployment to Render
- [ ] NextAuth.js v5 integration (credentials + Google OAuth)
- [ ] Middleware re-enabled with real JWT session checks
- [ ] Prisma schema additions (Rider, Service, Subscription, SupportTicket, AuditLog models)
- [ ] `totalAmount Float → Decimal` schema migration
- [ ] All API routes (auth, orders, customers, riders, services, subscriptions, admin)
- [ ] Paystack integration (checkout + webhook receiver)
- [ ] Resend integration (order confirmation, status change, rider assignment emails)
- [ ] Supabase Storage integration (service image uploads from admin)
- [ ] Order status polling → Supabase Realtime upgrade
- [ ] Background jobs (SLA alerts, subscription renewal reminders, stale order flags)
- [ ] Rider location tracking (GPS pings via WebSocket)

---

*Built with ❤️ for the Nigerian market. Smart-Clean — because your time is worth more than laundry day.*
