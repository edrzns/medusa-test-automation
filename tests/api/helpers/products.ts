import type { APIRequestContext } from '@playwright/test'
import { makeAdminRequest } from './auth'
import { generateTestProduct } from './test-data'

/**
 * Create a test product via admin API
 * Returns the created product data including ID
 */
export async function createTestProduct(
  request: APIRequestContext,
  overrides?: any
) {
  const productData = generateTestProduct(overrides)
  
  const response = await makeAdminRequest(
    request,
    'POST',
    '/admin/products',
    productData
  )
  
  if (!response.ok()) {
    throw new Error(`Failed to create product: ${response.status()}`)
  }
  
  const data = await response.json()
  return data.product
}

/**
 * Get product by ID via store API (no auth needed)
 */
export async function getStoreProduct(
  request: APIRequestContext,
  productId: string
) {
  const response = await request.get(`http://localhost:9000/store/products/${productId}`)
  
  if (!response.ok()) {
    throw new Error(`Failed to get product: ${response.status()}`)
  }
  
  const data = await response.json()
  return data.product
}

/**
 * List all store products (no auth needed)
 */
export async function listStoreProducts(
  request: APIRequestContext,
  params?: { limit?: number; offset?: number; q?: string }
) {
  let url = 'http://localhost:9000/store/products'
  
  if (params) {
    const searchParams = new URLSearchParams()
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.offset) searchParams.set('offset', params.offset.toString())
    if (params.q) searchParams.set('q', params.q)
    
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`
    }
  }
  
  const response = await request.get(url)
  
  if (!response.ok()) {
    throw new Error(`Failed to list products: ${response.status()}`)
  }
  
  const data = await response.json()
  return data.products
}