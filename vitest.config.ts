import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid({ ssr: false })],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/**/*.{test,spec}.{js,ts,tsx}"],
    exclude: ["node_modules", "dist", "build", "coverage"],
  },
  resolve: {
    conditions: ["browser", "development"],
    alias: {
      "solid-js/web": "solid-js/web/dist/web.js",
      "solid-js": "solid-js/dist/solid.js",
    },
  },
  define: {
    "import.meta.env.SSR": false,
    "import.meta.env.DEV": true,
  },
});
