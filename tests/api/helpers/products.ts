import type { APIRequestContext } from '@playwright/test'
import { makeAdminRequest } from './auth'
import { generateTestProduct } from './test-data'

/**
 * Create a test product via admin API
 * Returns the created product data including ID and variants
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
    const errorBody = await response.text()
    throw new Error(`Failed to create product: ${response.status()} - ${errorBody}`)
  }
  
  const data = await response.json()
  return data.product
}

/**
 * Get product by ID via admin API
 */
export async function getAdminProduct(
  request: APIRequestContext,
  productId: string
) {
  const response = await makeAdminRequest(
    request,
    'GET',
    `/admin/products/${productId}`
  )
  
  if (!response.ok()) {
    throw new Error(`Failed to get product: ${response.status()}`)
  }
  
  const data = await response.json()
  return data.product
}

/**
 * List all admin products
 */
export async function listAdminProducts(
  request: APIRequestContext,
  params?: { limit?: number; offset?: number }
) {
  let url = '/admin/products'
  
  if (params) {
    const searchParams = new URLSearchParams()
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.offset) searchParams.set('offset', params.offset.toString())
    
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`
    }
  }
  
  const response = await makeAdminRequest(request, 'GET', url)
  
  if (!response.ok()) {
    throw new Error(`Failed to list products: ${response.status()}`)
  }
  
  const data = await response.json()
  return data.products
}