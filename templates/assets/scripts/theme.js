const THEME_DARK_STYLESHEET_ID = 'stylesheet-theme-dark'
const $themeModeSwitchBtn = $('.header-theme-btn')

const ensureDarkStylesheet = () => {
  const root = window.siteMeta?.root || '/'
  const normalizedRoot = root.endsWith('/') ? root : `${root}/`
  if ($(`link#${THEME_DARK_STYLESHEET_ID}`).length === 0) {
    $('<link>')
      .attr({
        id: THEME_DARK_STYLESHEET_ID,
        rel: 'stylesheet',
        type: 'text/css',
        href: `${normalizedRoot}assets/css/dark.css`,
      })
      .appendTo('head')
  }
}

const removeDarkStylesheet = () => {
  $(`link#${THEME_DARK_STYLESHEET_ID}`).remove()
}

const resolveSystemThemeMode = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

/** 获取用户偏好的主题颜色模式 */
const getPreferredThemeMode = () => {
  const storedMode = localStorage.preferredThemeMode
  if (storedMode === 'dark' || storedMode === 'light') {
    return storedMode
  }
  return resolveSystemThemeMode()
}

const setThemeModeSwitchBtnActive = (active) => {
  if (active) {
    $themeModeSwitchBtn.removeClass('header-theme-btn-disabled')
  } else {
    $themeModeSwitchBtn.addClass('header-theme-btn-disabled')
  }
}

const setThemeMode = (mode) => {
  setThemeModeSwitchBtnActive(false)
  const normalizedMode = mode === 'dark' ? 'dark' : 'light'
  if (normalizedMode === 'dark') {
    ensureDarkStylesheet()
  } else {
    removeDarkStylesheet()
  }
  localStorage.preferredThemeMode = normalizedMode
  setThemeModeSwitchBtnActive(true)
}

const switchThemeMode = () => {
  const nextMode = getPreferredThemeMode() === 'dark' ? 'light' : 'dark'
  setThemeMode(nextMode)
}

export const initializeColorScheme = (mode = 'system') => {
  const normalized =
    mode === 'dark' || mode === 'light' ? mode : resolveSystemThemeMode()
  setThemeMode(normalized)
}

/** 初始化切换主题颜色模式功能 */
const initTheme = () => {
  setThemeMode(getPreferredThemeMode())

  $themeModeSwitchBtn.off('click.archer-theme')
  $themeModeSwitchBtn.on('click.archer-theme', () => {
    switchThemeMode()
  })
}

export default initTheme
