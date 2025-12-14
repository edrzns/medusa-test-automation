# Test Plan: Medusa E-commerce Platform

## 1. Objectives

Demonstrate comprehensive testing skills through API and E2E automation against Medusa.js platform:
- API testing patterns (authentication, CRUD, state management, error handling)
- E2E testing patterns (user journeys, cross-browser validation)
- Test architecture (helpers, fixtures, data management)
- CI/CD integration readiness

## 2. Scope

### In Scope
- **API Testing**: Core e-commerce operations via REST API
- **E2E Testing**: Critical user journeys via browser automation
- **Test Infrastructure**: Reusable patterns and utilities

### Out of Scope
- Payment gateway integration (requires external services)
- Email/notification testing (infrastructure complexity)
- Performance/load testing (different tooling required)
- Admin UI testing (focus on customer-facing flows)
- Webhook testing (requires additional infrastructure)

## 3. Test Strategy by Layer

### Why Two Layers?

| Aspect | API Tests | E2E Tests |
|--------|-----------|-----------|
| **Speed** | Fast (ms) | Slow (seconds) |
| **Reliability** | High | Lower (browser dependencies) |
| **Coverage** | Business logic | User experience |
| **Maintenance** | Low | Higher |

**Decision**: Use API for state verification, E2E for critical user paths

## 4. Test Areas & Prioritization

### Priority 1: Foundation
**Authentication** - Blocks all other testing
- API: Token generation, invalid credentials, token expiry
- Demonstrates: Error handling, security testing basics

### Priority 2: Core Operations
**Product Catalog** - Foundation for purchases
- API: CRUD operations, search, filtering, variants
- E2E: Product browsing, detail views
- Demonstrates: REST patterns, pagination, complex queries

**Inventory Management** - Critical for order fulfillment
- API: Stock levels, availability checks
- Demonstrates: State management, race conditions

### Priority 3: Stateful Operations
**Shopping Cart** - Complex state management
- API: Add/remove items, quantity updates, cart persistence
- E2E: Multi-step cart interactions
- Demonstrates: Session handling, state transitions, idempotency

**Customer Management** - User lifecycle
- API: Registration, profile updates, addresses
- Demonstrates: Data validation, update operations

### Priority 4: Critical Flows
**Order Processing** - Most complex workflow
- API: Order creation, status transitions, cancellation
- E2E: Complete checkout flow
- Demonstrates: Multi-step workflows, error recovery, state machines

**Order History** - Read operations
- API: Filtering, sorting, pagination
- E2E: Order tracking
- Demonstrates: Query optimization, data presentation

## 5. API Test Coverage

### Patterns

```
Authentication
├── POST /auth/user/emailpass
│   ├── ✓ Valid credentials
│   ├── ✓ Invalid password
│   ├── ✓ Non-existent user
│   └── ✓ Token usage in subsequent requests

Products
├── GET /store/products
│   ├── ✓ List all products
│   ├── ✓ Pagination
│   ├── ✓ Filtering by category
│   └── ✓ Search functionality
├── GET /store/products/:id
│   ├── ✓ Valid product
│   ├── ✓ Invalid ID (404)
│   └── ✓ Product variants
└── Admin Operations (requires auth)
    ├── POST /admin/products
    ├── PUT /admin/products/:id
    └── DELETE /admin/products/:id

Cart
├── POST /store/carts
├── POST /store/carts/:id/line-items
│   ├── ✓ Add valid product
│   ├── ✓ Add out-of-stock product
│   ├── ✓ Add invalid product ID
│   └── ✓ Update quantity
├── DELETE /store/carts/:id/line-items/:line_id
└── POST /store/carts/:id/complete
    ├── ✓ Valid cart
    ├── ✓ Empty cart
    └── ✓ Invalid shipping address

Orders
├── POST /store/orders (via cart completion)
├── GET /store/orders/:id
└── Admin Operations
    ├── GET /admin/orders (list with filters)
    └── POST /admin/orders/:id/cancel
```

### Test Organization

```
tests/api/
├── auth/
│   └── login.test.ts
├── products/
│   ├── list-products.test.ts
│   ├── product-details.test.ts
│   └── admin-product-crud.test.ts
├── cart/
│   ├── cart-operations.test.ts
│   └── cart-validation.test.ts
├── orders/
│   ├── order-creation.test.ts
│   └── order-management.test.ts
└── helpers/
    ├── auth.ts
    ├── products.ts
    ├── cart.ts
    └── test-data.ts
```

## 6. E2E Test Coverage

### Critical User Journeys

**Journey 1: Guest Purchase**
```
Guest → Browse Products → View Details → Add to Cart → Checkout → Order Confirmation
```
Validates: Product discovery, cart operations, guest checkout

**Journey 2: Registered User Purchase**
```
Login → Browse → Add Multiple Items → Update Cart → Apply Discount → Checkout → View Order
```
Validates: Authentication persistence, complex cart, order history

**Journey 3: Cart Persistence**
```
Add Items → Close Browser → Return → Cart Retained → Complete Purchase
```
Validates: Session management, cart storage

**Journey 4: Error Handling**
```
Attempt Checkout → Invalid Address → Correction → Retry → Success
```
Validates: Form validation, error recovery

### Test Organization

