import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import frontMatter from "front-matter";
import { FrontMatter } from "./src/types/commands";

const markdownProcessor: PluginOption = {
  name: "markdown-processor",
  transform: (markdown, id) => {
    if (!id.endsWith(".md")) return null;
    
    const { attributes, body } = frontMatter<FrontMatter>(markdown);

    const code = Object.entries({ ...attributes, body }).map(([key, value]) => {
      return `export const ${key} = ${JSON.stringify(value)};`;
    }).join("\n");

    return {
      code,
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
