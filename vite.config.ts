import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import frontMatter from "front-matter";

const markdownProcessor = {
  name: "markdown-processor",
  transform: (code, id) => {
    if (!id.endsWith(".md")) return null;

    const { attributes, body } = frontMatter(code);

    return `export default ${JSON.stringify({
      ...attributes as any,
      body,
    })}`;
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), markdownProcessor],
});
