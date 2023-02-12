import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import frontMatter from "front-matter";

const markdownProcessor: PluginOption = {
  name: "markdown-processor",
  transform: (code, id) => {
    if (!id.endsWith(".md")) return null;

    const { attributes, body } = frontMatter<object>(code);

    return {
      code: `export default ${JSON.stringify({
        ...attributes,
        body,
      })}`,
      map: null, 
    };
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), markdownProcessor],
  build: {
    sourcemap: true,
  }
});
