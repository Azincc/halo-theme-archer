import Sidebar from './sidebar.js'
import InitSidebarLink from './tag.js'

const initSidebar = () => {
  // Check if sidebar element exists before initialization
  if (!document.querySelector('.sidebar')) {
    console.warn('Sidebar element not found. Skipping sidebar initialization.')
    return { sidebar: null, metas: null }
  }

  // create sidebar object
  const sidebar = new Sidebar({
    sidebar: '.sidebar',
    nav: '.sidebar-tabs',
    tabs: '.sidebar-tabs li',
    content: '.sidebar-content',
    panels: '.sideabar-contents > div',
    menuButton: '.header-sidebar-menu',
  })

  // create sidebar metas object
  const metas = new InitSidebarLink(sidebar)

  // add tabs to sidebar metas
  metas.addTab({
    metaName: 'tags',
    labelsContainer: '.sidebar-tags-name',
    postsContainer: '.sidebar-tags-list',
  })
  metas.addTab({
    metaName: 'categories',
    labelsContainer: '.sidebar-categories-name',
    postsContainer: '.sidebar-categories-list',
  })

  return { sidebar, metas }
}

export default initSidebar
