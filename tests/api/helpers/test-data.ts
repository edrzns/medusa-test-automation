import { randomBytes } from "crypto";

interface ProductData {
  title: string;
  options: Array<{
    title: string;
    values: string[];
  }>;
  handle?: string;
}

/**
 * Generate a unique random string for test data
 */
function generateRandomString(length: number = 4): string {
  return randomBytes(length).toString("hex");
}

/**
 * Generate test product data with unique identifiers
 *
 * @param overrides - Optional fields to override defaults
 * @returns Product data ready for API request
 */
export function generateTestProduct(
  overrides?: Partial<ProductData>
): ProductData {
  const timestamp = Date.now();
  const random = generateRandomString();

  const baseProduct: ProductData = {
    title: `Test Product ${timestamp}-${random}`,
    options: [
      {
        title: "Size",
        values: ["M"],
      },
    ],
  };

  return { ...baseProduct, ...overrides };
}
