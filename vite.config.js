import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import frontMatter from 'front-matter'

const markdownProcessor = {
  name: 'markdown-processor',
  transform: (code, id) => {
    if (!id.endsWith('.md')) return null

    const { attributes, body } = frontMatter(code)

    return `export default ${JSON.stringify({
      ...attributes,
      body,
    })}`
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), markdownProcessor],
})
