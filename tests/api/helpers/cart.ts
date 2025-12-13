import type { APIRequestContext } from '@playwright/test'
import { makeAdminRequest } from './auth'

/**
 * Create a new draft order (admin cart)
 */
export async function createCart(request: APIRequestContext) {
  // Get a valid region first
  const regionsResponse = await makeAdminRequest(request, 'GET', '/admin/regions')
  const regionsData = await regionsResponse.json()
  
  if (!regionsData.regions || regionsData.regions.length === 0) {
    throw new Error('No regions available. Run seed data.')
  }
  
  const regionId = regionsData.regions[0].id
  
  // Create draft order with minimal required fields
  const response = await makeAdminRequest(request, 'POST', '/admin/draft-orders', {
    region_id: regionId,
    email: `test-${Date.now()}@example.com`,
    items: []
  })
  
  if (!response.ok()) {
    const body = await response.text()
    throw new Error(`Failed to create cart: ${response.status()} - ${body}`)
  }
  
  const data = await response.json()
  return data.draft_order
}

/**
 * Add item to draft order
 */
export async function addItemToCart(
  request: APIRequestContext,
  cartId: string,
  variantId: string,
  quantity: number = 1
) {
  const response = await makeAdminRequest(
    request,
    'POST',
    `/admin/draft-orders/${cartId}/line-items`,
    {
      variant_id: variantId,
      quantity
    }
  )
  
  if (!response.ok()) {
    const body = await response.text()
    throw new Error(`Failed to add item: ${response.status()} - ${body}`)
  }
  
  const data = await response.json()
  return data.draft_order
}

/**
 * Update line item quantity
 */
export async function updateLineItemQuantity(
  request: APIRequestContext,
  cartId: string,
  lineItemId: string,
  quantity: number
) {
  const response = await makeAdminRequest(
    request,
    'POST',
    `/admin/draft-orders/${cartId}/line-items/${lineItemId}`,
    { quantity }
  )
  
  if (!response.ok()) {
    const body = await response.text()
    throw new Error(`Failed to update quantity: ${response.status()} - ${body}`)
  }
  
  const data = await response.json()
  return data.draft_order
}

/**
 * Remove item from draft order
 */
export async function removeItemFromCart(
  request: APIRequestContext,
  cartId: string,
  lineItemId: string
) {
  const response = await makeAdminRequest(
    request,
    'DELETE',
    `/admin/draft-orders/${cartId}/line-items/${lineItemId}`
  )
  
  if (!response.ok()) {
    const body = await response.text()
    throw new Error(`Failed to remove item: ${response.status()} - ${body}`)
  }
  
  const data = await response.json()
  return data.draft_order
}

/**
 * Get draft order by ID
 */
export async function getCart(
  request: APIRequestContext,
  cartId: string
) {
  const response = await makeAdminRequest(
    request,
    'GET',
    `/admin/draft-orders/${cartId}`
  )
  
  if (!response.ok()) {
    const body = await response.text()
    throw new Error(`Failed to get cart: ${response.status()} - ${body}`)
  }
  
  const data = await response.json()
  return data.draft_order
}

/**
 * Helper: Create draft order with item
 */
export async function createCartWithItem(
  request: APIRequestContext,
  variantId: string,
  quantity: number = 1
) {
  const cart = await createCart(request)
  const updatedCart = await addItemToCart(request, cart.id, variantId, quantity)
  
  return {
    cartId: updatedCart.id,
    cart: updatedCart,
    lineItemId: updatedCart.items[0]?.id
  }
}