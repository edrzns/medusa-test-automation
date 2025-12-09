import { test, expect } from '@playwright/test'
import { getAdminToken } from '../helpers/auth'

test.describe('Admin Authentication', () => {
  
  test('should login with valid credentials', async ({ request }) => {
    // This should not throw an error
    const token = await getAdminToken(request)
    
    // Token should be a non-empty string
    expect(token).toBeTruthy()
    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(0)
  })

  test('should fail with invalid password', async ({ request }) => {
    // Try to login with wrong password
    await expect(async () => {
      await getAdminToken(request, 'admin@test.com', 'wrongpassword')
    }).rejects.toThrow('Authentication failed: 401')
  })

  test('should fail with invalid email', async ({ request }) => {
    // Try to login with non-existent email
    await expect(async () => {
      await getAdminToken(request, 'fake@test.com', 'supersecret')
    }).rejects.toThrow('Authentication failed')
  })

  test('should use token to access protected endpoint', async ({ request }) => {
    // Get a valid token
    const token = await getAdminToken(request)
    
    // Use token to make authenticated request
    const response = await request.get('http://localhost:9000/admin/products', {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    // Should successfully access admin endpoint
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)
  })
})