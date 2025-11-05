# Vite JavaScript Bundling Testing Guide

## Overview

This document explains how to verify that the Vite JavaScript bundling with code-splitting is working correctly.

## Quick Verification Checklist

### 1. Page Loading Verification

Start the application server and visit pages, check:

- [ ] Pages load normally without white screen
- [ ] Console shows Archer theme version information
- [ ] No JavaScript errors (except expected warnings)

### 2. Bundle Loading Verification

Open browser developer tools Network panel, check:

- [ ] `app.js` loads with defer attribute (type: `script`)
- [ ] Built files load from `/assets/build/js/` directory
- [ ] Cache-busting parameter `v=1.0.0` is present in URLs
- [ ] CDN resources load successfully (anchor-js, perfect-scrollbar, etc.)
- [ ] No 404 errors for JavaScript files

### 3. Code Splitting Verification

#### 3.1 Non-Post Pages (index, archives, tags, categories)
- [ ] Only `app.js` loads (no `post.js`)
- [ ] Console shows global initialization messages
- [ ] No share functionality present (as expected)

#### 3.2 Post Pages
- [ ] `app.js` loads first
- [ ] `post.js` loads dynamically (check Network panel for lazy load)
- [ ] Console shows "Post-specific JS loaded" message
- [ ] Share functionality is available

### 4. Functionality Verification

#### 4.1 Theme Switching
- [ ] Click theme toggle button in top-right corner
- [ ] Page correctly switches between light/dark themes
- [ ] Theme setting persists after page refresh

#### 4.2 Sidebar
- [ ] Click menu button, sidebar expands correctly
- [ ] Sidebar tabs can switch (About/Tags/Categories)
- [ ] Clicking tags/categories filters article list

#### 4.3 Table of Contents (TOC)
On article pages:
- [ ] TOC displays correctly on the right side
- [ ] Current section highlights in TOC when scrolling
- [ ] Clicking TOC items jumps to corresponding sections
- [ ] TOC can collapse/expand

#### 4.4 Scroll Effects
- [ ] Top header shows/hides correctly when scrolling down
- [ ] Back-to-top button appears after scrolling to certain position
- [ ] Clicking back-to-top smoothly scrolls to top

#### 4.5 Image Functionality
On article pages with images:
- [ ] Images load and display normally
- [ ] Clicking images opens Fancybox for larger view
- [ ] Can switch between images in gallery mode

#### 4.6 Donation Button (Post Pages)
- [ ] Donation button appears after reading 50%+ of article
- [ ] Clicking donation button shows donation QR code
- [ ] Clicking again closes the popup

#### 4.7 Share Functionality (Post Pages)
- [ ] Share buttons display correctly
- [ ] Clicking share buttons shares to various platforms
- [ ] QR code generates correctly

#### 4.8 Search Functionality (if Algolia enabled)
- [ ] Clicking search icon shows search popup
- [ ] Typing keywords searches articles
- [ ] Search results display correctly
- [ ] Clicking results navigates to articles

### 5. Font Awesome Icons Verification
- [ ] Icons display normally (not boxes or question marks)
- [ ] Console shows "Font Awesome loaded successfully"

### 6. Console Output Verification

Open browser console, should see:

```
🎯 halo-theme-archer ⬇️
🏷 Version: 1.0.0
📅 Version date: 20241105
📦 https://github.com/Azincc/halo-theme-archer
site intro image loaded.
Font Awesome loaded successfully
```

On post pages, should also see:
```
Post-specific JS loaded
```

Should NOT see these errors:
- ❌ "Failed to load module"
- ❌ "Cannot find module"
- ❌ "SyntaxError"
- ❌ "404 (Not Found)" for built assets

## Performance Verification

### Bundle Size Analysis
- [ ] `app.js` ~17KB (minified)
- [ ] `post.js` ~1.6KB (minified)
- [ ] `vendor.js` minimal or empty
- [ ] Total JavaScript on non-post pages reduced vs baseline

### Loading Performance
- [ ] JavaScript loads with `defer` attribute (non-blocking)
- [ ] Post-specific JavaScript only loads on post pages
- [ ] Cache-busting works with theme version parameter
- [ ] Lighthouse shows reduced main-thread blocking by JS

## Development Testing

### Build Process Testing
- [ ] `npm run dev` starts development server successfully
- [ ] `npm run build` creates production bundles
- [ ] Built files appear in `/templates/assets/build/js/`
- [ ] Bundle names are stable (app.js, post.js, vendor.js)

### Source Map Testing (Development)
- [ ] Source maps are generated in development mode
- [ ] Debugging works in browser dev tools
- [ ] Original source files are traceable

## Debugging Tips

### Common Issues

#### 1. Bundle Loading Issues
**Symptoms**: Console shows "Failed to load resource" for built assets

**Solutions**:
- Check that `npm run build` was run
- Verify built files exist in `/templates/assets/build/js/`
- Check template references use correct paths with version parameter

#### 2. Code Splitting Not Working
**Symptoms**: `post.js` loads on all pages

**Solutions**:
- Check `window.PAGE.isPost` flag is set correctly in layout.html
- Verify conditional import logic in `src/main.js`
- Check browser Network panel for loading patterns

#### 3. Cache Issues
**Symptoms**: Old JavaScript loads after theme updates

**Solutions**:
- Verify theme version parameter is present in script URLs
- Check `theme.spec.version` is updated in theme.yaml
- Force browser refresh with Ctrl+F5

### Developer Tools Usage

1. **View Bundle Dependencies**
   - Open Sources panel
   - Expand `(index)` → `top` → `templates/assets/build/js`
   - View loaded bundles

2. **Network Analysis**
   - Open Network panel
   - Filter by JS files
   - Check loading timing and order
   - Verify lazy loading of post.js

3. **Console Debugging**
   - Open Console panel
   - Look for bundle loading messages
   - Check for code splitting verification messages

## Browser Compatibility Testing

Test in following browsers:
- [ ] Chrome/Edge latest versions
- [ ] Firefox latest versions  
- [ ] Safari latest versions (Mac)

## Mobile Testing

Test using responsive mode or actual mobile devices:
- [ ] Mobile layout correct
- [ ] Touch operations work normally
- [ ] Sidebar expands/collapses correctly on mobile
- [ ] Code splitting works on mobile browsers

## Success Criteria

If all above checks pass, the Vite bundling with code-splitting is working correctly!

## Next Steps

- If all tests pass, the theme is ready for production use
- For issues, check bundle generation and template references
- Consider performance monitoring in production environment