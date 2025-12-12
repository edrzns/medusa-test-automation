import { test, expect } from "@playwright/test";
import { makeAdminRequest } from "../helpers/auth";
import { generateTestProduct } from "../helpers/test-data";

test.describe("Product API Tests", () => {
  test("should create product with valid data", async ({ request }) => {
    // Generate test product data
    const productData = generateTestProduct();

    // Create product via API
    const response = await makeAdminRequest(
      request,
      "POST",
      "/admin/products",
      productData
    );

    // Verify the response is successful
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // Parse response data
    const responseData = await response.json();

    // Verify the ID is present and valid
    expect(responseData.product.id).toBeTruthy();
    expect(typeof responseData.product.id).toBe("string");
  });

  test("should generate valid handle format", async ({ request }) => {
    // Generate test product data
    const productData = generateTestProduct();

    // Create product via API
    const response = await makeAdminRequest(
      request,
      "POST",
      "/admin/products",
      productData
    );

    // Parse response data
    const responseData = await response.json();

    // Verify auto-generated handle is present and valid
    expect(responseData.product.handle).toBeTruthy();
    expect(typeof responseData.product.handle).toBe("string");
    expect(responseData.product.handle).toMatch(/^[a-z0-9\-]+$/);
  });

  test("should persist product data correctly", async ({ request }) => {
    // Generate test product data
    const productData = generateTestProduct();

    // Create product via API
    const response = await makeAdminRequest(
      request,
      "POST",
      "/admin/products",
      productData
    );

    // Parse response data
    const responseData = await response.json();

    // Verify that the created product contains input data
    expect(responseData.product.title).toBe(productData.title);
    expect(responseData.product.options).toBeDefined();
    expect(responseData.product.options.length).toBeGreaterThan(0);
  });
});
