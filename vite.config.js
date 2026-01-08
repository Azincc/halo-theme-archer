import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    build: {
        // Output to templates/assets/dist
        outDir: path.resolve(__dirname, 'templates/assets/dist'),
        emptyOutDir: true, // Clean the output directory before building
        manifest: true, // Generate manifest.json for easier asset loading in backend integration (optional but good)
        minify: 'terser', // 使用 terser 进行压缩
        terserOptions: {
            compress: {
                drop_console: true, // 生产环境移除 console.log
                drop_debugger: true, // 移除 debugger
                pure_funcs: ['console.log', 'console.info'], // 移除特定函数调用
            },
        },
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'src/scripts/main.js'),

                share: path.resolve(__dirname, 'src/scripts/share.js'),
                // CSS Entries
                base: path.resolve(__dirname, 'src/styles/base.css'),
                sidebar: path.resolve(__dirname, 'src/styles/sidebar.css'),
                post: path.resolve(__dirname, 'src/styles/post.css'),

                mobile: path.resolve(__dirname, 'src/styles/mobile.css'),
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
