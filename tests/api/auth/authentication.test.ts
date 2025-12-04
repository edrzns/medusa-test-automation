import { describe, it, expect, beforeAll } from "vitest";
import { MedusaApiClient } from "../helpers/api-client";

describe("Admin Authentication", () => {
  let client: MedusaApiClient;

  beforeAll(() => {
    client = new MedusaApiClient();
  });

  it("should authenticate with valid credentials", async () => {
    // 1. Call client.authenticate() with admin@test.com / supersecret
    // 2. Verify no error is thrown
    await expect(
      client.authenticate("admin@test.com", "supersecret")
    ).resolves.not.toThrow();

    // 3. Make an authenticated request to /admin/products
    const response = await client.admin({
      method: "GET",
      url: "/admin/products",
    });

    // 4. Verify response status is 200
    expect(response.status).toBe(200);
  });

  it("should fail with invalid credentials", async () => {
    await expect(
      client.authenticate("admin@test.com", "badpassword")
    ).rejects.toThrow(/Authentication failed/);
  });

  it("should fail when making admin request without auth", async () => {
    const unauthenticatedClient = new MedusaApiClient();

    await expect(
      unauthenticatedClient.admin({ method: "GET", url: "/admin/products" })
    ).rejects.toThrow(/Not authenticated/);
  });
});
