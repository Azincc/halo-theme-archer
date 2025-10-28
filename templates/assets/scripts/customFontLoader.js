const fontName = window.customFontName
const fontUrl = window.customFontUrl

const loadCustomFont = async () => {
  if (!fontName || !fontUrl) {
    return
  }

  const { default: WebFont } = await import(
    'https://cdn.jsdelivr.net/npm/webfontloader@1.6.28/+esm'
  )

  WebFont.load({
    custom: {
      families: [fontName],
      urls: [fontUrl],
    },
    loading: () => {
      console.log(`Loading custom font: ${fontUrl}`)
    },
    active: () => {
      console.log('Custom font active!')
    },
    inactive: () => {
      console.error(
        'Custom font inactive. Please check network, font name and load urls.',
      )
    },
  })

  const root = document.documentElement
  const customBaseFontFamily =
    fontName.split(':')[0] +
    ', ' +
    getComputedStyle(root).getPropertyValue('--base-font-family')
  root.style.setProperty('--base-font-family', customBaseFontFamily)
}

if (fontName && fontUrl) {
  window.addEventListener('DOMContentLoaded', () => {
    loadCustomFont().catch((error) => {
      console.error('Failed to load custom font', error)
    })
  })
}
