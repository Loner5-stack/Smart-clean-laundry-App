# Architecture Selection: customer-service-navigation

## Recommended Architecture: Use-Case Oriented Slices

### Rationale
The Use-Case Oriented architecture achieves the lowest information flow density (0.30) and the lowest cross-cutting invariant rate (25%) of the three candidates, meaning most business rules are self-contained within a single component and do not require cross-component coordination to enforce. It maps directly to the four customer navigation tabs — each slice is one tab's world — which keeps the mental model simple for development and makes the codebase easy to navigate alongside the UI itself. The main trade-off is that cart state (`cartItems`, `cartTotal`, `cartBadgeCount`) must be accessible to both the CatalogueSlice (to trigger customisation) and the CheckoutSlice (to read items), requiring a shared cart context or a lightweight store; this is a deliberate, bounded coupling point rather than a structural weakness.

---

### Components

| Component | Owned State | Responsibility |
|-----------|-------------|----------------|
| AppShell | `activeTab`, `viewportWidth` | Bottom nav bar (4 tabs), route layout wrapper, tab active state, responsive breakpoint detection |
| CatalogueSlice | `serviceList`, `categoryFilter`, `searchQuery`, `serviceUnavailableFlag`, `isLoading`, `isError` | Fetch and display all services grouped by category; real-time search/filter; trigger customisation sheet; skeleton + empty + error states |
| CartSlice | `cartItems`, `cartTotal`, `cartBadgeCount`, `selectedService`, `starchLevel`, `scentPreference`, `specialInstructions`, `itemQuantity` | Manage all cart state; customisation sheet logic; enforce cart invariants (totals, unavailable guard, badge count); sessionStorage persistence |
| CheckoutSlice | `checkoutStep`, `pickupAddress`, `pickupDateTime`, `availableSlots`, `orderSubmitting`, `activeOrderId` | 3-step checkout wizard; pickup slot fetching; inline validation; order creation (Prisma `Order`); cart clear signal on success |
| TrackingSlice | `orderStatus`, `orderHistory`, `pollingInterval` | Order status polling (≤30s); all-orders history list; status → human-readable label mapping; status progress indicator |
| UIStateModule *(passive utility)* | *(none — stateless)* | Shared Skeleton, EmptyState, ErrorState, and LoadingButton components consumed by all slices; not a coordinator |

---

### Information Flow

| From \ To | AppShell | CatalogueSlice | CartSlice | CheckoutSlice | TrackingSlice |
|-----------|----------|----------------|-----------|---------------|---------------|
| **AppShell** | — | → mount/route | → mount/route | → mount/route | → mount/route |
| **CatalogueSlice** | — | — | → add-item event | — | — |
| **CartSlice** | → badge count | — | — | → items read-handoff | — |
| **CheckoutSlice** | → navigate-to-tracking | — | ← clear-cart signal | — | — |
| **TrackingSlice** | — | — | — | — | — |

All communication is unidirectional. There are no synchronous cycles. CartSlice is the only shared state node — it is accessed by CatalogueSlice (write) and CheckoutSlice (read), which is the single bounded coupling point in this architecture.

---

### Requirement Allocation

| Requirement | Component(s) |
|-------------|--------------|
| REQ-1: Service Catalogue Browsing | CatalogueSlice |
| REQ-2: Service Selection & Customisation | CartSlice (sheet + state), CatalogueSlice (sheet trigger) |
| REQ-3: Simple Checkout Flow | CheckoutSlice (wizard), CartSlice (item read + clear) |
| REQ-4: Bottom Navigation Bar | AppShell (tabs), CartSlice (badge count output) |
| REQ-5: Order Status Tracking | TrackingSlice |
| REQ-6: Empty & Loading States | UIStateModule (consumed by all slices) |
| REQ-7: Accessibility & Responsiveness | All components (ambient — each owns its own a11y) |

---

### Key Design-Induced Invariants

These invariants arise from the slice partitioning decisions, not from requirements directly:

1. **Cart as shared context:** Because CartSlice is accessed by both CatalogueSlice and CheckoutSlice, `cartItems` must be stored in a React Context (or Zustand store) that both can subscribe to. No direct prop-drilling between slices is permitted — all cart access goes through the CartSlice context API.

2. **AppShell owns no business state:** AppShell must never own or cache service data, cart data, or order data. Its only state is navigation state (`activeTab`) and layout state (`viewportWidth`). This keeps the shell replaceable without affecting any business logic.

3. **Slice isolation on route change:** When AppShell unmounts a slice (tab change), that slice's local UI state (search query, open sheet, checkout step) resets. Only CartSlice state persists across tab changes (via sessionStorage sync).

4. **UIStateModule is purely presentational:** UIStateModule components must receive all state via props. They must never fetch data, subscribe to context, or hold state themselves. Violation would create invisible coupling between slices.

5. **CheckoutSlice does not own cart items:** CheckoutSlice reads `cartItems` from CartSlice context but never writes to it — except via a single `clearCart()` call after order placement. This prevents the checkout from becoming a secondary cart manager.

---

### Alternatives Considered

| Candidate | Strength | Weakness | Why Not Selected |
|-----------|----------|----------|-----------------|
| Layer Oriented (Data / Domain / Presentation) | All business rules centralised in DomainLayer; highly testable in isolation | PresentationLayer owns 52% of all state (god object); flow density 0.67; every new feature touches 2+ layers | God object threshold exceeded; high evolvability cost (2.3 components/REQ) |
| Event-Driven with Persistence Boundary | Best evolvability (1.2 components/REQ); PersistenceBoundary is a clean explicit boundary; new features subscribe without touching existing code | EventBus fan-in/out of 6 creates a coordination hub; event chains are hard to debug without tooling; overkill complexity for this feature's current scale | Complexity disproportionate to feature scope; CartSlice can handle sessionStorage directly without a dedicated PersistenceBoundary component |

---

### Metrics Summary

| Metric | Use-Case Slices *(selected)* | Layer Oriented | Event-Driven |
|--------|------------------------------|----------------|--------------|
| Cross-cutting reqs % | 57% (43% ex-REQ-7) | 86% | 71% |
| Cross-cutting invariants % | 25% | 42% | 17% |
| Flow density | **0.30** | 0.67 | hub-spoke |
| God object score | **33%** | 52% ⚠️ | 33% |
| Sync cycles | **0** | 0 | 0 |
| Max fan-in | 3 (CartSlice) | 2 | 6 (EventBus) ⚠️ |
| Max fan-out | 4 (AppShell) | 2 | 6 (EventBus) ⚠️ |
| Evolvability cost | 1.4 components/REQ | 2.3 ⚠️ | 1.2 |
