import AnchorJS from 'https://cdn.jsdelivr.net/npm/anchor-js@5.0.0/+esm'
import toc from './toc.js'
import ensureFontAwesome from './fontawsome.js'

const init = function () {
  ensureFontAwesome().catch((error) => {
    console.error('Failed to load Font Awesome assets.', error)
  })

  // Remove site intro image placeholder
  const $introImg = $('.site-intro-img:first'),
    $introPlaceholder = $('.site-intro-placeholder:first'),
    bgCSS = $introImg.length ? $introImg.css('background-image') : undefined,
    bgRegResult =
      typeof bgCSS === 'string' ? bgCSS.match(/url\("*([^"]*)"*\)/) : null

  if (!$introImg.length || !bgRegResult || bgRegResult.length < 2) {
    console.warn(
      "Site intro image element not found or background image not set. This is expected if the current page doesn't have an intro image.",
    )
  } else {
    const bgURL = bgRegResult[1],
      img = new Image()

    img.onload = () => {
      $introPlaceholder.remove()
      console.info('site intro image loaded.')
    }
    img.src = bgURL
  }

  // Dom content loaded event
  document.addEventListener(
    'DOMContentLoaded',
    function () {
      $('.container').removeClass('container-unloaded')
      $('.footer').removeClass('footer-unloaded')
      $('.loading').remove()

      // Init anchors
      // https://www.bryanbraun.com/anchorjs/
      const anchors = new AnchorJS()
      anchors.options = {
        placement: 'right',
        class: 'anchorjs-archer',
      }
      anchors.add()

      // As headers' absolute offset-y can be queried properly
      // after remove container's `container-unloaded` class,
      // so we should init toc here for better performance.
      toc()
    },
    false,
  )
}

export default init
