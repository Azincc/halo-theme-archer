const FONT_AWESOME_VERSION = '5.15.4'
const CSS_URL = `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@${FONT_AWESOME_VERSION}/css/all.min.css`
const JS_URL = `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@${FONT_AWESOME_VERSION}/js/all.min.js`
const CSS_ID = 'archer-fontawesome-css'
const SCRIPT_ID = 'archer-fontawesome-js'

const appendStylesheet = () =>
  new Promise((resolve, reject) => {
    if (document.getElementById(CSS_ID)) {
      resolve()
      return
    }
    const link = document.createElement('link')
    link.id = CSS_ID
    link.rel = 'stylesheet'
    link.href = CSS_URL
    link.onload = () => resolve()
    link.onerror = (error) => reject(error)
    document.head.appendChild(link)
  })

const appendScript = () =>
  new Promise((resolve, reject) => {
    if (document.getElementById(SCRIPT_ID) || window.FontAwesome) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = JS_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = (error) => reject(error)
    document.head.appendChild(script)
  })

export default async function ensureFontAwesome() {
  await appendStylesheet()
  await appendScript()
}
