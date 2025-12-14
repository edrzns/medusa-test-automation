# Medusa Test Automation

Automated API testing framework for Medusa e-commerce platform, demonstrating SDET skills through systematic test design, helper patterns, and pragmatic problem-solving.

[![Tests](https://github.com/edrzns/medusa-test-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/edrzns/medusa-test-automation/actions)

## Project Overview

This project showcases API test automation skills by building a test suite against the Medusa e-commerce platform. Focus areas include:
- Clean helper/abstraction patterns for maintainability
- Systematic test coverage of core e-commerce operations
- Proper error handling and validation
- Strategic decision-making when facing API limitations

## Test Coverage (13 Scenarios)

| Area | Scenarios | Coverage Details |
|------|-----------|-----------------|
| **Authentication** | 4 tests | Valid login, invalid credentials, token usage, error handling |
| **Product CRUD** | 3 tests | Create with variants, handle generation, data persistence |
| **Product Read** | 5 tests | List all, get by ID, 404 handling, pagination, metadata validation |
| **Cart Creation** | 1 test | Draft order creation via admin API |

**Test Execution:**
- All tests passing (13/13)
- Average execution time: ~4 seconds
- Fully parallelized execution
- No flaky tests

## Architecture & Design Decisions

### Helper Pattern Structure
```
tests/api/helpers/
├── auth.ts          # Token management, authenticated requests
├── products.ts      # Product CRUD operations
├── cart.ts          # Draft order operations
└── test-data.ts     # Test data generation with unique IDs
```

**Why helpers?**
- **Reusability:** Create product once, use everywhere
- **Maintainability:** API changes fixed in one place
- **Readability:** Tests express intent, not implementation
- **Interview talking point:** Demonstrates understanding of abstraction layers

### Test Data Strategy
```typescript
// Unique identifiers prevent test collisions
generateTestProduct() // → "Test Product 1765656623048-e2d3e12b"

// No cleanup needed - isolated by unique data
// Each test creates fresh products with timestamp + random hash
```

### API Testing Approach

**Why API-first over E2E?**
- **Speed:** 13 tests in 4 seconds vs minutes for E2E
- **Stability:** No browser flakiness
- **Coverage:** Direct business logic validation
- **CI/CD Ready:** Fast feedback in pipelines

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- Git

### Setup & Run Tests
```bash
# Clone and setup
git clone https://github.com/edrzns/medusa-test-automation
cd medusa-test-automation

# Start Medusa backend (Postgres + Redis + Medusa)
npm run setup

# Wait ~60 seconds for services to initialize
npm run docker:logs  # Monitor startup

# Run all API tests
npm run test:api

# Run with UI for debugging
npm run test:ui

# Run specific test file
npx playwright test tests/api/auth/login.test.ts
```

### Verify Setup
```bash
# Check services are running
npm run docker:ps

# Should show:
# - medusa_backend (healthy)
# - medusa_postgres (running)
# - medusa_redis (running)
```

## Project Structure
```
medusa-test-automation/
├── docker/                      # Medusa backend setup
│   ├── docker-compose.yml       # Service orchestration
│   └── medusa/                  # Medusa configuration
├── tests/
│   └── api/
│       ├── auth/                # Authentication tests
│       ├── products/            # Product CRUD + read tests
│       ├── cart/                # Cart/draft-order tests
│       └── helpers/             # Reusable API operations
├── docs/
│   ├── TEST_PLAN.md            # Comprehensive test strategy
│   └── LEARNINGS.md            # Design decisions documented
├── playwright.config.ts         # Test configuration
└── README.md                    # This file
```

## Test Examples

### Clean Test Structure with Helpers
```typescript
// Before: Repetitive, hard to maintain
test('should create product', async ({ request }) => {
  const productData = { title: `Test ${Date.now()}`, ... }
  const response = await makeAdminRequest(request, 'POST', '/admin/products', productData)
  expect(response.ok()).toBeTruthy()
  const data = await response.json()
  expect(data.product.id).toBeTruthy()
})

// After: Clean, reusable, readable
test('should create product', async ({ request }) => {
  const product = await createTestProduct(request)
  expect(product.id).toBeTruthy()
})
```

### Variant Handling Pattern
```typescript
// Products include variants with prices
const product = await createTestProduct(request)
const variantId = product.variants[0].id  // Use in cart tests

// Test data helper ensures variants are created correctly
generateTestProduct({
  variants: [{
    title: 'Medium',
    prices: [{ amount: 1000, currency_code: 'usd' }],
    options: { Size: 'M' }
  }]
})
```

## Technical Challenges Solved

### Challenge 1: Medusa Product Variants
**Problem:** Products created without variants array populated  
**Solution:** Updated `generateTestProduct()` to explicitly include variant structure with options as object (`{Size: 'M'}`) not array  
**Learning:** API data structures aren't always documented clearly, test early, iterate on structure

### Challenge 2: Store API Publishable Keys
**Problem:** Store endpoints require `x-publishable-api-key` header, complex setup  
**Solution:** Pivoted to admin draft-order endpoints which use existing token auth  
**Learning:** Pragmatic pivots beat perfect solutions under time pressure. Documented the limitation and moved forward.

### Challenge 3: Draft Order API Limitations
**Problem:** `/admin/draft-orders/:id/line-items` returns 404 
**Solution:** Focused on creation testing, documented API gap for future enhancement  
**Learning:** Working tests > comprehensive broken tests.

## Implementation Notes

### Why Admin API Instead of Store API?

**Decision:** Use admin endpoints (`/admin/products`, `/admin/draft-orders`) over store endpoints (`/store/products`, `/store/carts`)

**Rationale:**
- Admin auth already working (token-based)
- Store API requires publishable key setup + association with sales channels
- Time constraints favored working tests over perfect API coverage
- Admin API validates same business logic as store API
- Can revisit store API in future iterations

**Trade-off:** Not testing customer-facing endpoints, but core e-commerce operations validated

### Cart Testing Limitation

Current Medusa version (based on medusa-starter-default) doesn't support draft-order line-item manipulation:
- ❌ `/admin/draft-orders/:id/line-items` → 404
- ❌ `/admin/draft-orders/:id/items` → 404  
- ✅ `/admin/draft-orders` (POST) → 200 (creation works)

**Future Enhancement:** Test against newer Medusa version or implement store cart API with proper publishable key handling.

## Skills Demonstrated

- ✅ **API Testing:** REST endpoint validation, request/response handling
- ✅ **Test Architecture:** Helper patterns, data generation, abstractions
- ✅ **TypeScript:** Strong typing, interfaces, async/await patterns
- ✅ **Problem Solving:** API limitations → pragmatic pivots
- ✅ **Documentation:** Clear README, test plan, inline comments
- ✅ **Git Workflow:** Meaningful commits, clean history
- ✅ **Docker:** Multi-service orchestration for test environment

## Future Enhancements

**Phase 2: Enhanced API Coverage**
- [ ] Implement store API with publishable keys
- [ ] Full cart item manipulation
- [ ] Order creation and management
- [ ] Customer registration and management

**Phase 3: E2E Testing**
- [ ] Page Object Model structure
- [ ] Critical user journeys (guest checkout, registered user flow)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Visual regression testing

**Phase 4: CI/CD & Reporting**
- [ ] GitHub Actions pipeline optimization
- [ ] Test result artifacts and reports
- [ ] Parallel test execution strategies
- [ ] Integration with test management tools

## References

- [Medusa Documentation](https://docs.medusajs.com/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Test Pyramid Concept](https://martinfowler.com/articles/practical-test-pyramid.html)

## About This Project

Built as a portfolio piece to demonstrate SDET skills in:
- Test automation framework development
- API testing patterns and best practices
- Strategic problem-solving under constraints
- Clean code and documentation practices

**Author:** Edijs Rozens  
**LinkedIn:** [linkedin.com/in/edijs-rozens](https://linkedin.com/in/edijs-rozens)  
**GitHub:** [github.com/edrzns](https://github.com/edrzns)