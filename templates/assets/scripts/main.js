import init from './init.js'
// import initMobile from './mobile.js'
import initTheme, { initializeColorScheme } from './theme.js'
import initImage from './image.js'
import initScroll from './scroll.js'
import initSidebar from './initSidebar.js'
import initDonate from './donate.js'

// print console info
const logStyle =
  'color: #fff; background: #f75357; padding: 1px; border-radius: 5px;'
const packageInfo = {
  name: 'hexo-theme-archer',
  version: '1.7.0',
  versionDate: '20240720',
  homepage: 'https://github.com/fi3ework/hexo-theme-archer'
}
console.info(`%c 🎯 ${packageInfo.name} ⬇️ `, logStyle)
console.info(`%c 🏷 Version: ${packageInfo.version} `, logStyle)
console.info(`%c 📅 Version date: ${packageInfo.versionDate} `, logStyle)
console.info(`%c 📦 ${packageInfo.homepage} `, logStyle)

// site base
init()

// optimizations for mobile device
// initMobile()

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
