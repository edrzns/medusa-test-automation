import { test, expect } from '@playwright/test'
import { makeAdminRequest } from '../helpers/auth'
import { createTestProduct } from '../helpers/products'

test.describe('Admin Product Read Operations', () => {
  
  test('should list all products', async ({ request }) => {
    const response = await makeAdminRequest(request, 'GET', '/admin/products')
    
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data.products).toBeDefined()
    expect(Array.isArray(data.products)).toBeTruthy()
  })

  test('should get single product by ID', async ({ request }) => {
    // Create a test product first
    const createdProduct = await createTestProduct(request)
    
    // Retrieve it
    const response = await makeAdminRequest(
      request, 
      'GET', 
      `/admin/products/${createdProduct.id}`
    )
    
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data.product).toBeDefined()
    expect(data.product.id).toBe(createdProduct.id)
    expect(data.product.title).toBe(createdProduct.title)
  })

  test('should return 404 for non-existent product', async ({ request }) => {
    const response = await makeAdminRequest(
      request, 
      'GET', 
      '/admin/products/prod_nonexistent12345'
    )
    
    expect(response.status()).toBe(404)
  })

  test('should paginate products', async ({ request }) => {
    // Create a few test products
    await createTestProduct(request)
    await createTestProduct(request)
    
    const response = await makeAdminRequest(
      request, 
      'GET', 
      '/admin/products?limit=5&offset=0'
    )
    
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(data.products).toBeDefined()
    expect(data.products.length).toBeLessThanOrEqual(5)
    expect(data.count).toBeDefined()
  })

  test('should include product metadata', async ({ request }) => {
    const createdProduct = await createTestProduct(request)
    
    const response = await makeAdminRequest(
      request, 
      'GET', 
      `/admin/products/${createdProduct.id}`
    )
    
    const data = await response.json()
    const product = data.product
    
    // Verify product has expected structure
    expect(product.id).toBeTruthy()
    expect(product.title).toBeTruthy()
    expect(product.handle).toBeTruthy()
    expect(product.options).toBeDefined()
    expect(product.variants).toBeDefined()
  })
})