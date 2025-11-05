# Vite JavaScript Bundling Setup

This theme now uses Vite for JavaScript bundling with code-splitting to improve load performance.

## Project Structure

```
src/
├── main.js     # Global functionality (loaded on all pages)
└── post.js     # Post-specific functionality (lazy-loaded on post pages)

templates/assets/build/
├── js/
│   ├── app.js      # Main bundle with global functionality
│   ├── post.js     # Post-specific bundle (lazy-loaded)
│   └── vendor.js   # Third-party libraries (empty in current setup)
```

## Build Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production

## Code Splitting Strategy

1. **app.js** - Contains global functionality that runs on all pages
2. **post.js** - Contains post-specific features (like share functionality), only loaded on post pages
3. **vendor.js** - Third-party libraries (currently empty as qrcode-generator is bundled with post.js)

## Cache Busting

Built assets use the theme version parameter for cache busting:
```html
<script defer th:src="@{/assets/build/js/app.js(v=${theme.spec.version})}"></script>
```

## Features

- ✅ Tree-shaking and minification with esbuild
- ✅ ES2019+ target for modern browsers
- ✅ Source maps in development mode
- ✅ Lazy loading of post-specific JavaScript
- ✅ Defer loading to prevent render blocking
- ✅ Stable filenames for predictable caching

## Development

When developing JavaScript features:

1. Edit files in `src/` directory
2. Run `npm run dev` for development with hot reload
3. Run `npm run build` to create production bundles
4. Built files are automatically committed to the repository for theme distribution

## Implementation Details

- Page type detection is handled via `window.PAGE.isPost` flag in templates
- Dynamic imports are used for lazy loading post.js on post pages only
- Vite configuration outputs to `templates/assets/build/` for Halo compatibility
- Manual chunks configuration separates vendor libraries for better caching