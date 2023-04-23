import svgLoader from 'vite-svg-loader'
import { defineConfig } from 'vite'
export default defineConfig({
  plugins: [
    svgLoader()
  ],
})
