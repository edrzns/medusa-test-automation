import { test, expect } from "@playwright/test";
import { createTestProduct } from "../helpers/products";

test.describe("Admin Product CRUD", () => {
  
  test("should create product with valid data", async ({ request }) => {
    const product = await createTestProduct(request)
    
    // Verify the product was created successfully
    expect(product.id).toBeTruthy()
    expect(typeof product.id).toBe("string")
  })

  test("should generate valid handle format", async ({ request }) => {
    const product = await createTestProduct(request)
    
    // Verify auto-generated handle
    expect(product.handle).toBeTruthy()
    expect(typeof product.handle).toBe("string")
    expect(product.handle).toMatch(/^[a-z0-9\-]+$/)
  })

  test("should persist product data correctly", async ({ request }) => {
    const customTitle = `Custom Product ${Date.now()}`
    const product = await createTestProduct(request, { title: customTitle })
    
    // Verify that the created product contains input data
    expect(product.title).toBe(customTitle)
    expect(product.options).toBeDefined()
    expect(product.options.length).toBeGreaterThan(0)
  })
})