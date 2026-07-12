# Requirements Document

## Introduction

This feature defines the end-to-end experience for customers browsing, selecting, and ordering laundry services within the Smart-Clean mobile-first web app. The goal is to make service discovery and navigation as frictionless as possible — a customer should be able to go from landing on the app to confirming an order in under two minutes. All interactions are scoped to the customer route group under `src/app/(customer)/customer/`.

## Requirements

---

### REQ-1: Service Catalogue Browsing

**User Story:** As a customer, I want to browse all available cleaning services in a visually clear catalogue so that I can quickly find the service I need without confusion.

#### Acceptance Criteria

- REQ-1.1: The catalogue page renders all available services grouped into named categories (e.g., "Everyday Laundry", "Specialist Care", "Household & Bedding", "Footwear & Accessories"). Each category is visually separated with a labelled section header.
- REQ-1.2: Each service card displays: the service name, price in USD (e.g., "$4.99 / lb" or "$12.00 / item"), estimated turnaround time (e.g., "24 hrs", "48 hrs"), a short description (max 80 characters), and a service image sourced from `public/images/services/`.
- REQ-1.3: The catalogue is horizontally or vertically scrollable per category without requiring full-page navigation, allowing fast scanning.
- REQ-1.4: Services that are temporarily unavailable are shown in a visually distinct disabled state (greyed out, "Unavailable" label) and cannot be added to the cart.
- REQ-1.5: The catalogue loads within 2 seconds on a standard mobile connection; a skeleton loading state (animated placeholder cards) is displayed while data is being fetched.
- REQ-1.6: A search/filter input at the top of the catalogue allows customers to filter services by name or category in real time, with no full-page reload required.

---

### REQ-2: Service Selection & Customization

**User Story:** As a customer, I want to select one or more services, specify quantities and preferences, and see my choices reflected immediately so that I feel confident about what I am ordering.

#### Acceptance Criteria

- REQ-2.1: Tapping a service card opens a customization sheet/modal that allows the customer to set quantity (integer spinner, min 1, max 99) and any item-level preferences before adding to the cart.
- REQ-2.2: The customization options include starch level (None / Light / Heavy), scent preference (Unscented / Lavender / Fresh Linen), and a free-text special instructions field (max 250 characters). All fields are optional and default to "None" / "Unscented" / empty respectively.
- REQ-2.3: After confirming customization, the selected service and its options are appended to the persistent cart. The cart icon in the navigation bar shows a badge with the current item count, updating without a page reload.
- REQ-2.4: The customer can select multiple different services in a single session; each service entry in the cart retains its own quantity and preference settings independently.
- REQ-2.5: The customer can edit or remove any item from the cart at any time before checkout. Removing an item updates the cart badge count and order summary immediately.
- REQ-2.6: The per-item price and a running total (USD) are displayed in the cart summary, recalculating instantly whenever quantity or item selection changes.

---

### REQ-3: Simple Checkout Flow

**User Story:** As a customer, I want to review my order and schedule a pickup in as few steps as possible so that placing an order feels effortless and not time-consuming.

#### Acceptance Criteria

- REQ-3.1: The checkout flow consists of exactly 3 steps: (1) Order Review, (2) Pickup Details, (3) Confirmation. A step indicator is visible at the top of the checkout screen showing progress.
- REQ-3.2: Step 1 — Order Review: displays all cart items with name, customization summary, quantity, line-item price, and the USD order total. The customer can return to the catalogue from this step to add more items.
- REQ-3.3: Step 2 — Pickup Details: the customer enters or confirms a pickup address (street address, city, zip/postal code) and selects a pickup date and available time slot from a date/time picker. Available slots are shown in the customer's local timezone.
- REQ-3.4: Step 3 — Confirmation: displays a read-only summary of the full order (items, total, address, pickup time) and a single prominent "Place Order" button. Tapping it creates an `Order` record in the database with status `PENDING` and stores the cart contents in the `items` JSON field.
- REQ-3.5: The customer cannot advance to the next step if required fields (address, pickup date/time) are empty; inline validation messages explain what is missing without blocking the entire form.
- REQ-3.6: After a successful order placement, the customer is navigated to the Order Status screen for the newly created order, and the cart is cleared.

---

### REQ-4: Bottom Navigation Bar

**User Story:** As a customer, I want a persistent, easy-to-reach bottom navigation bar so that I can switch between the main sections of the app with one tap at any time.

#### Acceptance Criteria

- REQ-4.1: The bottom navigation bar is rendered on every customer-facing page and contains exactly 4 tabs: Home, New Order, My Orders, and Profile — in that order from left to right.
- REQ-4.2: The active tab is visually distinct from inactive tabs using the brand's Electric Cobalt (`#2962FF`) color for the active icon and label, with inactive tabs rendered in a muted/neutral tone.
- REQ-4.3: No hamburger menu, side drawer, or nested navigation is used anywhere in the customer app; all primary destinations are reachable directly from the bottom bar.
- REQ-4.4: Each tab icon has an accessible `aria-label` and a visible text label below the icon. The touch target for each tab is at minimum 44×44px.
- REQ-4.5: The "New Order" tab navigates directly to the service catalogue. If the cart is non-empty, a numerical badge is shown on this tab indicating the number of items in the cart.
- REQ-4.6: The bottom navigation bar does not overlap page content; the page layout accounts for its height using a bottom padding/inset so that scrollable content is fully accessible above it.

