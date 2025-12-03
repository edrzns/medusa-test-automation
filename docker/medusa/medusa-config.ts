import { defineConfig } from "@medusajs/framework/utils";

export default defineConfig({
  projectConfig: {
    databaseDriverOptions: {
      connection: {
        ssl: false,
      },
    },
  },
});
