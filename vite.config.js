import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `base` matches the GitHub Pages project path: https://<user>.github.io/EHP_CIS_2026/
export default defineConfig({
  base: '/EHP_CIS_2026/',
  // GitHub Pages serves the `docs/` folder of the main branch.
  build: {
    outDir: 'docs',
  },
  plugins: [react()],
})
