import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class MedusaApiClient {
  private client: AxiosInstance;
  private authToken?: string;

  constructor(baseURL: string = "http://localhost:9000") {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      // Don't throw on HTTP errors - let tests handle them
      validateStatus: () => true,
    });
  }

  // Authenticate with Medusa admin API
  async authenticate(email: string, password: string): Promise<void> {
    // Medusa v2 uses /auth/user/emailpass
    const response = await this.client.post("/auth/user/emailpass", {
      email,
      password,
    });

    if (response.status !== 200) {
      const error = new Error(`Authentication failed: ${response.status}`);
      // @ts-ignore - adding custom property
      error.response = response;
      throw error;
    }

    // Medusa v2 returns 'token' not 'access_token'
    if (!response.data?.token) {
      throw new Error(
        `Invalid auth response structure: ${JSON.stringify(response.data)}`
      );
    }

    // Store token and add to default headers
    this.authToken = response.data.token;
    this.client.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.token}`;
  }

  // Make authenticated requests to admin endpoints
  async admin(config: AxiosRequestConfig) {
    if (!this.authToken) {
      throw new Error("Not authenticated. Call authenticate() first.");
    }

    return this.client.request(config);
  }

  // Make requests to store (non-admin) endpoints
  async store(config: AxiosRequestConfig) {
    return this.client.request(config);
  }

  // Utility method to clear auth
  clearAuth(): void {
    this.authToken = undefined;
    delete this.client.defaults.headers.common["Authorization"];
  }
}