---

### REQ-5: Order Status Tracking

**User Story:** As a customer, I want to see the current status of my active order with a clear visual progress indicator so that I always know where my laundry is without needing to contact support.

#### Acceptance Criteria

- REQ-5.1: The Order Status screen displays a horizontal or vertical step-progress indicator with all 6 stages mapped from the `OrderStatus` enum: Pending → Pickup Assigned → At Hub → In Production → Out for Delivery → Completed. Each stage shows a human-readable label (not the raw enum value).
- REQ-5.2: Completed stages are styled with a filled/checked visual treatment using Electric Cobalt; the current active stage is highlighted with Sunset Pop (`#FC9D41`); future stages are greyed out.
- REQ-5.3: The status screen polls for updates (or uses server-sent events/websocket where available) at a maximum interval of 30 seconds, refreshing the displayed status without a full page reload.
- REQ-5.4: The screen also shows order metadata: order ID (shortened, copyable), list of ordered services, pickup address, scheduled pickup time, and the USD total.
- REQ-5.5: The "My Orders" tab shows a list of all past and active orders, each with a status chip (colour-coded by stage), order date, and total amount. Tapping an order opens its status detail screen.
- REQ-5.6: If the customer has no orders, the My Orders screen displays an illustrated empty state with a call-to-action button that navigates to the service catalogue.

---

### REQ-6: Empty States & Loading States

**User Story:** As a customer, I want every screen to give me clear visual feedback when content is loading or unavailable so that I never feel lost or confused by a blank screen.

#### Acceptance Criteria

- REQ-6.1: Every list or catalogue view that is awaiting data renders an animated skeleton loading state composed of placeholder cards that mirror the shape and layout of the real content.
- REQ-6.2: Every screen that can return an empty result (My Orders list, search results, catalogue categories) renders a dedicated illustrated empty state using an inline SVG or image asset, a short explanatory message, and where appropriate a contextual call-to-action button.
- REQ-6.3: Skeleton states and empty state illustrations use brand-consistent colours (Obsidian backgrounds, Boutique Gold or Electric Cobalt accents) and do not flash or flicker on fast connections where data loads in under 300ms (defer skeleton display by 300ms).
- REQ-6.4: Network or server errors on any data-fetching screen display an error state with a brief user-friendly message (not a raw error code) and a "Try again" retry button.
- REQ-6.5: Loading states for interactive actions (adding to cart, placing order) are communicated via button-level loading spinners and disabled state on the triggering button, preventing duplicate submissions.
- REQ-6.6: All state transitions (loading → content, loading → empty, loading → error) are animated with a subtle fade or slide-in transition using Framer Motion to avoid jarring layout shifts.

---

### REQ-7: Accessibility & Responsiveness

**User Story:** As a customer using any device or assistive technology, I want the app to be fully usable and readable so that I can place orders regardless of my device, screen size, or accessibility needs.

#### Acceptance Criteria

- REQ-7.1: All interactive elements (buttons, form inputs, links, navigation tabs, service cards) meet WCAG 2.1 AA colour contrast requirements: a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text and UI components.
- REQ-7.2: Every interactive element has a minimum touch/click target size of 44×44px as measured by the rendered bounding box, not just the visible icon or label.
- REQ-7.3: The entire customer UI is fully functional and visually correct across viewport widths from 320px (small mobile) to 1440px (desktop), using responsive Tailwind CSS utility classes. On screens wider than 768px the layout shifts to a centred single-column or card-based layout with a max-width of 480px to preserve the mobile-first design intent.
- REQ-7.4: All images and icon assets include descriptive `alt` text or `aria-label` attributes. Decorative images use `alt=""`.
- REQ-7.5: The checkout form and all other forms are navigable and completable using a keyboard alone, with visible focus indicators on all focusable elements.
- REQ-7.6: The app does not rely solely on colour to convey meaning (e.g., order status stages also use icons or text labels in addition to colour coding); all status changes are also announced to screen readers via `aria-live` regions where content updates dynamically.


---

## Glossary

| Term | Definition |
|------|------------|
| **Catalogue** | The browsable list of all available cleaning services, grouped by category. |
| **Cart** | The temporary in-session collection of selected services and their customizations prior to checkout. |
| **OrderStatus** | The Prisma enum tracking an order's lifecycle: `PENDING`, `PICKUP_ASSIGNED`, `AT_HUB`, `IN_PRODUCTION`, `OUT_FOR_DELIVERY`, `COMPLETED`. |
| **Skeleton state** | Animated placeholder UI rendered while remote data is being fetched, mimicking the shape of the real content. |
| **Empty state** | Illustrated screen shown when a list or catalogue returns zero results. |
| **Starch level** | A garment-care preference indicating how much starch is applied during pressing: None, Light, or Heavy. |
| **Turnaround time** | The estimated duration from pickup to delivery for a given service. |
| **Touch target** | The total tappable/clickable area of an interactive element, required to be at minimum 44×44px. |
| **WCAG 2.1 AA** | The Web Content Accessibility Guidelines level AA standard used as the accessibility baseline for this feature. |
| **Bottom nav** | The fixed 4-tab navigation bar anchored to the bottom of the screen in the customer app. |
