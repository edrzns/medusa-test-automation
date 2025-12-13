import { test, expect } from '@playwright/test'
import { createCart } from '../helpers/cart'

test.describe('Cart Creation', () => {
  test('should create empty draft order', async ({ request }) => {
    const cart = await createCart(request)
    
    expect(cart).toBeDefined()
    expect(cart.id).toBeTruthy()
    expect(cart.status).toBe('draft')
  })
})