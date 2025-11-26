import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
	integrations: [
		react(),
		tailwind({
			applyBaseStyles: false
		})
	],
	base: '/build-log',
	outDir: '../../dist/build-log',
	publicDir: 'public',
	build: {
		format: 'directory'
	}
})