```
tests/e2e/
├── checkout/
│   ├── guest-checkout.spec.ts
│   └── registered-checkout.spec.ts
├── cart/
│   └── cart-persistence.spec.ts
├── products/
│   └── product-browsing.spec.ts
└── page-objects/
    ├── ProductPage.ts
    ├── CartPage.ts
    └── CheckoutPage.ts
```

## 7. Data Management Strategy

### Test Data Approach

**Seed Data** (via Medusa seed script)
- Base products, categories
- Admin user account
- Advantage: Consistent starting state
- Used for: Read operations, browsing tests

**Dynamic Data** (created during tests)
- Test-specific products
- Customer accounts
- Orders
- Advantage: Test isolation
- Used for: CRUD operations, state tests

### Cleanup Strategy

**API Tests**: 
- Create test data with unique identifiers
- Clean up in `afterEach` hooks
- Accept eventual consistency

**E2E Tests**:
- Use seed data (read-only)
- Reset cart state between tests
- Full database reset for order tests (if needed)

### Example Pattern

```typescript
// tests/api/helpers/test-data.ts
export function generateTestProduct() {
  return {
    title: `Test Product ${Date.now()}`,
    handle: `test-product-${Date.now()}`,
    // ... unique identifiable data
  }
}
```

## 8. Test Execution Strategy

### Local Development
```bash
npm run test:api      # Fast feedback (seconds)
npm run test:e2e      # Full validation (minutes)
npm run test          # Complete suite
```

### CI/CD Pipeline
```
Pre-commit: Linting, type checking
PR: Full API suite (fast)
Merge to main: API + E2E (complete validation)
Scheduled: Full suite + multiple browsers
```

### Parallel Execution

- API tests: Fully parallel (isolated by data)
- E2E tests: Sequential (shared state considerations)
- Future: Implement test sharding for E2E

## 9. Success Criteria

### Quantitative
- [ ] 20+ API test scenarios covering critical paths
- [ ] 4+ E2E user journeys
- [ ] 80%+ test stability (pass rate on re-run)
- [ ] API tests complete in <30 seconds
- [ ] E2E tests complete in <5 minutes

### Qualitative
- [ ] Clear patterns for authentication handling
- [ ] Reusable helpers for common operations
- [ ] Readable test descriptions (BDD-style)
- [ ] Proper error assertions
- [ ] Documented test data strategy

## 10. Implementation Phases

### Phase 1: API Foundation
- [x] Authentication tests
- [x] Auth helper utility
- [x] Test data helpers
- [x] Product CRUD tests

### Phase 2: API Expansion
- [x] Cart operations (1 scenario)
- [x] Cart helper (admin draft-orders)
- [ ] Cart item manipulation (blocked by API limitations)
- [ ] Order creation
- [ ] Error scenario coverage

**Implementation Notes:**
- **Cart Testing Limitation:** Medusa v2 draft-order API tested doesn't support line-item manipulation after creation (`/admin/draft-orders/:id/line-items` returns 404)
- **Workaround Evaluated:** Attempted store API with publishable keys, but authentication complexity and time constraints led to pragmatic decision to focus on working admin endpoints
- **Coverage Achieved:** Cart/draft-order creation validated; demonstrates API interaction patterns even without full CRUD
- **Future Enhancement:** Investigate Medusa store API with proper publishable key configuration, or test against newer Medusa version with enhanced draft-order support

### Phase 3: E2E Setup
- [ ] Page object structure
- [ ] Guest checkout flow
- [ ] Cart persistence

### Phase 4: Polish
- [ ] Cross-browser E2E
- [x] CI/CD integration
- [x] Documentation

**CI/CD Implementation:**
- GitHub Actions workflow configured
- Docker Compose used for service orchestration
- Automated testing on every push
- Test reports uploaded as artifacts
- Badge showing build status in README

## 11. Risk Areas

### Technical Risks
- **Container startup timing**: Healthcheck may not catch all dependencies
- **Test data conflicts**: Parallel execution may create race conditions
- **Cart session management**: Cookie/token handling in E2E tests

### Mitigation
- Add explicit readiness checks beyond healthcheck
- Use unique identifiers in all test data
- Implement proper session isolation helpers

## 12. References

- Medusa API Documentation: https://docs.medusajs.com/api/store
- Playwright Best Practices: https://playwright.dev/docs/best-practices
- Test Pyramid Concept: https://martinfowler.com/articles/practical-test-pyramid.html

## 13. Current Status

**Test Coverage Summary:**
```
API Tests: 13 scenarios
├── Authentication: 4 tests
├── Products (Admin): 8 tests
│   ├── CRUD Operations: 3 tests
│   └── Read Operations: 5 tests
└── Cart (Draft Orders): 1 test

E2E Tests: 0 scenarios

Total Passing: 13/13 (100%)
Execution Time: ~4 seconds
```

**Key Achievements:**
- Helper pattern established (auth, products, cart)
- Test data generation with unique identifiers
- Proper error handling and assertions
- Clean test organization following plan structure

**Known Limitations:**
- Cart item manipulation blocked by Medusa API version
- E2E tests deferred due to timeline prioritization (will return later)
- Store API not tested (publishable key complexity)

**Lessons Learned:**
- API version compatibility matters—test early
- Pragmatic pivots beat perfect solutions under time pressure
- Document limitations transparently
- Working tests > comprehensive broken tests