import { PluginOption } from "vite";
import frontMatter from "front-matter";
import { FrontMatter } from "../types/commands";

export const markdownProcessor: PluginOption = {
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
