import type { APIRequestContext } from '@playwright/test'

/**
 * Get an admin authentication token
 * 
 * @param request - Playwright request context
 * @param email - Admin email (default: admin@test.com)
 * @param password - Admin password (default: supersecret)
 * @returns The JWT token string
 */
export async function getAdminToken(
  request: APIRequestContext,
  email: string = 'admin@test.com',
  password: string = 'supersecret'
): Promise<string> {
  const response = await request.post('http://localhost:9000/auth/user/emailpass', {
    data: { email, password }
  })

  if (!response.ok()) {
    throw new Error(`Authentication failed: ${response.status()}`)
  }

  const data = await response.json()
  
  if (!data.token) {
    throw new Error('No token received from authentication')
  }

  return data.token
}

/**
 * Make an authenticated admin API request
 * 
 * Helper to simplify making requests with auth token
 */
export async function makeAdminRequest(
  request: APIRequestContext,
  method: string,
  url: string,
  data?: any
) {
  const token = await getAdminToken(request)
  
  return await request.fetch(`http://localhost:9000${url}`, {
    method: method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: data
  })
}