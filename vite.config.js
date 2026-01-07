import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    build: {
        // Output to templates/assets/dist
        outDir: path.resolve(__dirname, 'templates/assets/dist'),
        emptyOutDir: true, // Clean the output directory before building
        manifest: true, // Generate manifest.json for easier asset loading in backend integration (optional but good)
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'src/scripts/main.js'),

                share: path.resolve(__dirname, 'src/scripts/share.js'),
                // CSS Entries
                base: path.resolve(__dirname, 'src/styles/base.css'),
                sidebar: path.resolve(__dirname, 'src/styles/sidebar.css'),
                post: path.resolve(__dirname, 'src/styles/post.css'),

                mobile: path.resolve(__dirname, 'src/styles/mobile.css'),
                dark: path.resolve(__dirname, 'src/styles/dark.css'),
            },
            output: {
                entryFileNames: `[name].js`,
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`,
            },
        },
    },
    server: {
        origin: 'http://localhost:5173', // For HMR (if we were doing full integration)
    },
});
