/**
 * special thanks to hexo-theme-yilia
 * https://github.com/litten/hexo-theme-yilia/blob/master/source-src/js/share.js
 */

import qrcode from 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/+esm'

function initQR(sURL) {
  const typeNumber = 0
  const errorCorrectionLevel = 'L'
  const qr = qrcode(typeNumber, errorCorrectionLevel)
  qr.addData(sURL)
  qr.make()
  document.getElementsByClassName('share-qrcode')[0].innerHTML =
    qr.createImgTag()
}

function generate(templateURL, param) {
  const shareURL = templateURL
    .replace(/<%-sURL%>/g, encodeURIComponent(param.sURL))
    .replace(/<%-sTitle%>/g, param.sTitle)
    .replace(/<%-sDesc%>/g, param.sDesc)
    .replace(/<%-sAuthor%>/g, param.sAuthor)
    .replace(/<%-sImg%>/g, encodeURIComponent(param.sImg))
  window.open(shareURL)
}

function handleShareClick(type, param) {
  if (type === 'weibo') {
    generate(
      'http://service.weibo.com/share/share.php?url=<%-sURL%>&title=<%-sTitle%>&pic=<%-sImg%>',
      param,
    )
  } else if (type === 'qzone') {
    generate(
      'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=<%-sURL%>&title=<%-sTitle%>&pics=<%-sImg%>&summary=<%-sDesc%>',
      param,
    )
  } else if (type === 'facebook') {
    generate('https://www.facebook.com/sharer/sharer.php?u=<%-sURL%>', param)
  } else if (type === 'twitter') {
    generate(
      'https://twitter.com/intent/tweet?text=<%-sTitle%>&url=<%-sURL%>&via=<%-sAuthor%>',
      param,
    )
  } else if (type === 'qr') {
    // pre init qr
  }
}

function resolveAbsoluteUrl(url, baseUrl = window.location.href) {
  if (!url) {
    return ''
  }
  if (/^https?:\/\//i.test(url)) {
    return url
  }
  if (url.startsWith('//')) {
    return `${window.location.protocol}${url}`
  }
  try {
    return new URL(url, baseUrl).href
  } catch (error) {
    console.warn('Failed to resolve absolute URL for share asset:', url, error)
    return url
  }
}

function getArticleExcerpt(limit = 120) {
  const article = document.querySelector('.article-entry')
  if (!article) {
    return ''
  }
  const text = article.innerText.replace(/\s+/g, ' ').trim()
  if (!text) {
    return ''
  }
  if (text.length <= limit) {
    return text
  }
  return `${text.substring(0, limit)}...`
}

function init() {
  const shareWrapper = document.querySelector('.share-list')
  if (!shareWrapper) {
    return
  }

  // Get share data from template-provided data attributes
  const dataset = shareWrapper.dataset || {}
  const sURL = resolveAbsoluteUrl(dataset.url) || window.location.href
  const titleElement = document.querySelector('title')
  const fallbackTitle = titleElement?.textContent || document.title
  const sTitle = dataset.title || fallbackTitle || ''
  const sDesc = dataset.desc || getArticleExcerpt(120)

  const metaAuthor = document
    .querySelector('meta[name="author"]')
    ?.getAttribute('content')
  const sAuthor = dataset.author || metaAuthor || (window.siteMeta?.author || '')

  // Get image from data-cover attribute or fallback to first article image
  let sImg = dataset.cover || ''
  if (!sImg) {
    const firstImg = document.querySelector('.article-entry img')
    if (firstImg) {
      sImg = firstImg.getAttribute('src') || ''
    }
  }
  // Resolve to absolute URL
  sImg = resolveAbsoluteUrl(sImg, sURL)

  const param = {
    sURL,
    sTitle,
    sImg,
    sDesc,
    sAuthor,
  }

  initQR(param.sURL)
  shareWrapper.addEventListener('click', function (e) {
    const type = e.target.getAttribute('data-type')
    if (!type) {
      return
    }
    handleShareClick(type, param)
  })
}

init()
