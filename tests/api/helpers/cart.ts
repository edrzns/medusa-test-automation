import type { APIRequestContext } from "@playwright/test";
import { makeAdminRequest } from "./auth";

/**
 * Create a new draft order (admin equivalent of cart)
 *
 * Note: This Medusa version doesn't support line-item manipulation
 * via draft-order endpoints. Items must be added during creation
 * or the draft-order must be converted to a full order.
 */
export async function createCart(request: APIRequestContext) {
  // Get a valid region first
  const regionsResponse = await makeAdminRequest(
    request,
    "GET",
    "/admin/regions"
  );
  const regionsData = await regionsResponse.json();

  if (!regionsData.regions || regionsData.regions.length === 0) {
    throw new Error("No regions available. Run seed data.");
  }

  const regionId = regionsData.regions[0].id;

  // Create draft order with minimal required fields
  const response = await makeAdminRequest(
    request,
    "POST",
    "/admin/draft-orders",
    {
      region_id: regionId,
      email: `test-${Date.now()}@example.com`,
      items: [],
    }
  );

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`Failed to create cart: ${response.status()} - ${body}`);
  }

  const data = await response.json();
  return data.draft_order;
}

/**
 * Get draft order by ID
 */
export async function getCart(request: APIRequestContext, cartId: string) {
  const response = await makeAdminRequest(
    request,
    "GET",
    `/admin/draft-orders/${cartId}`
  );

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`Failed to get cart: ${response.status()} - ${body}`);
  }

  const data = await response.json();
  return data.draft_order;
}
