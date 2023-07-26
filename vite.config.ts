import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import { markdownProcessor } from "./src/plugins/markdown-processor";
import { noScript } from "./src/plugins/no-script";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [noScript, react(), markdownProcessor],
  test: {
    environment: "happy-dom",
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            const name = id.replace(/^.*node_modules\//, "").replace(/\/.*$/, "");
            switch (name) {
              case "react":
              case "react-dom":
                return "react";
              case "mobx":
              case "mobx-react-lite":
                return "mobx";
              default:
                return "vendor";
            }
          }
        
          if (id.includes(".md")) {
            return "commands";
          }
        }
      },
    },
  }
});
