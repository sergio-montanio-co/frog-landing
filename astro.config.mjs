import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import node from '@astrojs/node'

// output: 'static' keeps /, /privacy, /terms prerendered as HTML.
// The node adapter (middleware mode) lets /join/[code] render on-demand
// via server.mjs, which mounts the Astro handler after the static layer.
export default defineConfig({
  site: 'https://frg.lat',
  output: 'static',
  adapter: node({ mode: 'middleware' }),
  integrations: [tailwind()],
})
