// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        store: resolve(__dirname, "store.html"),
        team: resolve(__dirname, "team.html"),
        json: resolve(__dirname, "items.json"),
      },
    },
  },
});
