// Global initialization - runs on all pages
import init from '../templates/assets/scripts/init.js'
import initTheme, { initializeColorScheme } from '../templates/assets/scripts/theme.js'
import initImage from '../templates/assets/scripts/image.js'
import initScroll from '../templates/assets/scripts/scroll.js'
import initSidebar from '../templates/assets/scripts/initSidebar.js'
import initDonate from '../templates/assets/scripts/donate.js'

// print console info
const logStyle =
  'color: #fff; background: #f75357; padding: 1px; border-radius: 5px;'
const packageInfo = {
  name: 'halo-theme-archer',
  version: '1.0.0',
  versionDate: '20241105',
  homepage: 'https://github.com/Azincc/halo-theme-archer'
}
console.info(`%c 🎯 ${packageInfo.name} ⬇️ `, logStyle)
console.info(`%c 🏷 Version: ${packageInfo.version} `, logStyle)
console.info(`%c 📅 Version date: ${packageInfo.versionDate} `, logStyle)
console.info(`%c 📦 ${packageInfo.homepage} `, logStyle)

function initGlobal() {
  // site base
  init()

  // sidebar
  initSidebar()

  // theme
  initTheme()

  // init image with fancybox
  initImage()

  // scroll event
  initScroll()

  // donate
  initDonate()
}

// Export the main module API for external access
const mainModule = {
  initializeColorScheme
}

window.main = mainModule

// Process any callbacks that were registered before module load
if (window.__archerMainCallbacks && Array.isArray(window.__archerMainCallbacks)) {
  window.__archerMainCallbacks.forEach((callback) => {
    try {
      callback(mainModule)
    } catch (error) {
      console.error('Error in main module callback:', error)
    }
  })
  window.__archerMainCallbacks = []
}

// Make it also available as default export for ES modules
export default mainModule

// Initialize global functionality when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobal)
} else {
  initGlobal()
}

// Lazy load post-specific functionality only on post pages
if (window.PAGE?.isPost) {
  import('./post.js')
}