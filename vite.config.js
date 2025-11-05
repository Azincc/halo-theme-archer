import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'templates/assets/build',
    target: 'es2019',
    minify: 'esbuild',
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      input: 'src/main.js',
      output: {
        entryFileNames: 'js/app.js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: 'assets/[name][extname]',
        manualChunks: {
          vendor: ['qrcode-generator']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: false
  }
})